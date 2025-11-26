import { NextResponse } from 'next/server';

export async function POST(request) {
	const body = await request.json();
	const { prompt } = body;
	const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

	if (!apiKey) {
		return NextResponse.json({ error: 'Brak klucza API' }, { status: 500 });
	}

	try {
		// Używamy modelu tekstowego (np. gemini-2.5-flash)
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					// Brak responseModalities=["IMAGE"] -> domyślnie tekst
				}),
			}
		);

		const data = await response.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

		return NextResponse.json({ text });
	} catch (error) {
		return NextResponse.json({ error: 'Błąd AI' }, { status: 500 });
	}
}
