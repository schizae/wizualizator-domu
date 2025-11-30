'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
	Upload,
	Home as HomeIcon,
	TreePine,
	PaintBucket,
	Loader2,
	Undo2,
	MousePointer2,
	Image as ImageIcon,
	Sparkles,
	DoorOpen,
	Fence,
	Flower2,
	Trash2,
	Lightbulb,
	Armchair,
	Plus,
	History,
	SplitSquareHorizontal,
	X,
	Wand2,
	Sun,
	Coins,
	MessageSquare,
	Save,
	FolderOpen,
	FileText,
	Send,
	Printer,
	Maximize2,
	Minimize2,
	ZoomIn,
	ZoomOut,
	Palette,
	UploadCloud,
	ShoppingCart,
	ArrowRightCircle,
	FileImage,
	HardDrive,
	ChevronLeft,
	ChevronRight,
	Check,
	PlayCircle,
	Download,
	Heart,
	ArrowRight,
	RotateCcw,
	Brush,
	Eraser,
	Minus,
	Power,
	Eye,
} from 'lucide-react';
import {
	categoryLabels,
	suggestionsMap,
	fullOptions,
	presetsData,
} from '@/app/data/constants';
import { BudgetIndicator } from '@/components/ui/BudgetIndicator';
import { OptionCard } from '@/components/ui/OptionCard';
import { PresetCard } from '@/components/ui/PresetCard';
import { CategoryButton } from '@/components/ui/CategoryButton';
import { ChatWindow } from '@/components/ChatWindow';
import { useHouseGenerator } from '@/hooks/useHouseGenerator';

const DEMO_IMAGE_URL =
	'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop';

// --- KOMPONENTY POMOCNICZE ---

