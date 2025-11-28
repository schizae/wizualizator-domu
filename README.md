# 🏠 AI Wizualizator Domu PRO

> Przekształć swój dom z pomocą sztucznej inteligencji Google Gemini

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Aplikacja webowa wykorzystująca AI do fotorealistycznej wizualizacji zmian w Twoim domu. Wybierz styl, materiały, kolory i zobacz efekt w czasie rzeczywistym.

![AI Wizualizator Demo](https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=400&fit=crop)

---

## ✨ Funkcje

### 🎨 **Zaawansowana personalizacja**
- **10 kategorii modyfikacji**: elewacja, dach, stolarka, teren, ogrodzenie, ogród, oświetlenie, dodatki, atmosfera, custom
- **100+ opcji materiałów**: od klasycznego tynku po nowoczesny Corten
- **8 gotowych presetów stylowych**: Nowoczesna Stodoła, Skandynawskie Boho, Polski Dworek, Eko Dom i więcej

### 🤖 **AI-Powered Generation**
- **Google Gemini 2.5 Flash**: Najnowszy model generujący fotorealistyczne wizualizacje
- **Zachowanie geometrii**: AI respektuje architekturę oryginalnego budynku
- **Chat AI Architekt**: Wirtualny doradca odpowiadający na pytania o materiały i style

### 🖼️ **Profesjonalne narzędzia**
- **Tryb porównania Before/After**: Suwak pokazujący oryginał vs wizualizację
- **Historia generacji**: Do 10 ostatnich wersji z możliwością przywrócenia
- **Zoom i Pan**: Sprawdź każdy szczegół w pełnoekranowym trybie
- **Wskaźnik budżetu**: Automatyczna ocena kosztowności wybranych materiałów

### 💾 **Zarządzanie projektami**
- **Zapis lokalny**: Projekty w localStorage (bezpieczeństwo offline)
- **Export/Import JSON**: Konfiguracje do udostępniania
- **Raporty PDF**: Lista materiałów z linkami do sklepów
- **Download PNG/JPG**: Wizualizacje w wysokiej rozdzielczości

---

## 🚀 Quick Start

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/schizae/wizualizator-domu.git
cd wizualizator-domu

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj API key
cp .env.example .env.local
# Edytuj .env.local i wklej swój klucz Gemini API

# 4. Uruchom development server
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

---

## 📦 Instalacja

### Wymagania systemowe

- **Node.js** 18.17 lub nowszy
- **npm** / **yarn** / **pnpm** / **bun**
- **Klucz API Google Gemini** (darmowy tier: 1500 req/dzień)

### Krok po kroku

#### 1. **Pobierz kod**

```bash
git clone https://github.com/schizae/wizualizator-domu.git
cd wizualizator-domu
```

#### 2. **Zainstaluj pakiety**

```bash
npm install
# lub
yarn install
# lub
pnpm install
```

#### 3. **Skonfiguruj klucz API**

