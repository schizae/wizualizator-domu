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

			// ✅ ULEPSONY PROMPT SYSTEMOWY - Pixel-Perfect Quality
			const promptText = `You are a professional architectural visualization AI specialized in photorealistic exterior home transformations.

CRITICAL REQUIREMENTS:
1. PRESERVE GEOMETRY: Maintain EXACT building structure, roof angles, window positions, door placements, and architectural proportions
2. PIXEL-PERFECT PRESERVATION: Areas not explicitly modified MUST remain IDENTICAL to the original image, pixel by pixel. Do not alter any pixels outside the modification areas.
3. PHOTOREALISM: Generate results indistinguishable from professional architectural photography
4. LIGHTING CONSISTENCY: Match exact time of day, sun angle, shadow direction, and light intensity from the original
5. MATERIAL ACCURACY: Apply realistic textures with proper reflections, weathering, surface properties, and depth
6. PERSPECTIVE LOCK: Maintain the EXACT camera angle, lens distortion, and field of view

TECHNICAL SPECIFICATIONS:
- Resolution: Maintain or enhance original image quality
- Color grading: Match the color temperature, saturation, and contrast of the original photo
- Depth of field: Preserve the focal depth and atmospheric perspective
- Weather conditions: Keep consistent lighting and weather unless explicitly requested
- Contextual harmony: All modifications must blend seamlessly with surroundings
- Edge precision: Sharp, clean transitions between materials with no artifacts

MODIFICATIONS REQUESTED:
${promptParts.join('\n')}

${maskData ? `
INPAINTING MODE - CRITICAL:
- Only modify the areas marked in the purple mask
- All other areas MUST remain EXACTLY as they appear in the original image
- Perfect pixel-by-pixel match for non-masked regions
- Seamless blending at mask boundaries
` : `
FULL IMAGE MODE - CRITICAL:
- Only modify the elements specified in the modifications above
- All other parts of the image (geometry, background, context, unmodified elements) MUST remain pixel-perfect identical to the original
- Do not alter ANY pixels that are not part of the requested modifications
- Preserve exact colors, textures, and details of non-modified areas
`}

QUALITY CHECKLIST:
✓ Sharp edges and clean transitions between materials
✓ Realistic weathering and aging appropriate to each material
✓ Proper light reflection, refraction, and shadow casting
✓ No visible artifacts, distortions, or AI hallucinations
✓ Architectural plausibility - all changes must be structurally sound
✓ Professional finish matching high-end architectural photography standards
✓ Consistent perspective and vanishing points
✓ Natural color grading without oversaturation
✓ Pixel-perfect preservation of non-modified areas

OUTPUT SPECIFICATION: A single photorealistic image that looks like it was captured by a professional architectural photographer, with modifications applied ONLY to the specified elements while keeping all other areas EXACTLY as in the original photograph, pixel by pixel.`;

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