interface SectionToggleProps {
	isEnabled: boolean;
	onToggle: () => void;
	label: string;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ isEnabled, onToggle, label }) => (
	<button
		onClick={onToggle}
		className={`w-full flex items-center justify-between p-3 mb-3 rounded-xl border-2 transition-all ${
			isEnabled
				? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm'
				: 'bg-slate-100 border-slate-300'
		}`}
	>
		<div className='flex items-center gap-3'>
			<div className={`p-1.5 rounded-md ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}>
				<Sparkles size={14} />
			</div>
			<span className='text-xs font-bold text-slate-700 uppercase tracking-wider'>{label}</span>
		</div>
		<div className='flex items-center gap-2'>
			<span className={`text-xs font-bold ${isEnabled ? 'text-blue-700' : 'text-slate-500'}`}>
				{isEnabled ? 'MODYFIKUJ' : 'ZACHOWAJ'}
			</span>
			<div className={`w-11 h-6 rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-slate-400'}`}>
				<div
					className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
						isEnabled ? 'translate-x-5' : 'translate-x-0.5'
					} mt-0.5`}
				/>
			</div>
		</div>
	</button>
);

// --- GŁÓWNY KOMPONENT ---

export default function Home() {
	const [originalImage, setOriginalImage] = useState(null);
	const [activeTab, setActiveTab] = useState('presets');

	const [history, setHistory] = useState<any[]>([]);
	const [isCompareMode, setIsCompareMode] = useState(false);
	const [sliderPosition, setSliderPosition] = useState(50);
	const [budgetScore, setBudgetScore] = useState(1);



	const [savedProjects, setSavedProjects] = useState([]);
	const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [isSaveOptionsOpen, setIsSaveOptionsOpen] = useState(false);
	const [reportNotes, setReportNotes] = useState('');
	const [projectName, setProjectName] = useState('Mój Projekt Domu');

	const [zoomLevel, setZoomLevel] = useState(1);
	const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [isFullscreen, setIsFullscreen] = useState(false);

	const [modifications, setModifications] = useState({
		facade: [],
		roof: [],
		windows: [],
		ground: [],
		fence: [],
		garden: [],
		lighting: [],
		extras: [],
		atmosphere: [],
		custom: '',
	});

	// Section toggles - ON = modyfikuj, OFF = zachowaj oryginał
	const [activeSections, setActiveSections] = useState({
		facade: true,      // Domyślnie włączone
		roof: false,       // Zachowaj oryginalny dach
		windows: false,    // Zachowaj oryginalne okna
		ground: false,     // Zachowaj teren
		fence: false,      // Zachowaj płot
		garden: false,     // Zachowaj ogród
		lighting: false,   // Nie dodawaj światła
		extras: false,     // Nie dodawaj dodatków
		atmosphere: false, // Zachowaj pogodę
	});

	// Brush Mode - malowanie pędzlem (inpainting)
	const [isBrushMode, setIsBrushMode] = useState(false);
	const [brushSize, setBrushSize] = useState(30);
	const [isErasing, setIsErasing] = useState(false);
	const brushCanvasRef = useRef<HTMLCanvasElement>(null);
	const [maskData, setMaskData] = useState<string | null>(null);

	const addToHistory = (image, mods) => {
		const newItem = {
			id: Date.now(),
			image,
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			modifications: { ...mods },
		};
		setHistory((prev) => [newItem, ...prev].slice(0, 10));
	};

	const {
		isProcessing,
		setIsProcessing,
		processingStep,
		setProcessingStep,
		currentImage,
		setCurrentImage,
		error,
		setError,
		generateVisualization,
	} = useHouseGenerator(originalImage, modifications, activeSections, maskData, addToHistory);

	const fileInputRef = useRef(null);
	const projectImportRef = useRef(null);
	const sliderRef = useRef(null);
	const imageContainerRef = useRef(null);
	const tabsContainerRef = useRef(null);

	useEffect(() => {
		const saved = localStorage.getItem('house_viz_projects');
		if (saved) setSavedProjects(JSON.parse(saved));
	}, []);



	// --- FUNKCJE ---
	const scrollTabs = (direction) => {
		if (tabsContainerRef.current) {
			const scrollAmount = 150;
			tabsContainerRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth',
			});
		}
	};

	const loadDemoImage = async () => {
		try {
			setIsProcessing(true);
			setProcessingStep('Pobieranie zdjęcia demo...');
			const response = await fetch(DEMO_IMAGE_URL);
			const blob = await response.blob();
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64data = reader.result as string;
				setOriginalImage(base64data);
				setCurrentImage(base64data);
				resetAll();
				setIsProcessing(false);
				setProcessingStep('');
			};
			reader.readAsDataURL(blob);
		} catch (error) {
			console.error('Error loading demo image:', error);
			setError('Nie udało się załadować zdjęcia demo.');
			setIsProcessing(false);
		}
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Walidacja typu pliku
			const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
			if (!validTypes.includes(file.type)) {
				setError('Nieprawidłowy format. Użyj JPG, PNG lub WebP.');
				event.target.value = '';
				return;
			}

			// Walidacja rozmiaru (20MB - limit Gemini API)
			const MAX_SIZE = 20 * 1024 * 1024; // 20MB
			if (file.size > MAX_SIZE) {
				setError('Obraz jest zbyt duży (max 20MB). Spróbuj skompresować zdjęcie.');
				event.target.value = '';
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const imgData = e.target?.result as string;
				setOriginalImage(imgData);
				setCurrentImage(imgData);
				resetAll();
				setError('');
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => fileInputRef.current.click();

	const handleDownloadPNG = () => {
		if (currentImage) {
			const link = document.createElement('a');
			link.href = currentImage;
			link.download = `wizualizacja.png`;
			link.click();
			setIsSaveOptionsOpen(false);
		}
	};
	const handleDownloadJPG = () => {
		if (currentImage) {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);
				const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
				const link = document.createElement('a');
				link.href = dataUrl;
				link.download = `wizualizacja.jpg`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setIsSaveOptionsOpen(false);
			};
			img.src = currentImage;
		}
	};
	const handleDownloadPDF = () => {
		setIsSaveOptionsOpen(false);
		setIsReportOpen(true);
		setTimeout(() => window.print(), 500);
	};

	const resetAll = () => {
		setModifications({
			facade: [],
			roof: [],
			windows: [],
			ground: [],
			fence: [],
			garden: [],
			lighting: [],
			extras: [],
			atmosphere: [],
			custom: '',
		});
		// Reset toggles - tylko elewacja włączona domyślnie
		setActiveSections({
			facade: true,
			roof: false,
			windows: false,
			ground: false,
			fence: false,
			garden: false,
			lighting: false,
			extras: false,
			atmosphere: false,
		});
		setBudgetScore(1);
		setIsCompareMode(false);
		resetZoom();
		setReportNotes('');
		setProjectName('Mój Projekt Domu');
	};

	const handleReset = () => {
		setCurrentImage(originalImage);
		resetAll();
	};
	const handleRemoveImage = () => {
		setOriginalImage(null);
		setCurrentImage(null);
		setHistory([]);
		resetAll();
		setError('');
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handlePromoteToOriginal = () => {
		if (!currentImage || currentImage === originalImage) return;

		// Użyj wygenerowanego obrazu jako nowego oryginału
		setOriginalImage(currentImage);
		setCurrentImage(currentImage); // Zachowaj jako current też

		// Reset modyfikacji dla kolejnej iteracji
		resetAll();

		// Wyłącz tryb porównania
		setIsCompareMode(false);
	};

	const toggleSection = (section: keyof typeof activeSections) => {
		setActiveSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const restoreFromHistory = (item) => {
		setCurrentImage(item.image);
		setModifications(item.modifications);
		setIsCompareMode(false);
		calculateBudget(item.modifications);
		resetZoom();
	};

	const resetZoom = () => {
		setZoomLevel(1);
		setPanPosition({ x: 0, y: 0 });
	};
	// AutoCAD-style controls
	const handleWheel = (e) => {
		if (!currentImage) return;
		// ✅ AutoCAD style: Scroll wheel zawsze zoomuje (bez Ctrl)
		e.preventDefault();
		const delta = e.deltaY * -0.01;
		const newZoom = Math.min(Math.max(1, zoomLevel + delta), 4);
		setZoomLevel(newZoom);
		if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
	};

	const startPan = (e) => {
		// ✅ AutoCAD style: Middle mouse button (button 1) lub zawsze gdy zoom > 1
		if (e.button === 1 || zoomLevel > 1) {
			e.preventDefault();
			setIsDragging(true);
			setDragStart({
				x: e.clientX - panPosition.x,
				y: e.clientY - panPosition.y,
			});
		}
	};
	const doPan = (e) => {
		if (isDragging && zoomLevel > 1) {
			e.preventDefault();
			setPanPosition({
				x: e.clientX - dragStart.x,
				y: e.clientY - dragStart.y,
			});
		}
	};
	const endPan = () => setIsDragging(false);

	const handleSliderMove = (e) => {
		if (!sliderRef.current) return;
		const rect = sliderRef.current.getBoundingClientRect();
		const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
		const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
		setSliderPosition(percent);
	};

	const saveProjectToBrowser = () => {
		const name = prompt('Nazwa:', projectName);
		if (!name) return;
		setProjectName(name);
		const proj = {
			id: Date.now(),
			name,
			date: new Date().toLocaleDateString(),
			modifications,
			notes: reportNotes,
		};
		const updated = [proj, ...savedProjects];
		setSavedProjects(updated);
		localStorage.setItem('house_viz_projects', JSON.stringify(updated));
		alert('Zapisano.');
		setIsSaveOptionsOpen(false);
	};
	const loadProject = (p) => {
		setModifications(p.modifications);
		calculateBudget(p.modifications);
		if (p.notes) setReportNotes(p.notes);
		if (p.name) setProjectName(p.name);
		setIsProjectsModalOpen(false);
	};
	const deleteProject = (id, e) => {
		e.stopPropagation();
		if (!confirm('Usunąć?')) return;
		const updated = savedProjects.filter((p) => p.id !== id);
		setSavedProjects(updated);
		localStorage.setItem('house_viz_projects', JSON.stringify(updated));
	};

	const exportProjectToFile = () => {
		const projectData = {
			name: projectName,
			date: new Date().toISOString(),
			modifications,
			notes: reportNotes,
			appVersion: '1.0',
		};
		const dataStr =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(projectData, null, 2));
		const link = document.createElement('a');
		link.href = dataStr;
		link.download = `${projectName.replace(/\s+/g, '_')}_config.json`;
		document.body.appendChild(link);
		link.click();
		link.remove();
	};
	const importProjectFromFile = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target.result);
				if (importedData.modifications) {
					setModifications(importedData.modifications);
					calculateBudget(importedData.modifications);
					if (importedData.notes) setReportNotes(importedData.notes);
					if (importedData.name) setProjectName(importedData.name);
					alert('Wczytano!');
					setIsProjectsModalOpen(false);
				} else {
					alert('Błąd formatu.');
				}
			} catch (err) {
				console.error(err);
				alert('Błąd pliku.');
			}
		};
		reader.readAsText(file);
		event.target.value = '';
	};

	const calculateBudget = (mods) => {
		let count = 0,
			score = 0;
		const keywords = [
			'kamień',
			'drewno',
			'łupek',
			'fotowoltaika',
			'szklane',
			'basen',
		];
		Object.values(mods)
			.flat()
			.forEach((val) => {
				if (typeof val === 'string') {
					count++;
					if (keywords.some((k) => val.toLowerCase().includes(k))) score += 2;
					else score += 1;
				}
			});
		setBudgetScore(
			count === 0
				? 1
				: Math.min(3, Math.ceil((score / Math.max(1, count)) * 1.5))
		);
	};
	const toggleSelection = (cat, val) => {
		setModifications((prev) => {
			const curr = prev[cat];
			const isSel = curr.includes(val);
			const newSel =
				cat === 'atmosphere'
					? isSel
						? []
						: [val]
					: isSel
					? curr.filter((i) => i !== val)
					: [...curr, val];
			const newMods = { ...prev, [cat]: newSel };
			calculateBudget(newMods);
			return newMods;
		});
	};
	const applyPreset = (preset) => {
		setModifications((prev) => {
			const newMods = { ...prev, ...preset };
			calculateBudget(newMods);
			return newMods;
		});
	};

	const enhancePrompt = async () => {
		if (!modifications.custom) return;
		setProcessingStep('Ulepszanie opisu...');
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					prompt: `Przeredaguj ten opis architektoniczny: "${modifications.custom}". Zwróć TYLKO tekst.`,
				}),
			});
			const data = await response.json();
			if (data.text)
				setModifications({ ...modifications, custom: data.text.trim() });
		} catch (e) {
			console.error(e);
		} finally {
			setProcessingStep('');
		}
	};





	const getShoppingLink = (query) =>
		`https://www.google.com/search?q=${encodeURIComponent(
			query + ' materiały budowlane cena'
		)}&tbm=shop`;

	// --- BRUSH MODE FUNCTIONS ---
	const clearBrushMask = () => {
		const canvas = brushCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		setMaskData(null);
	};

	const previewMask = () => {
		if (maskData) {
			const win = window.open();
			if (win) {
				win.document.write(`
					<html>
						<head><title>Podgląd maski (białe = obszar do edycji)</title></head>
						<body style="margin:0; background:#1a1a1a; display:flex; align-items:center; justify-content:center; min-height:100vh;">
							<div style="text-align:center;">
								<h2 style="color:#fff; font-family:sans-serif; margin-bottom:10px;">
									Maska do API (Białe piksele = obszar do edycji)
								</h2>
								<img src="${maskData}" style="max-width:90vw; max-height:80vh; border:2px solid #fff;" />
							</div>
						</body>
					</html>
				`);
			}
		}
	};

	const [isDrawing, setIsDrawing] = useState(false);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isBrushMode) return;
		setIsDrawing(true);
		draw(e);
	};

	const stopDrawing = () => {
		setIsDrawing(false);
		// Save mask data - convert to black & white mask for API
		const canvas = brushCanvasRef.current;
		if (canvas) {
			// Create a new canvas for black & white mask
			const maskCanvas = document.createElement('canvas');
			maskCanvas.width = canvas.width;
			maskCanvas.height = canvas.height;
			const maskCtx = maskCanvas.getContext('2d');

			if (maskCtx) {
				// Fill with black background (areas to preserve)
				maskCtx.fillStyle = 'black';
				maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

				// Get the purple drawing from visible canvas
				const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);

				if (imageData) {
					const data = imageData.data;
					const maskImageData = maskCtx.createImageData(canvas.width, canvas.height);
					const maskData = maskImageData.data;

					// Convert: any purple pixel -> white in mask
					for (let i = 0; i < data.length; i += 4) {
						const alpha = data[i + 3]; // alpha channel
						if (alpha > 0) {
							// This pixel was drawn on -> white in mask (edit this area)
							maskData[i] = 255;     // R
							maskData[i + 1] = 255; // G
							maskData[i + 2] = 255; // B
							maskData[i + 3] = 255; // A
						} else {
							// Transparent pixel -> black in mask (preserve this area)
							maskData[i] = 0;       // R
							maskData[i + 1] = 0;   // G
							maskData[i + 2] = 0;   // B
							maskData[i + 3] = 255; // A
						}
					}

					maskCtx.putImageData(maskImageData, 0, 0);
				}

				// Save the black & white mask
				setMaskData(maskCanvas.toDataURL('image/png'));
			}
		}
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDrawing && e.type !== 'mousedown') return;
		if (!isBrushMode) return;

		const canvas = brushCanvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = brushSize;

		if (isErasing) {
			// Wymazywanie - ustaw globalCompositeOperation na destination-out
			ctx.globalCompositeOperation = 'destination-out';
			ctx.strokeStyle = 'rgba(0,0,0,1)';
		} else {
			// Rysowanie - pół-przezroczyste fioletowe
			ctx.globalCompositeOperation = 'source-over';
			ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)'; // purple-600 z alpha
			ctx.fillStyle = 'rgba(147, 51, 234, 0.4)';
		}

		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x, y);

		// Dla pierwszego kliknięcia narysuj kropkę
		if (e.type === 'mousedown') {
			ctx.beginPath();
			ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	// Initialize canvas size when image loads
	useEffect(() => {
		if (currentImage && brushCanvasRef.current) {
			const img = new Image();
			img.onload = () => {
				const canvas = brushCanvasRef.current;
				if (!canvas) return;

				// ✅ FIX: Pobierz rzeczywiste wymiary WYŚWIETLANEGO obrazu, nie naturalnych
				const imgElement = document.querySelector('img[alt="Visual"]') as HTMLImageElement;
				if (imgElement) {
					const rect = imgElement.getBoundingClientRect();

					// Ustaw wymiary canvas na dokładnie te same co wyświetlany obraz
					canvas.width = rect.width;
					canvas.height = rect.height;
					canvas.style.width = `${rect.width}px`;
					canvas.style.height = `${rect.height}px`;

					console.log('Canvas resized:', rect.width, 'x', rect.height);
				} else {
					// Fallback - użyj naturalnych wymiarów tylko jeśli nie ma img
					canvas.width = img.width;
					canvas.height = img.height;
				}
			};
			img.src = currentImage;
		}
	}, [currentImage, zoomLevel]); // Dodaj zoomLevel aby canvas się aktualizował przy zoom

	return (
		<div
			className={`min-h-screen bg-slate-50 font-sans text-slate-800 ${
				isFullscreen ? 'fixed inset-0 z-50 overflow-hidden' : ''
			}`}
		>
			{!isFullscreen && (
				<header className='bg-white border-b border-slate-200 sticky top-0 z-30'>
					<div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
						<div className='flex items-center space-x-3'>
							<div className='bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg text-white shadow-md'>
								<HomeIcon size={24} />
							</div>
							<div>
								<h1 className='text-lg sm:text-xl font-bold tracking-tight text-slate-900'>
									AI Wizualizator Domu{' '}
									<span className='text-blue-600'>PRO</span>
								</h1>
							</div>
						</div>
						<div className='flex items-center space-x-2 sm:space-x-3'>
							<BudgetIndicator score={budgetScore} />
							<button
								onClick={() => setIsProjectsModalOpen(true)}
								className='p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
							>
								<FolderOpen size={20} />
							</button>
							<button
								onClick={saveProjectToBrowser}
								className='p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors'
							>
								<Save size={20} />
							</button>
							<button
								onClick={() => setIsReportOpen(true)}
								className='flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-blue-600 transition-colors'
							>
								<FileText size={18} />
								<span className='hidden sm:inline'>Raport</span>
							</button>
						</div>
					</div>
				</header>
			)}
			<main
				className={`transition-all duration-300 ${
					isFullscreen
						? 'h-screen w-screen p-0'
						: 'max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]'
				}`}
			>
				<div
					className={`${
						isFullscreen
							? 'col-span-12 h-full'
							: 'lg:col-span-8 flex flex-col h-full gap-4 min-h-[500px]'
					}`}
				>
					<div
						className={`bg-white shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-grow relative ${
							isFullscreen ? 'rounded-none border-0 h-full' : 'rounded-2xl'
						}`}
					>
						<div className='absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none'>
							<div className='pointer-events-auto flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 shadow-sm'>
								{currentImage && (
									<>
										<button
											onClick={() => {
												setIsFullscreen(!isFullscreen);
												resetZoom();
											}}
											className='p-2 hover:bg-slate-100 rounded-md text-slate-600'
										>
											{isFullscreen ? (
												<Minimize2 size={18} />
											) : (
												<Maximize2 size={18} />
											)}
										</button>
										<div className='w-px h-4 bg-slate-300 mx-1'></div>
										<button
											onClick={() =>
												setZoomLevel((prev) => Math.min(prev + 0.5, 4))
											}
											className='p-2 hover:bg-slate-100 rounded-md text-slate-600'
										>
											<ZoomIn size={18} />
										</button>
										<button
											onClick={() => {
												resetZoom();
											}}
											className='p-2 hover:bg-slate-100 rounded-md text-slate-600'
										>
											<span className='text-xs font-bold'>
												{Math.round(zoomLevel * 100)}%
											</span>
										</button>
										<button
											onClick={() =>
												setZoomLevel((prev) => Math.max(prev - 0.5, 1))
											}
											className='p-2 hover:bg-slate-100 rounded-md text-slate-600'
										>
											<ZoomOut size={18} />
										</button>
									</>
								)}
							</div>
							{/* Brush Mode Controls */}
							{isBrushMode && currentImage && !isFullscreen && (
								<div className='pointer-events-auto bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-purple-200 shadow-sm space-y-2 min-w-[180px]'>
									<div className='text-xs font-bold text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-2'>
										<Brush size={12} />
										Pędzel
									</div>
									{/* Rozmiar pędzla */}
									<div className='space-y-1'>
										<div className='flex justify-between items-center'>
											<span className='text-[10px] text-slate-600'>Rozmiar</span>
											<span className='text-[10px] font-bold text-purple-600'>{brushSize}px</span>
										</div>
										<input
											type='range'
											min='5'
											max='100'
											value={brushSize}
											onChange={(e) => setBrushSize(Number(e.target.value))}
											className='w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600'
										/>
									</div>
									{/* Rysuj / Wymazuj */}
									<button
										onClick={() => setIsErasing(!isErasing)}
										className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
											isErasing
												? 'bg-orange-100 text-orange-700 border border-orange-200'
												: 'bg-purple-100 text-purple-700 border border-purple-200'
										}`}
									>
										{isErasing ? (
											<>
												<Eraser size={14} />
												<span>Wymazuj</span>
											</>
										) : (
											<>
												<Brush size={14} />
												<span>Rysuj</span>
											</>
										)}
									</button>
									{/* Wyczyść maskę */}
									<button
										onClick={clearBrushMask}
										className='w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors border border-red-200'
									>
										<Trash2 size={14} />
										<span>Wyczyść</span>
									</button>
								{/* Podgląd maski - tylko gdy maska istnieje */}
								{maskData && (
									<button
										onClick={previewMask}
										className='w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors border border-blue-200'
										title='Zobacz czarno-białą maskę wysyłaną do API'
									>
										<Eye size={14} />
										<span>Podgląd</span>
									</button>
								)}
								</div>
							)}
							{currentImage && !isFullscreen && (
								<div className='pointer-events-auto flex space-x-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 shadow-sm'>
									{/* Przycisk "Edytuj dalej" - pojawia się gdy jest nowa wizualizacja */}
									{currentImage !== originalImage && (
										<button
											onClick={handlePromoteToOriginal}
											className='flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-md shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-all border border-indigo-500'
											title='Użyj tego wyniku jako bazy do kolejnych edycji'
										>
											<Heart size={14} className='fill-current' />
											<span className='hidden sm:inline'>Edytuj dalej</span>
											<ArrowRight size={14} />
										</button>
									)}
									<button
										onClick={() => {
											setIsCompareMode(!isCompareMode);
											resetZoom();
										}}
										className={`flex items-center space-x-1 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${
											isCompareMode
												? 'bg-blue-100 text-blue-700 border-blue-200'
												: 'bg-white text-slate-500 hover:text-blue-600 border-slate-200'
										}`}
									>
										<SplitSquareHorizontal size={14} />
										<span className='hidden sm:inline'>
											{isCompareMode ? 'Widok' : 'Porównaj'}
										</span>
									</button>
									<button
										onClick={() => {
											setIsBrushMode(!isBrushMode);
											if (!isBrushMode) {
												setIsCompareMode(false);
												resetZoom();
											}
										}}
										className={`flex items-center space-x-1 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${
											isBrushMode
												? 'bg-purple-100 text-purple-700 border-purple-200'
												: 'bg-white text-slate-500 hover:text-purple-600 border-slate-200'
										}`}
										title='Maluj obszary do modyfikacji'
									>
										<Brush size={14} />
										<span className='hidden sm:inline'>
											{isBrushMode ? 'Pędzel ON' : 'Pędzel'}
										</span>
									</button>
									<button
										onClick={handleReset}
										className='p-1.5 text-slate-500 hover:text-blue-600 bg-white rounded-md border border-slate-200'
									>
										<Undo2 size={16} />
									</button>
									<button
										onClick={handleRemoveImage}
										className='p-1.5 text-red-500 hover:text-red-700 bg-white rounded-md border border-slate-200'
									>
										<Trash2 size={16} />
									</button>
								</div>
							)}
						</div>
						<div
							ref={imageContainerRef}
							className={`flex-1 relative flex items-center justify-center overflow-hidden group select-none ${
								isDragging
									? 'cursor-grabbing'
									: zoomLevel > 1
									? 'cursor-grab'
									: 'cursor-default'
							}`}
							style={{ backgroundColor: '#2d2d2d' }} // Ciemne tło jak AutoCAD
							onWheel={handleWheel}
							onMouseDown={startPan}
							onMouseMove={doPan}
							onMouseUp={endPan}
							onMouseLeave={endPan}
						>
							{!currentImage ? (
								<div
									onClick={triggerFileInput}
									className='text-center p-8 cursor-pointer hover:bg-slate-700 transition-all rounded-xl border-2 border-dashed border-slate-600 m-8 w-full max-w-lg bg-slate-800'
								>
									<div className='bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Upload size={32} />
									</div>
									<h3 className='text-lg font-bold text-slate-200'>
										Wgraj zdjęcie domu
									</h3>
									<p className='text-slate-400 text-sm mb-4'>
										Zacznij od wgrania zdjęcia.
									</p>
									<button
										onClick={(e) => {
											e.stopPropagation();
											loadDemoImage();
										}}
										className='flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors'
									>
										<PlayCircle size={16} />
										<span>Załaduj przykładowy dom</span>
									</button>
								</div>
							) : (
								<div className='relative w-full h-full flex items-center justify-center'>
									{!isCompareMode && (
										<div
											className='relative transition-transform duration-100 ease-out origin-center'
											style={{
												transform: `scale(${zoomLevel}) translate(${
													panPosition.x / zoomLevel
												}px, ${panPosition.y / zoomLevel}px)`,
											}}
										>
											<img
												src={currentImage}
												className='max-w-full max-h-[90vh] object-contain shadow-2xl'
												alt='Visual'
												draggable={false}
												onDragStart={(e) => e.preventDefault()}
											/>
											{/* Canvas overlay dla Brush Mode */}
											{isBrushMode && (
												<canvas
													ref={brushCanvasRef}
													className='absolute inset-0 w-full h-full cursor-crosshair'
													onMouseDown={startDrawing}
													onMouseMove={draw}
													onMouseUp={stopDrawing}
													onMouseLeave={stopDrawing}
													style={{
														cursor: isBrushMode ? 'crosshair' : 'default',
													}}
												/>
											)}
										</div>
									)}
									{isCompareMode && originalImage && (
										<div
											ref={sliderRef}
											className='relative w-full h-full cursor-col-resize'
											onMouseMove={handleSliderMove}
											onTouchMove={handleSliderMove}
											onClick={handleSliderMove}
										>
											<img
												src={currentImage}
												className='absolute inset-0 w-full h-full object-contain pointer-events-none'
												alt='After'
												draggable={false}
											/>
											<img
												src={originalImage}
												className='absolute inset-0 w-full h-full object-contain pointer-events-none'
												style={{
													clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
												}}
												alt='Before'
												draggable={false}
											/>
											<div
												className='absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10'
												style={{ left: `${sliderPosition}%` }}
											>
												<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md text-blue-600'>
													<SplitSquareHorizontal size={16} />
												</div>
											</div>
										</div>
									)}
									{isProcessing && (
										<div className='absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-30'>
											<div className='relative'>
												<Loader2
													className='animate-spin text-blue-600 mb-6'
													size={64}
												/>
												<Sparkles
													className='absolute -top-2 -right-2 text-amber-400 animate-pulse'
													size={24}
												/>
											</div>
											<p className='font-bold text-xl text-slate-800 animate-pulse'>
												{processingStep || 'Przetwarzanie...'}
											</p>
										</div>
									)}
								</div>
							)}
							<input
								type='file'
								ref={fileInputRef}
								onChange={handleFileUpload}
								className='hidden'
								accept='image/*'
							/>
						</div>
					</div>
				{/* Pole Custom Prompt - pod zdjęciem */}
				{currentImage && (
					<div className='mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4'>
						<div className='flex justify-between items-center mb-2'>
							<label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider'>
								Dodatkowe instrukcje
							</label>
							<button
								onClick={enhancePrompt}
								className='text-xs flex items-center text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded-md transition-colors'
							>
								<Wand2 size={12} className='mr-1' /> Ulepsz opis
							</button>
						</div>
						<textarea
							value={modifications.custom}
							onChange={(e) =>
								setModifications({
									...modifications,
									custom: e.target.value,
								})
							}
							placeholder="Np. 'Zrób podjazd z jasnego żwiru'..."
							className='w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20'
						/>
					</div>
				)}
					{!isFullscreen && history.length > 0 && (
						<div className='h-32 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col'>
							<div className='flex items-center justify-between mb-2'>
								<h3 className='text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
									<History size={14} /> Historia Generacji
								</h3>
								<span className='text-[10px] text-slate-400'>
									{history.length} / 10
								</span>
							</div>
							<div className='flex gap-3 overflow-x-auto pb-2 custom-scrollbar'>
								{history.map((item) => (
									<div
										key={item.id}
										onClick={() => restoreFromHistory(item)}
										className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group'
									>
										<img
											src={item.image}
											alt='History'
											className='w-full h-full object-cover'
										/>
										<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
										<div className='absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 text-center backdrop-blur-sm'>
											{item.timestamp}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div className='lg:col-span-4 flex flex-col h-full max-h-[calc(100vh-100px)]'>
					<div className='bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full'>
						<div className='relative border-b border-slate-200'>
							<button
								onClick={() => scrollTabs('left')}
								className='absolute left-0 top-0 bottom-0 z-20 w-8 flex items-center justify-center bg-gradient-to-r from-slate-50 via-slate-50 to-transparent text-slate-400 hover:text-blue-600 transition-colors'
							>
								<ChevronLeft size={20} />
							</button>
							<div
								ref={tabsContainerRef}
								className='flex overflow-x-auto bg-slate-50 px-8 pt-2 scrollbar-hide'
							>
								<CategoryButton
									id='presets'
									icon={Wand2}
									label='Inspiracje'
									onClick={setActiveTab}
									isActive={activeTab === 'presets'}
								/>
								<CategoryButton
									id='atmosphere'
									icon={Sun}
									label='Pogoda'
									onClick={setActiveTab}
									isActive={activeTab === 'atmosphere'}
								/>
								<CategoryButton
									id='facade'
									icon={PaintBucket}
									label='Elewacja'
									onClick={setActiveTab}
									isActive={activeTab === 'facade'}
									count={modifications.facade.length}
								/>
								<CategoryButton
									id='roof'
									icon={HomeIcon}
									label='Dach'
									onClick={setActiveTab}
									isActive={activeTab === 'roof'}
									count={modifications.roof.length}
								/>
								<CategoryButton
									id='windows'
									icon={DoorOpen}
									label='Stolarka'
									onClick={setActiveTab}
									isActive={activeTab === 'windows'}
									count={modifications.windows.length}
								/>
								<CategoryButton
									id='ground'
									icon={TreePine}
									label='Teren'
									onClick={setActiveTab}
									isActive={activeTab === 'ground'}
									count={modifications.ground.length}
								/>
								<CategoryButton
									id='fence'
									icon={Fence}
									label='Płot'
									onClick={setActiveTab}
									isActive={activeTab === 'fence'}
									count={modifications.fence.length}
								/>
								<CategoryButton
									id='garden'
									icon={Flower2}
									label='Ogród'
									onClick={setActiveTab}
									isActive={activeTab === 'garden'}
									count={modifications.garden.length}
								/>
								<CategoryButton
									id='lighting'
									icon={Lightbulb}
									label='Światło'
									onClick={setActiveTab}
									isActive={activeTab === 'lighting'}
									count={modifications.lighting.length}
								/>
								<CategoryButton
									id='extras'
									icon={Armchair}
									label='Dodatki'
									onClick={setActiveTab}
									isActive={activeTab === 'extras'}
									count={modifications.extras.length}
								/>
							</div>
							<button
								onClick={() => scrollTabs('right')}
								className='absolute right-0 top-0 bottom-0 z-20 w-8 flex items-center justify-center bg-gradient-to-l from-slate-50 via-slate-50 to-transparent text-slate-400 hover:text-blue-600 transition-colors'
							>
								<ChevronRight size={20} />
							</button>
						</div>
						<div className='flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50'>
							{activeTab === 'presets' && (
								<div className='space-y-3'>
									<div className='bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mb-2 flex items-start'>
										<Sparkles size={14} className='mr-2 mt-0.5 flex-shrink-0' />{' '}
										Wybierz gotowy styl.
									</div>
									<div className='grid grid-cols-1 gap-3'>
										{presetsData.map((preset) => (
											<PresetCard
												key={preset.id}
												preset={preset}
												onApply={applyPreset}
											/>
										))}
									</div>
								</div>
							)}
							{activeTab !== 'presets' && (
								<>
									{/* Section Toggle */}
									<SectionToggle
										isEnabled={activeSections[activeTab as keyof typeof activeSections]}
										onToggle={() => toggleSection(activeTab as keyof typeof activeSections)}
										label={categoryLabels[activeTab] || activeTab}
									/>
									<div className='grid grid-cols-2 gap-3 mb-6'>
										{(fullOptions[activeTab as keyof typeof fullOptions] || []).map((opt: any, idx) => (
											<OptionCard
												key={idx}
												label={opt.label}
												subLabel={opt.subLabel}
												imageColor={opt.color}
												textColor={opt.textColor}
												isActive={modifications[activeTab]?.includes(opt.val)}
												onClick={() => toggleSelection(activeTab, opt.val)}
											/>
										))}
									</div>
								</>
							)}
						</div>
						<div className='p-4 bg-white border-t border-slate-200 z-10 shadow-lg'>
							{error && (
								<div className='mb-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-start'>
									<span className='mr-2'>⚠️</span>
									{error}
								</div>
							)}
							<button
								onClick={generateVisualization}
								disabled={!currentImage || isProcessing}
								className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] ${
									!currentImage || isProcessing
										? 'bg-slate-100 text-slate-400 cursor-not-allowed'
										: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
								}`}
							>
								{isProcessing ? (
									<Loader2 className='animate-spin' size={18} />
								) : (
									<Sparkles size={18} />
								)}
								<span>
									{isProcessing ? 'PRZETWARZANIE...' : 'GENERUJ WIZUALIZACJĘ'}
								</span>
							</button>
						</div>
					</div>
				</div>
			</main>

			{/* MODALS */}
			{isSaveOptionsOpen && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200'>
						<div className='p-4 border-b border-slate-100 flex justify-between items-center'>
							<h3 className='font-bold text-lg text-slate-800 flex items-center'>
								<Save className='mr-2 text-blue-600' size={20} /> Opcje Zapisu
							</h3>
							<button
								onClick={() => setIsSaveOptionsOpen(false)}
								className='text-slate-400 hover:text-slate-600'
							>
								<X size={20} />
							</button>
						</div>
						<div className='p-2 space-y-1'>
							<button
								onClick={handleDownloadJPG}
								className='w-full flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group'
							>
								<div className='bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-200 transition-colors mr-3'>
									<FileImage size={20} />
								</div>
								<div>
									<div className='font-medium text-slate-800'>
										Pobierz Obraz (JPG)
									</div>
									<div className='text-xs text-slate-500'>
										Tylko wizualizacja.
									</div>
								</div>
							</button>
							<button
								onClick={handleDownloadPDF}
								className='w-full flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group'
							>
								<div className='bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-200 transition-colors mr-3'>
									<FileText size={20} />
								</div>
								<div>
									<div className='font-medium text-slate-800'>
										Pobierz Raport (PDF)
									</div>
									<div className='text-xs text-slate-500'>
										Lista materiałów i uwagi.
									</div>
								</div>
							</button>
							<button
								onClick={saveProjectToBrowser}
								className='w-full flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group'
							>
								<div className='bg-green-100 text-green-600 p-2 rounded-lg group-hover:bg-green-200 transition-colors mr-3'>
									<HardDrive size={20} />
								</div>
								<div>
									<div className='font-medium text-slate-800'>
										Zapisz Projekt
									</div>
									<div className='text-xs text-slate-500'>
										Do późniejszej edycji.
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>
			)}
			{isProjectsModalOpen && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200'>
						<div className='p-4 border-b border-slate-100 flex justify-between items-center'>
							<h3 className='font-bold text-lg text-slate-800 flex items-center'>
								<FolderOpen className='mr-2 text-blue-600' size={20} /> Zapisane
								Projekty
							</h3>
							<button
								onClick={() => setIsProjectsModalOpen(false)}
								className='text-slate-400 hover:text-slate-600'
							>
								<X size={20} />
							</button>
						</div>
						<div className='p-4 border-b border-slate-100 flex justify-around bg-slate-50'>
							<button
								onClick={exportProjectToFile}
								className='flex items-center space-x-1 text-xs font-medium text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors'
							>
								<Download size={14} />
								<span>Eksportuj</span>
							</button>
							<label className='flex items-center space-x-1 text-xs font-medium text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md cursor-pointer transition-colors'>
								<UploadCloud size={14} />
								<span>Importuj</span>
								<input
									type='file'
									ref={projectImportRef}
									onChange={importProjectFromFile}
									className='hidden'
									accept='.json'
								/>
							</label>
						</div>
						<div className='p-4 max-h-[60vh] overflow-y-auto space-y-2'>
							{savedProjects.length === 0 ? (
								<div className='text-center py-8 text-slate-400'>
									<FolderOpen size={48} className='mx-auto mb-2 opacity-20' />
									<p>Brak zapisanych projektów.</p>
								</div>
							) : (
								savedProjects.map((p) => (
									<div
										key={p.id}
										onClick={() => loadProject(p)}
										className='flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl cursor-pointer group transition-colors'
									>
										<div>
											<div className='font-semibold text-slate-800'>
												{p.name}
											</div>
											<div className='text-xs text-slate-500'>{p.date}</div>
										</div>
										<button
											onClick={(e) => deleteProject(p.id, e)}
											className='p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'
										>
											<Trash2 size={16} />
										</button>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
			{isReportOpen && currentImage && (
				<div className='fixed inset-0 bg-white z-50 overflow-auto'>
					<div className='max-w-6xl mx-auto p-8'>
						<div className='flex justify-between items-start mb-8 no-print'>
							<div>
								<h1 className='text-3xl font-bold text-slate-900'>
									Raport Wizualizacji
								</h1>
								<p className='text-slate-500 mt-1'>Projekt: {projectName}</p>
							</div>
							<div className='flex space-x-3'>
								<button
									onClick={() => window.print()}
									className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
								>
									<Printer size={18} /> <span>Drukuj / PDF</span>
								</button>
								<button
									onClick={() => setIsReportOpen(false)}
									className='flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200'
								>
									<X size={18} /> <span>Zamknij</span>
								</button>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4 mb-8 print:mb-4'>
							<div className='border rounded-xl overflow-hidden shadow-sm bg-slate-50'>
								<div className='p-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b bg-white'>
									Stan Obecny
								</div>
								<img
									src={originalImage}
									alt='Oryginał'
									className='w-full h-64 object-contain bg-white'
								/>
							</div>
							<div className='border rounded-xl overflow-hidden shadow-sm bg-slate-50'>
								<div className='p-2 text-xs font-bold text-blue-600 uppercase tracking-wider border-b bg-white'>
									Wizualizacja AI
								</div>
								<img
									src={currentImage}
									alt='Wizualizacja'
									className='w-full h-64 object-contain bg-white'
								/>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4'>
							<div>
								<h3 className='text-lg font-bold mb-4 border-b pb-2 flex items-center'>
									<ShoppingCart className='mr-2' size={20} /> Lista Zakupowa
								</h3>
								<ul className='space-y-2'>
									{Object.entries(modifications).map(([key, val]) => {
										if (
											!val ||
											(Array.isArray(val) && val.length === 0) ||
											key === 'custom'
										)
											return null;
										const categoryLabel = categoryLabels[key] || key;
										return (
											<li
												key={key}
												className='flex flex-col text-sm border-b border-slate-100 py-3 break-inside-avoid'
											>
												<div className='flex justify-between items-center mb-2'>
													<span className='font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2'>
														{categoryLabel}
													</span>
												</div>
												<div className='space-y-2'>
													{Array.isArray(val) &&
														val.map((item, i) => (
															<div
																key={i}
																className='flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200 group hover:border-blue-300 transition-colors'
															>
																<span className='text-slate-800 font-medium text-sm'>
																	{item}
																</span>
																{!['atmosphere', 'custom', 'presets'].includes(
																	key
																) && (
																	<a
																		href={getShoppingLink(item)}
																		target='_blank'
																		rel='noopener noreferrer'
																		className='flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors shadow-sm no-print'
																		title='Szukaj w Google Shopping'
																	>
																		<ShoppingCart size={12} />
																		<span>Cena</span>
																	</a>
																)}
															</div>
														))}
												</div>
											</li>
										);
									})}
								</ul>
							</div>
							<div className='flex flex-col gap-6'>
								<div>
									<h3 className='text-lg font-bold mb-4 border-b pb-2'>
										Notatki
									</h3>
									<textarea
										className='w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-sm h-40 focus:ring-2 focus:ring-blue-500 outline-none resize-none print:hidden'
										placeholder='Wpisz uwagi...'
										value={reportNotes}
										onChange={(e) => setReportNotes(e.target.value)}
									/>
									<div className='hidden print:block p-4 border border-slate-200 rounded-xl text-sm h-40 bg-white whitespace-pre-wrap'>
										{reportNotes || 'Brak uwag.'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<ChatWindow
				activeTab={activeTab}
				modifications={modifications}
				isFullscreen={isFullscreen}
			/>
			<style>{` .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } @media print { @page { margin: 1.5cm; size: landscape; } body { background: white; } .no-print { display: none !important; } .print\\:block { display: block !important; } .print\\:hidden { display: none !important; } .print\\:mb-4 { margin-bottom: 1rem !important; } .print\\:gap-4 { gap: 1rem !important; } .print\\:bg-white { background-color: white !important; } .print\\:border-slate-200 { border-color: #e2e8f0 !important; } .print\\:text-slate-800 { color: #1e293b !important; } .print\\:text-black { color: black !important; } .print\\:text-slate-200 { color: #e2e8f0 !important; } } `}</style>
		</div>
	);
}
