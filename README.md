# Unified Red Team Operations Platform

A sophisticated web-based toolkit for security researchers and AI developers to systematically test the safety filters and operational boundaries of Large Language Models (LLMs).

## 📚 Documentation

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Comprehensive status of all features, technology, and functionality
- **[QUICK_STATUS.md](./QUICK_STATUS.md)** - Quick reference guide with key metrics
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development setup and contribution guidelines
- **[GITHUB_PROJECT_SETUP.md](./GITHUB_PROJECT_SETUP.md)** - Detailed guide for organizing this project in GitHub
- **[VERTEX_AI_TESTING.md](./VERTEX_AI_TESTING.md)** - Testing guide for Vertex AI integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account and project
- Google Cloud account (for Vertex AI)

### Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/lucron9090/studio.git
cd studio
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and Google Cloud credentials.

3. **Authenticate with Google Cloud (for Vertex AI):**
```bash
gcloud auth application-default login
```

4. **Run development server:**
```bash
npm run dev
```

The app will be available at http://localhost:9002

### Build for Production

```bash
npm run build   # Creates optimized production build
npm start       # Serves production build
```

## 🎯 Current Status

**Version:** 0.1.0 (Alpha)  
**Production Ready:** ~65%  
**Build Status:** ✅ Stable  
**Last Updated:** October 14, 2025

### ✅ What's Working
- User authentication (Firebase)
- Operation creation wizard with AI assistance
- Live attack execution interface
- 13 AI flows powered by Vertex AI (Gemini)
- Real-time operation management
- 40+ UI components
- Production build system (Next.js 14.2.33)
- Type-safe TypeScript codebase

### ⚠️ What's Missing
- Real LLM integration (OpenAI, Anthropic, xAI)
- PDF report generation
- Advanced attack modules (SPECTRE, TOXIN, ECHO, full MAKER)
- Comprehensive testing suite
- Production monitoring and logging

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for complete details.

## 🏗️ Technology Stack

- **Frontend:** Next.js 14.2.33 + TypeScript + React 18
- **UI:** Tailwind CSS + Shadcn/ui + Radix UI
- **Backend:** Firebase/Firestore 11.9.1
- **AI:** Genkit 1.19.3 + Google Vertex AI (Gemini 2.0 Flash Exp)
- **Authentication:** Firebase Auth
- **Build:** Next.js compiler with static + dynamic rendering

## 📁 Project Structure

```
studio/
├── src/ai/           → AI flows and prompts (13 flows)
├── src/app/          → Next.js pages and routes
├── src/components/   → UI components (40+)
├── src/services/     → Business logic
└── docs/             → Design documentation
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development environment setup
- Code style guidelines
- Git workflow and commit conventions
- Testing guidelines

See [GITHUB_PROJECT_SETUP.md](./GITHUB_PROJECT_SETUP.md) for:
- Detailed epic/feature breakdown
- Issue templates and labels
- Milestone roadmap
- Project board setup

## 📄 License

Not specified
