import { NextResponse } from 'next/server';

export async function POST(request) {
	// 1. Pobierz dane od użytkownika (prompt i obrazek)
	const body = await request.json();
	const { prompt, image, model } = body;

	// 2. Pobierz Twój tajny klucz z bezpiecznego sejfu (Zmienne Środowiskowe)
	const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ error: 'Brak konfiguracji klucza API' },
			{ status: 500 }
		);
	}

	try {
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

		const data = await response.json();

		// 4. Odeślij wynik do Twojej aplikacji
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Błąd połączenia z AI' },
			{ status: 500 }
		);
	}
}
