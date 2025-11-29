import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema walidacji
const generateSchema = z.object({
	prompt: z.string().min(1, 'Opis jest wymagany'),
	image: z.string().min(100, 'Obraz jest wymagany'),
	model: z.string().optional().default('gemini-1.5-flash'),
	mask: z.string().optional(), // Opcjonalna maska dla Brush Mode (inpainting)
});

// Typy
interface GenerateRequest {
	prompt: string;
	image: string;
	model?: string;
	mask?: string;
}

interface GeminiResponse {
	candidates?: Array<{
		content?: {
			parts?: Array<{
				text?: string;
				inlineData?: {
					mimeType: string;
					data: string;
				};
			}>;
		};
	}>;
	error?: {
		message: string;
		code?: number;
	};
}

// Funkcja pomocnicza dla timeout
const fetchWithTimeout = async (
	url: string,
	options: RequestInit,
	timeoutMs: number = 30000
): Promise<Response> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(timeout);
		return response;
	} catch (error) {
		clearTimeout(timeout);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('Przekroczono limit czasu (30s). Spróbuj ponownie.');
		}
		throw error;
	}
};

export async function POST(request: Request) {
	try {
		// 1. Pobierz i waliduj dane
		const body: unknown = await request.json();
		const validationResult = generateSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Błąd walidacji danych',
					details: validationResult.error.format(),
				},
				{ status: 400 }
			);
		}

		const { prompt, image, model, mask } = validationResult.data;

		// 2. Sprawdź klucz API
		const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

		if (!apiKey) {
			console.error('GOOGLE_GEMINI_API_KEY not configured');
			return NextResponse.json(
				{
					error: 'Konfiguracja serwera nieprawidłowa. Skontaktuj się z administratorem.',
				},
				{ status: 500 }
			);
		}

		// 3. Przygotuj parts - dodaj maskę jeśli dostępna
		const parts: any[] = [
			{ text: prompt },
			{ inlineData: { mimeType: 'image/png', data: image } },
		];

		// Dodaj maskę jeśli jest dostępna (Brush Mode)
		if (mask) {
			parts.push({
				inlineData: { mimeType: 'image/png', data: mask },
			});
		}

		// 4. Wywołaj Gemini API z timeout
		const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

		const response = await fetchWithTimeout(
			apiUrl,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [
						{
							parts,
						},
					],
					generationConfig: { responseModalities: ['IMAGE'] },
				}),
			},
			30000 // 30s timeout
		);

		// 5. Obsłuż odpowiedź
		if (!response.ok) {
			const errorData: GeminiResponse = await response.json();
			console.error('Gemini API Error:', errorData);

			// Przyjazne komunikaty dla użytkownika
			let userMessage = 'Błąd połączenia z AI';
			if (response.status === 429) {
				userMessage = 'Za dużo żądań. Spróbuj ponownie za chwilę.';
			} else if (response.status === 401) {
				userMessage = 'Nieprawidłowy klucz API.';
			} else if (response.status === 400) {
				userMessage = 'Nieprawidłowe dane. Sprawdź zdjęcie i spróbuj ponownie.';
			}

			return NextResponse.json(
				{
					error: userMessage,
					code: response.status,
				},
				{ status: response.status }
			);
		}

		const data: GeminiResponse = await response.json();

		// 6. Zwróć wynik
		return NextResponse.json(data);
	} catch (error) {
		console.error('API Handler Error:', error);

		// Sprawdź czy to błąd timeout
		if (error instanceof Error && error.message.includes('limit czasu')) {
			return NextResponse.json(
				{ error: error.message },
				{ status: 408 } // Request Timeout
			);
		}

		return NextResponse.json(
			{
				error: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
			},
			{ status: 500 }
		);
	}
}
