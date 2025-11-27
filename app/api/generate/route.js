import { NextResponse } from 'next/server';
import { z } from 'zod';

const generateSchema = z.object({
	prompt: z.string().min(1, 'Opis jest wymagany'),
	image: z.string().refine((val) => {
		// Sprawdź czy to poprawny base64 (uproszczone sprawdzenie)
		// Zazwyczaj base64 image zaczyna się od data:image/...;base64,
		// Ale tutaj sprawdzamy tylko czy jest stringiem i nie pustym.
		// Można dodać regex jeśli potrzeba ścisłej walidacji.
		return val.length > 0;
	}, 'Obraz jest wymagany i musi być poprawnym ciągiem znaków'),
	model: z.string().optional().default('gemini-1.5-flash'),
});

export async function POST(request) {
	try {
		// 1. Pobierz dane od użytkownika (prompt i obrazek)
		const body = await request.json();

		// Walidacja Zod
		const validationResult = generateSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ error: 'Błąd walidacji danych', details: validationResult.error.format() },
				{ status: 400 }
			);
		}

		const { prompt, image, model } = validationResult.data;

		// 2. Pobierz Twój tajny klucz z bezpiecznego sejfu (Zmienne Środowiskowe)
		const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'Brak konfiguracji klucza API' },
				{ status: 500 }
			);
		}

		// 3. Wyślij zapytanie do Google (to dzieje się na serwerze, nikt tego nie widzi)
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{ text: prompt },
								{ inlineData: { mimeType: 'image/png', data: image } },
							],
						},
					],
					generationConfig: { responseModalities: ['IMAGE'] },
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Gemini API Error:', errorData);
			throw new Error(`Gemini API Error: ${response.statusText}`);
		}

		const data = await response.json();

		// 4. Odeślij wynik do Twojej aplikacji
		return NextResponse.json(data);
	} catch (error) {
		console.error('API Handler Error:', error);
		return NextResponse.json(
			{ error: 'Błąd połączenia z AI' },
			{ status: 500 }
		);
	}
}
