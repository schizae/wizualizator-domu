import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema walidacji
const chatSchema = z.object({
	prompt: z.string().min(1, 'Pytanie jest wymagane').max(2000, 'Pytanie zbyt długie (max 2000 znaków)'),
});

// Typy
interface GeminiChatResponse {
	candidates?: Array<{
		content?: {
			parts?: Array<{
				text?: string;
			}>;
		};
	}>;
}

// Funkcja pomocnicza dla timeout
const fetchWithTimeout = async (
	url: string,
	options: RequestInit,
	timeoutMs: number = 15000
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
			throw new Error('Przekroczono limit czasu odpowiedzi AI.');
		}
		throw error;
	}
};

export async function POST(request: Request) {
	try {
		// 1. Walidacja danych
		const body: unknown = await request.json();
		const validationResult = chatSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Nieprawidłowe pytanie',
					details: validationResult.error.format(),
				},
				{ status: 400 }
			);
		}

		const { prompt } = validationResult.data;

		// 2. Sprawdź klucz API
		const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

		if (!apiKey) {
			console.error('GOOGLE_GEMINI_API_KEY not configured');
			return NextResponse.json(
				{ error: 'Konfiguracja serwera nieprawidłowa.' },
				{ status: 500 }
			);
		}

		// 3. Wywołaj Gemini API
		const response = await fetchWithTimeout(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: {
						temperature: 0.7,
						maxOutputTokens: 500,
					},
				}),
			},
			15000 // 15s timeout dla chat (szybszy niż obrazy)
		);

		// 4. Obsłuż błędy API
		if (!response.ok) {
			const errorData = await response.json();
			console.error('Gemini Chat API Error:', errorData);

			let userMessage = 'Błąd AI';
			if (response.status === 429) {
				userMessage = 'Za dużo pytań. Spróbuj ponownie za chwilę.';
			} else if (response.status === 401) {
				userMessage = 'Błąd autoryzacji API.';
			}

			return NextResponse.json({ error: userMessage }, { status: response.status });
		}

		const data: GeminiChatResponse = await response.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!text) {
			return NextResponse.json(
				{ error: 'AI nie zwróciło odpowiedzi. Spróbuj przeformułować pytanie.' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ text });
	} catch (error) {
		console.error('Chat API Handler Error:', error);

		// Sprawdź czy to błąd timeout
		if (error instanceof Error && error.message.includes('limit czasu')) {
			return NextResponse.json(
				{ error: 'AI nie odpowiedziało na czas. Spróbuj ponownie.' },
				{ status: 408 }
			);
		}

		return NextResponse.json(
			{ error: 'Wystąpił błąd. Spróbuj ponownie.' },
			{ status: 500 }
		);
	}
}
