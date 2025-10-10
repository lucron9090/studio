# Unified Red Team Operations Platform

A sophisticated web-based toolkit for security researchers and AI developers to systematically test the safety filters and operational boundaries of Large Language Models (LLMs).

## 📚 Documentation

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Comprehensive status of all features, technology, and functionality (22KB)
- **[QUICK_STATUS.md](./QUICK_STATUS.md)** - Quick reference guide with key metrics (5KB)
- **[GITHUB_PROJECT_SETUP.md](./GITHUB_PROJECT_SETUP.md)** - Detailed guide for organizing this project in GitHub (14KB)
- **[VERTEX_AI_TESTING.md](./VERTEX_AI_TESTING.md)** - Testing guide for Vertex AI integration

## 🚀 Quick Start

This app uses Genkit with Vertex AI.

## Environment

Create `.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

GOOGLE_CLOUD_PROJECT=your-project-id
VERTEX_AI_LOCATION=us-central1
```

Authenticate for Vertex:

```
gcloud auth application-default login
```

## Run

```bash
npm install
npm run dev
```

## 🎯 Current Status

**Version:** 0.1.0 (Alpha)  
**Production Ready:** ~60%

### ✅ What's Working
- User authentication (Firebase)
- Operation creation wizard with AI assistance
- Live attack execution interface
- 13 AI flows powered by Vertex AI (Gemini)
- Real-time operation management
- 40+ UI components

### ⚠️ What's Missing
- Real LLM integration (OpenAI, Anthropic, xAI)
- PDF report generation
- Advanced attack modules (SPECTRE, TOXIN, ECHO, MAKER)
- Comprehensive testing
- Production monitoring

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for complete details.

## 🏗️ Technology Stack

- **Frontend:** Next.js 14 + TypeScript + React 18
- **UI:** Tailwind CSS + Shadcn/ui + Radix UI
- **Backend:** Firebase/Firestore
- **AI:** Genkit 1.19.3 + Google Vertex AI (Gemini 2.0)
- **Authentication:** Firebase Auth

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

See [GITHUB_PROJECT_SETUP.md](./GITHUB_PROJECT_SETUP.md) for:
- Detailed epic/feature breakdown
- Issue templates and labels
- Milestone roadmap
- Project board setup

## 📄 License

Not specified
