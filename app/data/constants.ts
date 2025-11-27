
export const categoryLabels = {
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

export const suggestionsMap = {
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

export const fullOptions = {
	atmosphere: [
		{
			val: 'błękitne niebo',
			label: 'Słoneczny Dzień',
			color: 'bg-blue-400',
		},
		{
			val: 'złota godzina',
			label: 'Zachód Słońca',
			color: 'bg-orange-400',
		},
		{
			val: 'śnieg',
			label: 'Zima',
			color: 'bg-slate-200',
		},
		{
			val: 'oświetlenie, ciemne tło',
			label: 'Noc',
			color: 'bg-slate-900',
			textColor: 'text-white',
		},
		{
			val: 'mokra nawierzchnia',
			label: 'Jesień / Deszcz',
			color: 'bg-slate-500',
			textColor: 'text-white',
		},
		{
			val: 'tajemniczo',
			label: 'Mglisty Poranek',
			color: 'bg-gray-300',
		},
		{
			val: 'dramatyczne chmury',
			label: 'Burza',
			color: 'bg-slate-700',
			textColor: 'text-white',
		},
	],
	facade: [
		{
			val: 'silikonowy gładki',
			label: 'Biały Tynk',
			color: 'bg-white',
		},
		{
			val: 'tynk architektoniczny/beton',
			label: 'Jasny Szary',
			color: 'bg-gray-300',
		},
		{
			val: 'ciemny tynk',
			label: 'Grafit',
			color: 'bg-slate-700',
			textColor: 'text-white',
		},
		{
			val: 'ciepły tynk',
			label: 'Cappuccino',
			color: 'bg-orange-100',
		},
		{
			val: 'deska modrzewiowa',
			label: 'Drewno Naturalne',
			color: 'bg-amber-600',
			textColor: 'text-white',
		},
		{
			val: 'shou sugi ban - opalane',
			label: 'Czarne Drewno',
			color: 'bg-neutral-900',
			textColor: 'text-white',
		},
		{
			val: 'klinkier klasyczny',
			label: 'Czerwona Cegła',
			color: 'bg-red-700',
			textColor: 'text-white',
		},
		{
			val: 'rozbiórkowa, loft',
			label: 'Stara Cegła',
			color: 'bg-red-900',
			textColor: 'text-white',
		},
		{
			val: 'łupek kwarcytowy',
			label: 'Kamień',
			color: 'bg-stone-600',
			textColor: 'text-white',
		},
		{
			val: 'stal rdzawa',
			label: 'Corten',
			color: 'bg-orange-700',
			textColor: 'text-white',
		},
		{
			val: 'płyty architektoniczne',
			label: 'Beton 3D',
			color: 'bg-gray-400',
		},
		{
			val: 'drewniane, styl góralski',
			label: 'Bale',
			color: 'bg-amber-800',
			textColor: 'text-white',
		},
		{
			val: 'rośliny wertykalne',
			label: 'Zielona Ściana',
			color: 'bg-green-600',
			textColor: 'text-white',
		},
	],
	roof: [
		{
			val: 'dachówka ceramiczna',
			label: 'Płaska Antracyt',
			color: 'bg-slate-800',
			textColor: 'text-white',
		},
		{
			val: 'dachówka klasyczna',
			label: 'Falista Czerwień',
			color: 'bg-red-600',
			textColor: 'text-white',
		},
		{
			val: 'szara',
			label: 'Blacha na Rąbek',
			color: 'bg-slate-500',
			textColor: 'text-white',
		},
		{
			val: 'bitumiczny',
			label: 'Gont Brązowy',
			color: 'bg-amber-900',
			textColor: 'text-white',
		},
		{
			val: 'ekstensywny',
			label: 'Zielony Dach',
			color: 'bg-green-700',
			textColor: 'text-white',
		},
		{
			val: 'fotowoltaiczny',
			label: 'Dach Solarny',
			color: 'bg-blue-900',
			textColor: 'text-white',
		},
		{
			val: 'trzcina',
			label: 'Strzecha',
			color: 'bg-yellow-700',
			textColor: 'text-white',
		},
		{
			val: 'blacha miedziana',
			label: 'Miedź',
			color: 'bg-orange-600',
			textColor: 'text-white',
		},
		{
			val: 'naturalny kamień',
			label: 'Łupek',
			color: 'bg-slate-700',
			textColor: 'text-white',
		},
	],
	windows: [
		{
			val: 'RAL 7016',
			label: 'Antracyt',
			color: 'bg-slate-800',
			textColor: 'text-white',
		},
		{
			val: 'Złoty Dąb',
			label: 'Drewno',
			color: 'bg-amber-600',
			textColor: 'text-white',
		},
		{
			val: 'PCV',
			label: 'Białe',
			color: 'bg-white',
		},
		{
			val: 'aluminium',
			label: 'Czarny Mat',
			color: 'bg-black',
			textColor: 'text-white',
		},
		{
			val: 'styl dworkowy',
			label: 'Szprosy',
			color: 'bg-white',
			subLabel: 'Kratka',
		},
		{
			val: 'duże przeszklenia',
			label: 'Bezramowe',
			color: 'bg-blue-200',
		},
		{
			val: 'tradycyjne',
			label: 'Łukowe',
			color: 'bg-amber-100',
		},
		{
			val: 'mosiądz/glamour',
			label: 'Złote Ramy',
			color: 'bg-yellow-400',
		},
	],
	ground: [
		{
			val: 'szara',
			label: 'Kostka Melanż',
			color: 'bg-gray-400',
		},
		{
			val: 'betonowe jasne',
			label: 'Płyty XXL',
			color: 'bg-gray-200',
		},
		{
			val: 'jasna',
			label: 'Kostka Granitowa',
			color: 'bg-stone-300',
		},
		{
			val: 'kompozyt brązowy',
			label: 'Deska Tarasowa',
			color: 'bg-amber-700',
			textColor: 'text-white',
		},
		{
			val: 'dywanowy',
			label: 'Trawnik',
			color: 'bg-green-500',
			textColor: 'text-white',
		},
		{
			val: 'ścieżka kamienna',
			label: 'Żwir',
			color: 'bg-stone-200',
		},
		{
			val: 'gładka nawierzchnia',
			label: 'Asfalt',
			color: 'bg-slate-800',
			textColor: 'text-white',
		},
		{
			val: 'bruk rzymski',
			label: 'Kocie Łby',
			color: 'bg-stone-500',
			textColor: 'text-white',
		},
		{
			val: 'bangkirai',
			label: 'Drewno Egzotyczne',
			color: 'bg-amber-800',
			textColor: 'text-white',
		},
		{
			val: 'płyty ażurowe z trawą',
			label: 'Eko-Kratka',
			color: 'bg-green-300',
		},
	],
	fence: [
		{
			val: 'systemowe antracyt',
			label: 'Panelowe',
			color: 'bg-slate-700',
			textColor: 'text-white',
		},
		{
			val: 'gładkie',
			label: 'Bloczki Betonowe',
			color: 'bg-gray-300',
		},
		{
			val: 'płot drewniany nowoczesny',
			label: 'Deski Poziome',
			color: 'bg-amber-600',
			textColor: 'text-white',
		},
		{
			val: 'kosze z kamieniem',
			label: 'Gabiony',
			color: 'bg-stone-400',
		},
		{
			val: 'klasyczne z ornamentami',
			label: 'Kute',
			color: 'bg-black',
			textColor: 'text-white',
		},
		{
			val: 'aluminiowe',
			label: 'Żaluzjowe',
			color: 'bg-slate-600',
			textColor: 'text-white',
		},
		{
			val: 'styl amerykański',
			label: 'Sztachety Białe',
			color: 'bg-white',
		},
		{
			val: 'klinkier',
			label: 'Mur Ceglany',
			color: 'bg-red-700',
			textColor: 'text-white',
		},
		{
			val: 'nowoczesna balustrada',
			label: 'Szkło',
			color: 'bg-blue-100',
		},
	],
	garden: [
		{
			val: 'trawy ozdobne, lawenda',
			label: 'Nowoczesny',
			color: 'bg-green-300',
		},
		{
			val: 'sosny, paprocie',
			label: 'Leśny',
			color: 'bg-green-800',
			textColor: 'text-white',
		},
		{
			val: 'bonsai, żwir',
			label: 'Japoński',
			color: 'bg-emerald-100',
		},
		{
			val: 'kolorowe kwiaty',
			label: 'Wiejski',
			color: 'bg-pink-300',
		},
		{
			val: 'sukulenty, kamienie',
			label: 'Skalniak',
			color: 'bg-stone-400',
		},
		{
			val: 'dzika',
			label: 'Łąka Kwietna',
			color: 'bg-yellow-200',
		},
		{
			val: 'żywopłoty, symetria',
			label: 'Francuski',
			color: 'bg-green-600',
			textColor: 'text-white',
		},
		{
			val: 'cyprysy, zioła',
			label: 'Toskania',
			color: 'bg-orange-200',
		},
		{
			val: 'palmy, duże liście',
			label: 'Tropikalny',
			color: 'bg-green-500',
			textColor: 'text-white',
		},
	],
	lighting: [
		{
			val: 'góra-dół',
			label: 'Kinkiety LED',
			color: 'bg-yellow-100',
		},
		{
			val: 'świetlne nad tarasem',
			label: 'Girlandy',
			color: 'bg-yellow-200',
		},
		{
			val: 'punktowe podświetlenie roślin',
			label: 'Iluminacja',
			color: 'bg-green-200',
		},
		{
			val: 'w podjeździe',
			label: 'Linie LED',
			color: 'bg-blue-100',
		},
		{
			val: 'ogrodowe klasyczne',
			label: 'Latarnie',
			color: 'bg-slate-800',
			textColor: 'text-white',
		},
		{
			val: 'żywy ogień',
			label: 'Pochodnie',
			color: 'bg-orange-500',
			textColor: 'text-white',
		},
		{
			val: 'podświetlany',
			label: 'Numer Domu',
			color: 'bg-white',
		},
		{
			val: 'kolorowe światło',
			label: 'RGB Smart',
			color: 'bg-purple-500',
			textColor: 'text-white',
		},
	],
	extras: [
		{
			val: 'tarasowa',
			label: 'Markiza',
			color: 'bg-orange-200',
		},
		{
			val: 'drewniana',
			label: 'Pergola',
			color: 'bg-amber-700',
			textColor: 'text-white',
		},
		{
			val: 'panele na dachu',
			label: 'Fotowoltaika',
			color: 'bg-blue-900',
			textColor: 'text-white',
		},
		{
			val: 'nowoczesne',
			label: 'Meble Tarasowe',
			color: 'bg-gray-200',
		},
		{
			val: 'z roślinami',
			label: 'Donice Betonowe',
			color: 'bg-gray-400',
		},
		{
			val: 'ogrodowe',
			label: 'Jacuzzi',
			color: 'bg-blue-400',
		},
		{
			val: 'fire pit',
			label: 'Palenisko',
			color: 'bg-orange-600',
			textColor: 'text-white',
		},
		{
			val: 'huśtawka wisząca',
			label: 'Kokon',
			color: 'bg-stone-300',
		},
		{
			val: 'grill murowany',
			label: 'Kuchnia Letnia',
			color: 'bg-red-800',
			textColor: 'text-white',
		},
		{
			val: 'ogrodowy',
			label: 'Basen',
			color: 'bg-blue-500',
			textColor: 'text-white',
		},
		{
			val: 'gospodarczy',
			label: 'Domek Narzędziowy',
			color: 'bg-amber-200',
		},
	],
};

export const presetsData = [
	{
		id: 'modern_barn',
		label: 'Nowoczesna Stodoła',
		desc: 'Minimalizm, drewno i antracyt',
		color: 'bg-slate-700',
		mods: {
			facade: ['deska modrzewiowa', 'ciemny tynk'],
			roof: ['blacha na rąbek szara'],
			windows: ['czarny mat'],
			ground: ['płyty betonowe jasne'],
			garden: ['nowoczesny z trawami'],
		},
	},
	{
		id: 'classic_elegance',
		label: 'Klasyczna Elegancja',
		desc: 'Jasny tynk i czerwona dachówka',
		color: 'bg-orange-100',
		mods: {
			facade: ['tynk cappuccino'],
			roof: ['dachówka falista czerwona'],
			windows: ['białe PCV'],
			ground: ['szara kostka'],
			garden: ['wiejski z kwiatami'],
		},
	},
	{
		id: 'industrial_loft',
		label: 'Industrialny Loft',
		desc: 'Beton, stal i szkło',
		color: 'bg-gray-400',
		mods: {
			facade: ['tynk architektoniczny', 'stara cegła'],
			roof: ['dachówka płaska antracyt'],
			windows: ['czarny mat'],
			extras: ['nowoczesne meble'],
			lighting: ['kinkiety góra-dół'],
		},
	},
	{
		id: 'mediterranean',
		label: 'Styl Śródziemnomorski',
		desc: 'Kamień, ciepło i słońce',
		color: 'bg-yellow-200',
		mods: {
			facade: ['kamień piaskowiec', 'beżowy tynk'],
			roof: ['mnich-mniszka'],
			garden: ['cyprysy', 'lawenda'],
			atmosphere: ['słoneczny dzień'],
		},
	},
	{
		id: 'scandi_boho',
		label: 'Skandynawskie Boho',
		desc: 'Biel, drewno i przytulność',
		color: 'bg-stone-100',
		mods: {
			facade: ['biała deska', 'jasny tynk'],
			roof: ['jasnoszary'],
			garden: ['naturalny'],
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
			roof: ['karpiówka ceglasta'],
			windows: ['ze szprosami białe'],
			garden: ['bukszpan', 'róże'],
			fence: ['kuty z podmurówką'],
		},
	},
	{
		id: 'cyberpunk',
		label: 'Futurystyczny Neon',
		desc: 'Odważny eksperyment',
		color: 'bg-purple-900',
		mods: {
			facade: ['ciemny beton', 'panele szklane'],
			lighting: ['neonowe RGB', 'linie LED'],
			atmosphere: ['nocne miasto', 'deszcz'],
			extras: ['nowoczesne rzeźby'],
		},
	},
	{
		id: 'eco_green',
		label: 'Eko Dom',
		desc: 'Zatopiony w zieleni',
		color: 'bg-green-700',
		mods: {
			facade: ['drewno naturalne', 'wertykalny ogród'],
			roof: ['zielony dach ekstensywny'],
			garden: ['łąka kwietna'],
			ground: ['kratka trawnikowa'],
		},
	},
];
