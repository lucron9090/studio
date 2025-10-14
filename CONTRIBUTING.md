# Contributing to Unified Red Team Operations Platform

Thank you for your interest in contributing! This document provides guidelines for setting up the development environment and contributing to the project.

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Google Cloud account (for Vertex AI)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/lucron9090/studio.git
cd studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration from Firebase Console
- `GOOGLE_CLOUD_PROJECT` - Your Google Cloud project ID
- `VERTEX_AI_LOCATION` - Vertex AI region (default: us-central1)

### 4. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:9002

## 🏗️ Project Structure

```
studio/
├── src/
│   ├── ai/              # AI flows and Genkit configuration
│   │   ├── flows/       # AI flow implementations
│   │   ├── prompts/     # Prompt templates
│   │   └── genkit.ts    # Genkit initialization
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── lib/             # Utilities and types
│   └── services/        # API services (Firestore, operations)
├── docs/                # Documentation
├── emp/                 # Separate experimental project (not used)
└── public/              # Static assets
```

## 🧪 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

### AI Flow Guidelines

- All AI flows should be in `src/ai/flows/`
- Use Zod schemas for input/output validation
- Follow the Genkit flow pattern
- Add proper error handling
- Document expected behavior

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes: `npm run build`
4. Commit with descriptive messages
5. Push and create a pull request

### Commit Messages

Use clear, descriptive commit messages:

```
Fix: Resolve TypeScript error in operation service
Add: Implement new attack vector selector
Update: Improve error handling in AI flows
Docs: Update README with setup instructions
```

## 🧪 Testing

Currently, the project does not have a comprehensive test suite. When adding tests:

- Place unit tests next to the code they test
- Use Jest and React Testing Library
- Mock Firebase and external APIs
- Test both success and error cases

## 📝 Documentation

When adding new features:

- Update relevant documentation files
- Add JSDoc comments to functions
- Update PROJECT_STATUS.md if applicable
- Add usage examples where helpful

## 🐛 Bug Reports

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## 💡 Feature Requests

When requesting features:

- Describe the problem you're solving
- Explain your proposed solution
- Consider backward compatibility
- Link to related issues/discussions

## 🔒 Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow Firebase security best practices
- Report security issues privately

## 📞 Getting Help

- Check existing documentation
- Search existing issues
- Create a new issue with details
- Join project discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Questions?** Open an issue or contact the maintainers.
