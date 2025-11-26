'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
	Upload,
	Home,
	TreePine,
	PaintBucket,
	Loader2,
	Undo2,
	Download,
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
	Move,
	Palette,
	FileJson,
	UploadCloud,
	ShoppingCart,
	ExternalLink,
	ArrowRightCircle,
	FileImage,
	FileType,
	HardDrive,
	ChevronLeft,
	ChevronRight,
	Check,
	PlayCircle,
} from 'lucide-react';

const DEMO_IMAGE_URL =
	'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop';

// --- KOMPONENTY POMOCNICZE (Zdefiniowane na zewnątrz) ---

const BudgetIndicator = ({ score }) => (
	<div
		className='flex items-center space-x-1 text-sm bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200'
		title='Szacunkowy poziom kosztów materiałów'
	>
		<Coins size={14} className='text-slate-500' />
		<div className='flex space-x-0.5'>
			{[1, 2, 3].map((lvl) => (
				<span
					key={lvl}
					className={`font-bold ${
						score >= lvl ? 'text-green-600' : 'text-slate-300'
					}`}
				>
					$
				</span>
			))}
		</div>
	</div>
);

const OptionCard = ({
	label,
	imageColor,
	isActive,
	onClick,
	subLabel,
	textColor,
}) => (
	<div
		onClick={onClick}
		className={`cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-200 flex flex-col ${
			isActive
				? 'border-blue-500 ring-2 ring-blue-200 ring-opacity-50 shadow-md bg-blue-50/30'
				: 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
		}`}
	>
		<div
			className={`h-14 w-full ${imageColor} bg-opacity-30 flex items-center justify-center relative`}
		></div>
		<div className='p-3 bg-white/50 flex-1 flex flex-col justify-center'>
			<h4
				className={`font-medium text-xs sm:text-sm leading-tight ${
					textColor || (isActive ? 'text-blue-700' : 'text-slate-800')
				}`}
			>
				{label}
			</h4>
			{subLabel && (
				<p
					className={`text-[10px] mt-1 ${
						textColor ? 'opacity-80' : 'text-slate-400'
					}`}
				>
					{subLabel}
				</p>
			)}
		</div>
		{isActive && (
			<div className='absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-full shadow-sm animate-in zoom-in duration-200'>
				<Check size={10} strokeWidth={4} />
			</div>
		)}
	</div>
);

const PresetCard = ({ preset, onApply }) => (
	<div
		onClick={() => onApply(preset.mods)}
		className='cursor-pointer group relative overflow-hidden rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white'
	>
		<div
			className={`h-24 ${preset.color} flex items-center justify-center relative overflow-hidden`}
		>
			<Wand2 className='text-white/20 absolute -bottom-4 -right-4' size={80} />
			<Wand2 className='text-white relative z-10' size={32} />
		</div>
		<div className='p-3'>
			<h4 className='font-bold text-slate-800 text-sm'>{preset.label}</h4>
			<p className='text-xs text-slate-500 mt-1'>{preset.desc}</p>
		</div>
	</div>
);

const CategoryButton = ({
	id,
	icon: Icon,
	label,
	count,
	onClick,
	isActive,
}) => (
	<button
		onClick={() => onClick(id)}
		className={`relative flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-colors font-medium whitespace-nowrap ${
			isActive
				? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm z-10'
				: 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
		}`}
	>
		<Icon size={18} />
		<span>{label}</span>
		{count > 0 && (
			<span className='ml-1 bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold'>
				{count}
			</span>
		)}
	</button>
);

// --- GŁÓWNY KOMPONENT ---