##### Pobierz klucz API:
1. Przejdź do [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Zaloguj się kontem Google
3. Kliknij **"Create API Key"**
4. Skopiuj wygenerowany klucz

##### Dodaj do projektu:
```bash
cp .env.example .env.local
```

Edytuj `.env.local`:
```bash
GOOGLE_GEMINI_API_KEY=twoj_klucz_api_tutaj
```

> ⚠️ **WAŻNE**: Plik `.env.local` NIE jest commitowany do git. Nigdy nie udostępniaj publicznie swojego klucza API!

#### 4. **Uruchom aplikację**

```bash
npm run dev
```

Aplikacja dostępna pod: **http://localhost:3000**

---

## 🎯 Jak używać

### 1. **Upload zdjęcia**
- Kliknij "Wgraj zdjęcie domu"
- Wybierz JPG/PNG (max 20MB)
- Lub użyj przykładowego zdjęcia demo

### 2. **Wybierz modyfikacje**
- **Presety**: Gotowe style (szybkie)
- **Custom**: 10 kategorii z 100+ opcjami

### 3. **Generuj wizualizację**
- Kliknij "GENERUJ WIZUALIZACJĘ"
- Poczekaj ~10-30s (zależnie od złożoności)
- Zobacz rezultat!

### 4. **Porównaj i zapisz**
- Włącz tryb porównania (suwak)
- Zoom/Pan dla szczegółów
- Pobierz PNG/JPG lub PDF raport

---

## 🔧 Stack Technologiczny

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework z App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Lucide React](https://lucide.dev/)** - Ikony SVG

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API
- **[Zod](https://zod.dev/)** - Schema validation
- **[Google Gemini AI](https://ai.google.dev/)** - Image generation & chat

### Bezpieczeństwo
- Security headers (XSS, Clickjacking, MIME sniffing)
- API key w zmiennych środowiskowych
- Walidacja input/output (Zod)
- Timeout dla API calls (30s/15s)

---

## 🚀 Deployment

### Vercel (Rekomendowane - 1-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/schizae/wizualizator-domu)

**Lub manualnie:**

```bash
# 1. Zainstaluj Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Dodaj zmienną środowiskową w Vercel Dashboard:
# Settings → Environment Variables → Add
# GOOGLE_GEMINI_API_KEY=twoj_klucz
```

### Inne platformy

<details>
<summary>Netlify</summary>

```bash
# Build command:
npm run build

# Publish directory:
.next

# Dodaj zmienne środowiskowe w Netlify Dashboard
```
</details>

<details>
<summary>Docker</summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t wizualizator-domu .
docker run -p 3000:3000 -e GOOGLE_GEMINI_API_KEY=twoj_klucz wizualizator-domu
```
</details>

---

## 📁 Struktura projektu

```
wizualizator-domu/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # AI Chat endpoint
│   │   └── generate/route.ts   # Image generation endpoint
│   ├── data/
│   │   └── constants.ts        # Presety, opcje materiałów
│   ├── layout.tsx              # Root layout (metadata)
│   ├── page.tsx                # Główny komponent (1230 linii)
│   └── globals.css             # Tailwind styles
├── components/
│   ├── ui/
│   │   ├── BudgetIndicator.tsx
│   │   ├── CategoryButton.tsx
│   │   ├── OptionCard.tsx
│   │   └── PresetCard.tsx
│   └── ChatWindow.tsx          # AI Chat component
├── hooks/
│   └── useHouseGenerator.ts    # Logika generowania
├── public/                     # Statyczne assety
├── .env.example                # Przykładowa konfiguracja
├── next.config.ts              # Next.js config + security
├── tailwind.config.ts          # Tailwind config
└── tsconfig.json               # TypeScript config
```

---

## 🛠️ Development

### Komendy npm

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

### Zmienne środowiskowe

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `GOOGLE_GEMINI_API_KEY` | ✅ | Klucz API z Google AI Studio |
| `NEXT_PUBLIC_APP_URL` | ❌ | URL aplikacji (default: localhost:3000) |
| `NODE_ENV` | ❌ | Environment (default: development) |

### Debugowanie

```bash
# Logi developerskie w konsoli przeglądarki (F12)
# Backend logs w terminalu (npm run dev)

# Sprawdź API endpoints bezpośrednio:
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test pytanie"}'
```

---

## 🤝 Contributing

Chcesz pomóc? Wspaniale! 🎉

### Jak zacząć:

1. **Fork** repozytorium
2. **Utwórz branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** zmian (`git commit -m '✨ Add: AmazingFeature'`)
4. **Push** do brancha (`git push origin feature/AmazingFeature`)
5. **Otwórz Pull Request**

### Konwencje:

- **Commits**: Używaj emoji prefixów:
  - ✨ `:sparkles:` - nowa funkcja
  - 🐛 `:bug:` - bugfix
  - 📝 `:memo:` - dokumentacja
  - 🎨 `:art:` - styling/UI
  - ♻️ `:recycle:` - refactoring
  - 🔒 `:lock:` - security
  - ⚡ `:zap:` - performance

- **Code style**:
  - TypeScript strict mode
  - ESLint + Prettier
  - Tailwind utility classes

---

## 📄 Licencja

Projekt dostępny na licencji **MIT**. Zobacz [LICENSE](LICENSE) dla szczegółów.

```
Copyright (c) 2025 AI Wizualizator Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Podziękowania

- **[Google Gemini AI](https://ai.google.dev/)** - za potężne modele AI
- **[Vercel](https://vercel.com/)** - za hosting i Next.js framework
- **[Unsplash](https://unsplash.com/)** - za darmowe zdjęcia demo
- **Gemini 3 Preview (Antygravity IDE)** - za pomoc w tworzeniu kodu bazowego
- **Claude Code** - za code review i production hardening

---

## 📞 Kontakt

- **GitHub Issues**: [Zgłoś bug lub zaproponuj feature](https://github.com/schizae/wizualizator-domu/issues)
- **Dyskusje**: [GitHub Discussions](https://github.com/schizae/wizualizator-domu/discussions)

---

## 🗺️ Roadmap

- [ ] **Kompresja obrazów client-side** (przed upload do API)
- [ ] **Rate limiting middleware** (ochrona przed spamem)
- [ ] **User accounts** (cloud sync projektów)
- [ ] **Multi-image support** (front + tył + ogród)
- [ ] **AR Preview** (aplikacja mobilna)
- [ ] **Interior design mode** (wnętrza)
- [ ] **API dla developerów** (white-label solution)

---

## ⭐ Star History

Jeśli projekt Ci się podoba, zostaw ⭐ na [GitHub](https://github.com/schizae/wizualizator-domu)!

---

<div align="center">

Stworzono z ❤️ przy pomocy AI

**[Demo](https://wizualizator-domu.vercel.app)** • **[Dokumentacja](https://github.com/schizae/wizualizator-domu/wiki)** • **[Changelog](CHANGELOG.md)**

</div>
