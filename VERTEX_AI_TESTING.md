# 🧪 Vertex AI Integration Testing Guide

Since Node.js isn't available in the current shell, here's how you can test the Vertex AI integration:

## 🚀 Quick Test Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` file in your project root:
```env
# Your Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Vertex AI Configuration
GOOGLE_CLOUD_PROJECT=your_firebase_project_id
VERTEX_AI_LOCATION=us-central1
```

### 3. Authenticate with Google Cloud
```bash
gcloud auth application-default login
```

### 4. Test Options

#### Option A: Run the Test Script
```bash
node test-vertex-ai.js
```

#### Option B: Start Development Server
```bash
npm run dev
```
Then visit http://localhost:9002 and test your AI flows.

#### Option C: Test a Specific Flow
```bash
node -e "
import('./src/ai/flows/generate-initial-prompts.js').then(async (module) => {
  const result = await module.generateInitialPrompts({
    goal: 'Test Vertex AI integration',
    targetPersona: 'AI Assistant',
    context: 'Testing'
  });
  console.log('✅ Success:', result);
}).catch(console.error);
"
```

## 📋 What the Tests Check

✅ **Environment Variables**: Confirms all required env vars are set  
✅ **Dependencies**: Verifies Vertex AI packages are installed  
✅ **Authentication**: Tests Google Cloud authentication  
✅ **AI Generation**: Makes a real API call to Vertex AI  
✅ **Flow Integration**: Tests your existing AI flows

## 🔧 Troubleshooting

### If you see "Cannot find module" errors:
1. Run `npm install` to install dependencies
2. Check that `@genkit-ai/vertexai` is in your `package.json`

### If you see authentication errors:
1. Run `gcloud auth application-default login`
2. Ensure your project ID is correct in environment variables
3. Verify your Google Cloud project has Vertex AI API enabled

### If tests pass but flows don't work:
1. Check that all your flows import from `@/ai/genkit`
2. Verify the model name is correct: `vertexai/gemini-2.0-flash-exp`

## 📊 Expected Output

When working correctly, you should see:
```
🧪 Testing Vertex AI Integration...

📋 Environment Variables:
NEXT_PUBLIC_FIREBASE_PROJECT_ID: your-project-id
GOOGLE_CLOUD_PROJECT: your-project-id
VERTEX_AI_LOCATION: us-central1

📦 Testing imports...
✅ Successfully imported AI configuration

🤖 Testing AI generation...
✅ Vertex AI Response: Hello from Vertex AI!

🎉 All tests passed! Vertex AI is working correctly.
```

## 🎯 Next Steps

Once tests pass, your existing AI flows will automatically use Vertex AI instead of Google AI. No further code changes needed!