export default function Home() {
	const [originalImage, setOriginalImage] = useState(null);
	const [currentImage, setCurrentImage] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [processingStep, setProcessingStep] = useState('');
	const [error, setError] = useState('');
	const [activeTab, setActiveTab] = useState('presets');

	const [history, setHistory] = useState([]);
	const [isCompareMode, setIsCompareMode] = useState(false);
	const [sliderPosition, setSliderPosition] = useState(50);
	const [budgetScore, setBudgetScore] = useState(1);

	const [isChatOpen, setIsChatOpen] = useState(false);
	const [chatMessages, setChatMessages] = useState([
		{
			role: 'system',
			text: 'Cześć! Jestem Twoim wirtualnym architektem. Przełączaj zakładki, a podpowiem Ci odpowiednie pytania.',
		},
	]);
	const [chatInput, setChatInput] = useState('');
	const [isChatLoading, setIsChatLoading] = useState(false);
	const [chatSuggestions, setChatSuggestions] = useState([]);

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

	const fileInputRef = useRef(null);
	const projectImportRef = useRef(null);
	const sliderRef = useRef(null);
	const chatEndRef = useRef(null);
	const imageContainerRef = useRef(null);
	const tabsContainerRef = useRef(null);

	// --- DANE ---
	const categoryLabels = {
		facade: 'Elewacja i Ściany',
		roof: 'Pokrycie Dachowe',
		windows: 'Stolarka Okienna i Drzwiowa',
		ground: 'Teren i Nawierzchnia',
		fence: 'Ogrodzenie i Bramy',
		garden: 'Roślinność i Ogród',
		lighting: 'Oświetlenie Zewnętrzne',
		extras: 'Dodatki i Mała Architektura',
		atmosphere: 'Klimat i Styl',
		custom: 'Inne',
	};

	const suggestionsMap = {
		presets: [
			'Jaki styl pasuje do małego domu?',
			'Co jest teraz najmodniejsze?',
			'Styl nowoczesny czy klasyczny?',
		],
		facade: [
			'Czy ciemna elewacja się nagrzewa?',
			'Tynk czy deska - co trwalsze?',
			'Jaki kolor pasuje do brązowego dachu?',
		],
		roof: [
			'Dachówka czy blacha?',
			'Czy czarny dach jest praktyczny?',
			'Koszty dachu płaskiego vs spadzistego',
		],
		windows: [
			'Czarne czy drewniane okna?',
			'Zalety dużych przeszkleń',
			'Okna ze szprosami - czy warto?',
		],
		ground: [
			'Kostka czy płyty betonowe?',
			'Tani sposób na podjazd',
			'Jak odprowadzić wodę z tarasu?',
		],
		garden: [
			'Rośliny niewymagające podlewania',
			'Szybko rosnący żywopłot',
			'Ogród nowoczesny czy wiejski?',
		],
		lighting: [
			'Ciepłe czy zimne światło?',
			'Jak oświetlić ścieżkę?',
			'Oświetlenie solarne - opinie',
		],
		atmosphere: ['Jak dom wygląda zimą?', 'Pokaż wersję o zachodzie słońca'],
		default: [
			'Czy te kolory do siebie pasują?',
			'Jak obniżyć koszt tej elewacji?',
		],
	};

	const fullOptions = {
		atmosphere: [
			{
				val: 'słoneczny letni dzień, błękitne niebo',
				label: 'Słoneczny Dzień',
				subLabel: 'Idealna pogoda',
				color: 'bg-gradient-to-br from-blue-200 to-blue-400',
			},
			{
				val: 'złota godzina, zachód słońca, ciepłe światło',
				label: 'Zachód Słońca',
				subLabel: 'Romantycznie',
				color: 'bg-gradient-to-br from-orange-200 to-orange-400',
			},
			{
				val: 'zima',
				label: 'Zima',
				subLabel: 'Śnieg',
				color: 'bg-gradient-to-br from-slate-100 to-slate-300',
			},
		],
		facade: [
			{
				val: 'biały tynk silikonowy gładki',
				label: 'Biały Tynk',
				color: 'bg-gray-50',
			},
			{ val: 'drewno elewacyjne', label: 'Drewno', color: 'bg-amber-600' },
			{ val: 'cegła klinkierowa', label: 'Cegła', color: 'bg-red-700' },
			{ val: 'kamień elewacyjny', label: 'Kamień', color: 'bg-stone-600' },
			{ val: 'stal kortenowska', label: 'Corten', color: 'bg-orange-700' },
		],
		roof: [
			{
				val: 'dachówka ceramiczna antracyt',
				label: 'Antracyt',
				color: 'bg-slate-800',
			},
			{
				val: 'dachówka ceramiczna czerwona',
				label: 'Czerwień',
				color: 'bg-red-600',
			},
			{ val: 'blacha na rąbek', label: 'Blacha', color: 'bg-gray-500' },
			{ val: 'zielony dach', label: 'Zielony Dach', color: 'bg-green-600' },
		],
		windows: [
			{ val: 'okna antracyt', label: 'Antracyt', color: 'bg-slate-800' },
			{ val: 'okna drewniane', label: 'Drewno', color: 'bg-amber-500' },
			{ val: 'okna białe', label: 'Białe', color: 'bg-white' },
		],
		ground: [
			{ val: 'kostka brukowa', label: 'Kostka', color: 'bg-slate-400' },
			{ val: 'płyty betonowe', label: 'Płyty', color: 'bg-gray-200' },
			{ val: 'trawnik', label: 'Trawnik', color: 'bg-green-500' },
		],
		fence: [
			{ val: 'ogrodzenie panelowe', label: 'Panelowe', color: 'bg-slate-700' },
			{ val: 'płot drewniany', label: 'Drewno', color: 'bg-amber-600' },
			{ val: 'gabiony', label: 'Gabiony', color: 'bg-stone-500' },
		],
		garden: [
			{ val: 'ogród nowoczesny', label: 'Nowoczesny', color: 'bg-green-200' },
			{ val: 'ogród wiejski', label: 'Wiejski', color: 'bg-pink-200' },
			{ val: 'ogród japoński', label: 'Japoński', color: 'bg-emerald-100' },
		],
		lighting: [
			{ val: 'kinkiety', label: 'Kinkiety', color: 'bg-yellow-200' },
			{ val: 'girlandy', label: 'Girlandy', color: 'bg-yellow-100' },
		],
		extras: [
			{ val: 'markiza', label: 'Markiza', color: 'bg-orange-300' },
			{ val: 'fotowoltaika', label: 'PV', color: 'bg-blue-900' },
			{ val: 'jacuzzi', label: 'Jacuzzi', color: 'bg-blue-400' },
		],
	};

	const presetsData = [
		{
			id: 'modern_barn',
			label: 'Nowoczesna Stodoła',
			desc: 'Minimalizm, drewno i antracyt',
			color: 'bg-slate-700',
			mods: {
				facade: [
					'elewacja z deski modrzewiowej naturalnej',
					'ciemny grafitowy tynk',
				],
				roof: ['blacha na rąbek stojący szara'],
				windows: ['okna aluminiowe czarny mat'],
				ground: ['wielkoformatowe płyty betonowe jasne'],
				garden: ['ogród nowoczesny z trawami ozdobnymi i lawendą'],
			},
		},
		{
			id: 'classic_elegance',
			label: 'Klasyczna Elegancja',
			desc: 'Jasny tynk i czerwona dachówka',
			color: 'bg-orange-100',
			mods: {
				facade: ['ciepły tynk w kolorze cappuccino'],
				roof: ['dachówka ceramiczna falista czerwona'],
				windows: ['okna i drzwi białe PCV'],
				ground: ['szara kostka brukowa melanż'],
				garden: ['ogród wiejski z kolorowymi kwiatami i krzewami'],
			},
		},
		{
			id: 'industrial_loft',
			label: 'Industrialny Loft',
			desc: 'Beton, stal i szkło',
			color: 'bg-gray-400',
			mods: {
				facade: ['jasnoszary tynk architektoniczny', 'stara cegła rozbiórkowa'],
				roof: ['dachówka ceramiczna płaska antracyt'],
				windows: ['okna aluminiowe czarny mat'],
				extras: ['nowoczesne meble tarasowe wypoczynkowe'],
				lighting: ['nowoczesne kinkiety elewacyjne góra-dół'],
			},
		},
		{
			id: 'mediterranean',
			label: 'Styl Śródziemnomorski',
			desc: 'Kamień, ciepło i słońce',
			color: 'bg-yellow-200',
			mods: {
				facade: ['kamień elewacyjny jasny piaskowiec', 'ciepły beżowy tynk'],
				roof: ['dachówka mnich-mniszka'],
				garden: ['ogród z cyprysami i lawendą'],
				atmosphere: ['słoneczny letni dzień, błękitne niebo'],
			},
		},
		{
			id: 'scandi_boho',
			label: 'Skandynawskie Boho',
			desc: 'Biel, drewno i przytulność',
			color: 'bg-stone-100',
			mods: {
				facade: ['biała deska elewacyjna', 'jasny tynk'],
				roof: ['dachówka jasnoszara'],
				garden: ['naturalny ogród z trawami i hamakiem'],
				extras: ['drewniany taras', 'wiszący fotel'],
				atmosphere: ['jasny, miękki dzień'],
			},
		},
		{
			id: 'polish_manor',
			label: 'Polski Dworek',
			desc: 'Tradycja z kolumnami',
			color: 'bg-white',
			mods: {
				facade: ['biały tynk gładki'],
				roof: ['dachówka karpiówka ceglasta'],
				windows: ['okna ze szprosami białe'],
				garden: ['strzyżony bukszpan, róże'],
				fence: ['płot kuty z podmurówką'],
			},
		},
		{
			id: 'cyberpunk',
			label: 'Futurystyczny Neon',
			desc: 'Odważny eksperyment',
			color: 'bg-purple-900',
			mods: {
				facade: ['ciemny beton', 'panele szklane'],
				lighting: ['oświetlenie neonowe RGB', 'linie świetlne LED'],
				atmosphere: ['nocne miasto, deszcz, neonowe odbicia'],
				extras: ['nowoczesne rzeźby'],
			},
		},
		{
			id: 'eco_green',
			label: 'Eko Dom',
			desc: 'Zatopiony w zieleni',
			color: 'bg-green-700',
			mods: {
				facade: ['drewno naturalne', 'wertykalny ogród na ścianie'],
				roof: ['zielony dach ekstensywny'],
				garden: ['łąka kwietna', 'duże drzewa'],
				ground: ['kratka trawnikowa'],
			},
		},
	];

	useEffect(() => {
		const saved = localStorage.getItem('house_viz_projects');
		if (saved) setSavedProjects(JSON.parse(saved));
	}, []);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatMessages, isChatOpen]);

	useEffect(() => {
		setChatSuggestions(suggestionsMap[activeTab] || suggestionsMap['default']);
	}, [activeTab]);

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
				const base64data = reader.result;
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
			const reader = new FileReader();
			reader.onload = (e) => {
				const imgData = e.target.result;
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
	const addToHistory = (image, mods) => {
		setHistory((prev) =>
			[
				{
					id: Date.now(),
					image,
					modifications: JSON.parse(JSON.stringify(mods)),
					timestamp: new Date().toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}),
				},
				...prev,
			].slice(0, 10)
		);
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
	const handleWheel = (e) => {
		if (!currentImage) return;
		if (e.ctrlKey || e.metaKey || isFullscreen) {
			e.preventDefault();
			const delta = e.deltaY * -0.01;
			const newZoom = Math.min(Math.max(1, zoomLevel + delta), 4);
			setZoomLevel(newZoom);
			if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
		}
	};
	const startPan = (e) => {
		if (zoomLevel > 1) {
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

	const handleChatSubmit = async (e, textOverride = null) => {
		if (e) e.preventDefault();
		const text = textOverride || chatInput;
		if (!text || !text.trim()) return;
		const userMsg = { role: 'user', text: text };
		setChatMessages((prev) => [...prev, userMsg]);
		setChatInput('');
		setIsChatLoading(true);
		try {
			const context = Object.entries(modifications)
				.filter(([k, v]) => v && v.length > 0)
				.map(([k, v]) => `${k}: ${v}`)
				.join(', ');
			const fullPrompt = `Jesteś architektem. Projekt użytkownika: [${context}]. Pytanie: "${userMsg.text}". Doradź krótko i konkretnie w języku polskim.`;

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: fullPrompt }),
			});
			const data = await response.json();

			setChatMessages((prev) => [
				...prev,
				{ role: 'system', text: data.text || 'Błąd połączenia.' },
			]);
		} catch (err) {
			setChatMessages((prev) => [
				...prev,
				{ role: 'system', text: 'Wystąpił błąd.' },
			]);
		} finally {
			setIsChatLoading(false);
		}
	};

	const generateVisualization = async () => {
		if (!originalImage) return;
		setIsProcessing(true);
		setProcessingStep('Analiza geometrii...');
		setError('');
		setIsCompareMode(false);
		resetZoom();
		try {
			let promptParts = [];
			const joinSelections = (arr) =>
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
			setTimeout(() => setProcessingStep('Renderowanie...'), 2000);

			const base64Image = currentImage.split(',')[1];
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
			if (data.error) throw new Error(data.error);

			const generatedBase64 = data.candidates?.[0]?.content?.parts?.find(
				(p) => p.inlineData
			)?.inlineData?.data;
			if (generatedBase64) {
				setCurrentImage(`data:image/png;base64,${generatedBase64}`);
				addToHistory(`data:image/png;base64,${generatedBase64}`, modifications);
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

	const getShoppingLink = (query) =>
		`https://www.google.com/search?q=${encodeURIComponent(
			query + ' materiały budowlane cena'
		)}&tbm=shop`;

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
								<Home size={24} />
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
							{currentImage && !isFullscreen && (
								<div className='pointer-events-auto flex space-x-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 shadow-sm'>
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
							className={`flex-1 relative bg-slate-100 flex items-center justify-center overflow-hidden group select-none ${
								isDragging
									? 'cursor-grabbing'
									: zoomLevel > 1
									? 'cursor-grab'
									: 'cursor-default'
							}`}
							onWheel={handleWheel}
							onMouseDown={startPan}
							onMouseMove={doPan}
							onMouseUp={endPan}
							onMouseLeave={endPan}
						>
							{!currentImage ? (
								<div
									onClick={triggerFileInput}
									className='text-center p-8 cursor-pointer hover:bg-slate-200 transition-all rounded-xl border-2 border-dashed border-slate-300 m-8 w-full max-w-lg'
								>
									<div className='bg-blue-50 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Upload size={32} />
									</div>
									<h3 className='text-lg font-bold text-slate-700'>
										Wgraj zdjęcie domu
									</h3>
									<p className='text-slate-500 text-sm mb-4'>
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
								<div className='relative w-full h-full flex items-center justify-center bg-checkered'>
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
									icon={Home}
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
								<div className='grid grid-cols-2 gap-3 mb-6'>
									{(fullOptions[activeTab] || []).map((opt, idx) => (
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
							)}
							{activeTab !== 'presets' && (
								<div className='mt-4 pt-4 border-t border-slate-200'>
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
			<div
				className={`fixed bottom-6 right-6 z-40 flex flex-col items-end transition-all duration-300 ${
					isChatOpen ? 'w-80 md:w-96' : 'w-auto'
				}`}
			>
				{isChatOpen && (
					<div className='bg-white rounded-2xl shadow-2xl border border-slate-200 w-full mb-4 overflow-hidden animate-in slide-in-from-bottom-10'>
						<div className='bg-slate-800 text-white p-3 flex justify-between items-center'>
							<div className='flex items-center space-x-2'>
								<MessageSquare size={18} />
								<span className='font-bold text-sm'>AI Architekt</span>
							</div>
							<button
								onClick={() => setIsChatOpen(false)}
								className='hover:bg-slate-700 p-1 rounded'
							>
								<X size={16} />
							</button>
						</div>
						<div className='h-80 overflow-y-auto p-4 bg-slate-50 space-y-3 custom-scrollbar'>
							{chatMessages.map((msg, i) => (
								<div
									key={i}
									className={`flex ${
										msg.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-[85%] rounded-2xl p-3 text-sm ${
											msg.role === 'user'
												? 'bg-blue-600 text-white rounded-br-none'
												: 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
										}`}
									>
										{msg.text}
									</div>
								</div>
							))}
							{isChatLoading && (
								<div className='text-xs text-slate-400 p-2'>Piszę...</div>
							)}
							<div ref={chatEndRef}></div>
						</div>
						<div className='px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide bg-white border-t border-slate-50 pt-2'>
							{chatSuggestions.map((s, i) => (
								<button
									key={i}
									onClick={(e) => handleChatSubmit(e, s)}
									className='whitespace-nowrap bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 flex-shrink-0'
								>
									{s}
								</button>
							))}
						</div>
						<form
							onSubmit={(e) => handleChatSubmit(e)}
							className='p-3 bg-white border-t border-slate-100 flex space-x-2'
						>
							<input
								type='text'
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								placeholder='Zapytaj...'
								className='flex-1 text-sm bg-slate-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
							/>
							<button
								type='submit'
								disabled={isChatLoading || !chatInput.trim()}
								className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors'
							>
								<Send size={18} />
							</button>
						</form>
					</div>
				)}
				{!isFullscreen && (
					<button
						onClick={() => setIsChatOpen(!isChatOpen)}
						className={`shadow-xl flex items-center justify-center rounded-full transition-all duration-300 ${
							isChatOpen
								? 'w-12 h-12 bg-slate-600 text-white'
								: 'w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
						}`}
					>
						{isChatOpen ? <X size={24} /> : <MessageSquare size={28} />}
					</button>
				)}
			</div>
			<style>{` .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } @media print { @page { margin: 1.5cm; size: landscape; } body { background: white; } .no-print { display: none !important; } .print\\:block { display: block !important; } .print\\:hidden { display: none !important; } .print\\:mb-4 { margin-bottom: 1rem !important; } .print\\:gap-4 { gap: 1rem !important; } .print\\:bg-white { background-color: white !important; } .print\\:border-slate-200 { border-color: #e2e8f0 !important; } .print\\:text-slate-800 { color: #1e293b !important; } .print\\:text-black { color: black !important; } .print\\:text-slate-200 { color: #e2e8f0 !important; } } `}</style>
		</div>
	);
}
