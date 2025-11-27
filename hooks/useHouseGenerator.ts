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

export const useHouseGenerator = (
	originalImage: string | null,
	modifications: Modifications,
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
			
			if (modifications.facade.length)
				promptParts.push(`ELEWACJA: ${joinSelections(modifications.facade)}.`);
			if (modifications.roof.length)
				promptParts.push(`DACH: ${joinSelections(modifications.roof)}.`);
			if (modifications.windows.length)
				promptParts.push(`STOLARKA: ${joinSelections(modifications.windows)}.`);
			if (modifications.ground.length)
				promptParts.push(`TEREN: ${joinSelections(modifications.ground)}.`);
			if (modifications.fence.length)
				promptParts.push(`OGRODZENIE: ${joinSelections(modifications.fence)}.`);
			if (modifications.garden.length)
				promptParts.push(
					`ROŚLINNOŚĆ: ${joinSelections(modifications.garden)}.`
				);
			if (modifications.lighting.length)
				promptParts.push(
					`OŚWIETLENIE: ${joinSelections(modifications.lighting)}.`
				);
			if (modifications.extras.length)
				promptParts.push(`DODATKI: ${joinSelections(modifications.extras)}.`);
			if (modifications.atmosphere.length)
				promptParts.push(
					`ATMOSFERA: ${joinSelections(modifications.atmosphere)}.`
				);
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
			
			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					prompt: promptText,
					image: base64Image,
					model: 'gemini-2.5-flash-image-preview',
				}),
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
				throw new Error('Błąd obrazu');
			}
		} catch (err) {
			console.error(err);
			setError('Błąd generowania.');
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
