import { useState } from 'react';

interface Modifications {
	facade: string[];
	roof: string[];
	windows: string[];
	ground: string[];
	fence: string[];
	garden: string[];
	lighting: string[];
	extras: string[];
	atmosphere: string[];
	custom: string;
}

interface ActiveSections {
	facade: boolean;
	roof: boolean;
	windows: boolean;
	ground: boolean;
	fence: boolean;
	garden: boolean;
	lighting: boolean;
	extras: boolean;
	atmosphere: boolean;
}

export const useHouseGenerator = (
	originalImage: string | null,
	modifications: Modifications,
	activeSections: ActiveSections,
	maskData: string | null,
	addToHistory: (image: string, mods: Modifications) => void
) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [processingStep, setProcessingStep] = useState('');
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const [error, setError] = useState('');

	const generateVisualization = async () => {
		if (!originalImage) return;
		setIsProcessing(true);
		setProcessingStep('Analiza geometrii...');
		setError('');

		try {
			const promptParts = [];
			const joinSelections = (arr: string[]) =>
				arr.length > 1 ? `połączenie: ${arr.join(' + ')}` : arr[0];

			// Elewacja
			if (activeSections.facade) {
				if (modifications.facade.length)
					promptParts.push(`ELEWACJA: ${joinSelections(modifications.facade)}.`);
			} else {
				promptParts.push(`ELEWACJA: ZACHOWAJ ORYGINAŁ - nie zmieniaj elewacji.`);
			}

			// Dach
			if (activeSections.roof) {
				if (modifications.roof.length)
					promptParts.push(`DACH: ${joinSelections(modifications.roof)}.`);
			} else {
				promptParts.push(`DACH: ZACHOWAJ ORYGINAŁ - nie zmieniaj dachu.`);
			}

			// Stolarka
			if (activeSections.windows) {
				if (modifications.windows.length)
					promptParts.push(`STOLARKA: ${joinSelections(modifications.windows)}.`);
			} else {
				promptParts.push(`STOLARKA: ZACHOWAJ ORYGINAŁ - nie zmieniaj okien i drzwi.`);
			}

			// Teren
			if (activeSections.ground) {
				if (modifications.ground.length)
					promptParts.push(`TEREN: ${joinSelections(modifications.ground)}.`);
			} else {
				promptParts.push(`TEREN: ZACHOWAJ ORYGINAŁ - nie zmieniaj terenu.`);
			}

			// Ogrodzenie
			if (activeSections.fence) {
				if (modifications.fence.length)
					promptParts.push(`OGRODZENIE: ${joinSelections(modifications.fence)}.`);
			} else {
				promptParts.push(`OGRODZENIE: ZACHOWAJ ORYGINAŁ - nie zmieniaj ogrodzenia.`);
			}

			// Roślinność
			if (activeSections.garden) {
				if (modifications.garden.length)
					promptParts.push(`ROŚLINNOŚĆ: ${joinSelections(modifications.garden)}.`);
			} else {
				promptParts.push(`ROŚLINNOŚĆ: ZACHOWAJ ORYGINAŁ - nie zmieniaj roślin.`);
			}

			// Oświetlenie
			if (activeSections.lighting) {
				if (modifications.lighting.length)
					promptParts.push(`OŚWIETLENIE: ${joinSelections(modifications.lighting)}.`);
			} else {
				promptParts.push(`OŚWIETLENIE: ZACHOWAJ ORYGINAŁ - nie dodawaj oświetlenia.`);
			}

			// Dodatki
			if (activeSections.extras) {
				if (modifications.extras.length)
					promptParts.push(`DODATKI: ${joinSelections(modifications.extras)}.`);
			} else {
				promptParts.push(`DODATKI: ZACHOWAJ ORYGINAŁ - nie dodawaj dodatków.`);
			}

			// Atmosfera
			if (activeSections.atmosphere) {
				if (modifications.atmosphere.length)
					promptParts.push(`ATMOSFERA: ${joinSelections(modifications.atmosphere)}.`);
			} else {
				promptParts.push(`ATMOSFERA: ZACHOWAJ ORYGINAŁ - nie zmieniaj pogody i pory dnia.`);
			}

			if (modifications.custom)
				promptParts.push(`INSTRUKCJE: ${modifications.custom}.`);

			const hasSelections = Object.entries(modifications).some(([key, val]) =>
				Array.isArray(val) ? val.length > 0 : !!val
			);
			if (!hasSelections) {
				setError('Wybierz styl.');
				setIsProcessing(false);
				return;
			}

			const promptText = `Jesteś wizualizatorem. Przekształć zdjęcie domu. WYTYCZNE: ${promptParts.join(
				'\n'
			)} ZASADY: 1. Zachowaj geometrię. 2. Fotorealizm.`;

			// Simulate processing steps
			setTimeout(() => setProcessingStep('Renderowanie...'), 2000);

			const base64Image = (currentImage || originalImage).split(',')[1];

			// Przygotuj body requestu
			const requestBody: any = {
				prompt: promptText,
				image: base64Image,
				model: 'gemini-2.5-flash-image-preview',
			};

			// Dodaj maskę jeśli jest dostępna (Brush Mode - inpainting)
			if (maskData) {
				const base64Mask = maskData.split(',')[1];
				requestBody.mask = base64Mask;
				setProcessingStep('Renderowanie wybranych obszarów (Brush Mode)...');
			}

			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody),
			});

			const data = await response.json();

			if (data.error) {
				const errorMsg =
					typeof data.error === 'object'
						? data.error.message || JSON.stringify(data.error)
						: data.error;
				throw new Error(errorMsg);
			}

			const generatedBase64 = data.candidates?.[0]?.content?.parts?.find(
				(p: any) => p.inlineData
			)?.inlineData?.data;

			if (generatedBase64) {
				const newImage = `data:image/png;base64,${generatedBase64}`;
				setCurrentImage(newImage);
				addToHistory(newImage, modifications);
			} else {
				// Diagnostyka - loguj pełną odpowiedź API
				console.error('API Response (brak obrazu):', JSON.stringify(data, null, 2));

				// Sprawdź przyczyny braku obrazu
				if (!data.candidates || data.candidates.length === 0) {
					throw new Error('API nie zwróciło żadnych wyników. Spróbuj uprościć opis lub zmniejszyć obraz.');
				}

				const finishReason = data.candidates[0]?.finishReason;
				if (finishReason === 'SAFETY') {
					throw new Error('🛡️ Filtr bezpieczeństwa zablokował generowanie. Spróbuj zmienić opis lub wybrać inne opcje.');
				}

				if (finishReason === 'RECITATION') {
					throw new Error('⚠️ Wykryto potencjalne naruszenie praw autorskich. Zmień parametry wizualizacji.');
				}

				if (finishReason === 'MAX_TOKENS' || finishReason === 'LENGTH') {
					throw new Error('📏 Żądanie zbyt długie. Uprość opis lub wybierz mniej opcji.');
				}

				if (finishReason === 'OTHER') {
					throw new Error('❌ API zwróciło błąd. Prawdopodobnie zbyt skomplikowany prompt. Spróbuj włączyć mniej sekcji lub uprościć opis.');
				}

				throw new Error('Brak danych obrazu w odpowiedzi API. Powód: ' + (finishReason || 'nieznany') + '. Sprawdź konsolę przeglądarki (F12).');
			}
		} catch (err) {
			console.error('Generation error:', err);

			// Lepsze komunikaty błędów
			let errorMessage = 'Błąd generowania wizualizacji.';

			if (err instanceof Error) {
				if (err.message.includes('Failed to fetch')) {
					errorMessage = 'Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.';
				} else if (err.message.includes('timeout') || err.message.includes('limit czasu')) {
					errorMessage = 'Generowanie trwa zbyt długo. Spróbuj z mniejszym obrazem lub prostszymi modyfikacjami.';
				} else if (err.message.includes('NetworkError')) {
					errorMessage = 'Błąd sieci. Sprawdź połączenie internetowe.';
				} else if (err.message.includes('Za dużo żądań')) {
					errorMessage = err.message; // Użyj komunikatu z API
				} else if (err.message.includes('klucz API')) {
					errorMessage = 'Błąd konfiguracji. Skontaktuj się z administratorem.';
				} else if (err.message.length < 200) {
					// Jeśli komunikat jest krótki, użyj go
					errorMessage = err.message;
				}
			}

			setError(errorMessage);
		} finally {
			setIsProcessing(false);
			setProcessingStep('');
		}
	};

	return {
		isProcessing,
		setIsProcessing,
		processingStep,
		setProcessingStep,
		currentImage,
		setCurrentImage,
		error,
		setError,
		generateVisualization,
	};
};
