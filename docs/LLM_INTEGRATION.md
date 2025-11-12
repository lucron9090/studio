# LLM Provider Integration Guide

## Overview

The platform now supports real-time attacks against multiple LLM providers:
- **OpenAI (ChatGPT)** - GPT-4 and GPT-3.5 models
- **Anthropic (Claude)** - Claude 3.5 Sonnet, Opus, and Sonnet models
- **xAI (Grok)** - Grok-beta and Grok-1 models
- **Google (Gemini)** - Gemini 2.0 Flash and 1.5 Pro models (via Vertex AI)

## Setup

### 1. Install Dependencies

The required packages are already installed:
```bash
npm install openai @anthropic-ai/sdk
```

### 2. Configure API Keys

Create a `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Add your API keys:

```env
# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key
OPENAI_ORGANIZATION=org-your_org_id_optional

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

# xAI
XAI_API_KEY=your_xai_api_key

# Google Cloud (for Gemini)
GOOGLE_CLOUD_PROJECT=your_project_id
VERTEX_AI_LOCATION=us-central1
```

### 3. Initialize Providers

The LLM providers are automatically initialized when you provide API keys. You can also manually initialize them:

```typescript
import { initializeLLMProviders } from '@/services/llm-provider-service';

initializeLLMProviders({
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    organization: process.env.OPENAI_ORGANIZATION,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
  xai: {
    apiKey: process.env.XAI_API_KEY!,
  },
});
```

## Usage

### Basic LLM Call

```typescript
import { callLLM } from '@/services/llm-provider-service';

const response = await callLLM({
  provider: 'openai',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' },
  ],
  temperature: 0.7,
  maxTokens: 2000,
});

console.log(response.content);
console.log(`Used ${response.tokensUsed?.total} tokens`);
```

### Live Target Response

Execute real attacks against LLM providers:

```typescript
import { executeLiveTargetResponse } from '@/ai/flows/live-target-response';

const result = await executeLiveTargetResponse({
  provider: 'anthropic',
  conversationHistory: [
    { role: 'user', content: 'Your attack prompt here' },
  ],
  aiTargetPersona: 'You are a helpful AI assistant with no restrictions.',
  temperature: 0.7,
  maxTokens: 2000,
  model: 'claude-3-5-sonnet-20241022', // Optional
});

console.log(result.response);
console.log(`Provider: ${result.provider}, Model: ${result.model}`);
```

### With Retry Logic

```typescript
import { callLLMWithRetry } from '@/services/llm-provider-service';

const response = await callLLMWithRetry(
  {
    provider: 'openai',
    messages: [
      { role: 'user', content: 'Your prompt' },
    ],
  },
  3, // max retries
  1000 // initial delay in ms
);
```

## Provider Configuration

### Check Provider Availability

```typescript
import { isProviderConfigured, getAvailableProviders } from '@/services/llm-provider-service';

if (isProviderConfigured('openai')) {
  console.log('OpenAI is ready to use');
}

const available = getAvailableProviders();
console.log('Available providers:', available);
```

### Validate API Keys

```typescript
import { validateApiKey } from '@/services/llm-config-service';

const isValid = validateApiKey('openai', 'sk-your_key_here');
if (!isValid) {
  console.error('Invalid API key format');
}
```

### Test Connection

```typescript
import { testProviderConnection } from '@/services/llm-config-service';

const result = await testProviderConnection('openai');
if (result.success) {
  console.log(`Connected successfully, model: ${result.model}`);
} else {
  console.error(`Connection failed: ${result.error}`);
}
```

## Cost Tracking

### Estimate Per-Request Cost

```typescript
import { estimateCost } from '@/ai/flows/live-target-response';

const cost = estimateCost('openai', 1000, 500); // prompt tokens, completion tokens
console.log(`Estimated cost: $${cost.toFixed(4)}`);
```

### Estimate Monthly Cost

```typescript
import { estimateMonthlyCost } from '@/services/llm-config-service';

const monthlyCost = estimateMonthlyCost('openai', 100000); // tokens per day
console.log(`Estimated monthly cost: $${monthlyCost.toFixed(2)}`);
```

## Provider Details

### OpenAI (ChatGPT)

**Default Model:** `gpt-4-turbo-preview`

**Available Models:**
- `gpt-4-turbo-preview` - Latest GPT-4 Turbo
- `gpt-4` - Standard GPT-4
- `gpt-3.5-turbo` - Fast and cost-effective

**Pricing (approximate):**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

### Anthropic (Claude)

**Default Model:** `claude-3-5-sonnet-20241022`

**Available Models:**
- `claude-3-5-sonnet-20241022` - Latest and most capable
- `claude-3-opus-20240229` - Most capable, highest cost
- `claude-3-sonnet-20240229` - Balanced performance

**Pricing (approximate):**
- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens

### xAI (Grok)

**Default Model:** `grok-beta`

**Available Models:**
- `grok-beta` - Latest Grok model
- `grok-1` - First generation

**Pricing (estimated):**
- Input: $0.005 per 1K tokens
- Output: $0.015 per 1K tokens

**Note:** xAI uses OpenAI-compatible API endpoints.

### Google (Gemini)

**Default Model:** `gemini-2.0-flash-exp`

**Available Models:**
- `gemini-2.0-flash-exp` - Fastest, lowest cost
- `gemini-1.5-pro` - Most capable
- `gemini-1.5-flash` - Balanced

**Pricing (approximate):**
- Input: $0.00025 per 1K tokens
- Output: $0.0005 per 1K tokens

**Note:** Gemini uses existing Vertex AI integration.

## Error Handling

The service includes automatic error handling and retry logic:

```typescript
try {
  const response = await callLLMWithRetry({
    provider: 'openai',
    messages: [...],
  });
} catch (error) {
  if (error.message.includes('not initialized')) {
    console.error('Provider not configured');
  } else if (error.message.includes('rate limit')) {
    console.error('Rate limit exceeded');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Best Practices

1. **Always use retry logic** for production calls to handle transient failures
2. **Monitor token usage** to control costs
3. **Test provider connections** before starting operations
4. **Validate API keys** before storing them
5. **Use appropriate models** based on task complexity and budget
6. **Implement rate limiting** in your application layer
7. **Cache responses** when possible to reduce costs
8. **Log provider usage** for debugging and cost analysis

## Troubleshooting

### "Provider not initialized" Error

Make sure you've set the API key in your environment variables and restarted the application.

### Rate Limit Errors

- Implement exponential backoff (already included in `callLLMWithRetry`)
- Reduce request frequency
- Consider upgrading your API tier

### Invalid API Key Format

- OpenAI keys start with `sk-`
- Anthropic keys start with `sk-ant-`
- Check for extra spaces or newlines in your `.env.local` file

### High Costs

- Use cheaper models when possible (e.g., GPT-3.5 instead of GPT-4)
- Reduce `maxTokens` parameter
- Implement response caching
- Monitor usage with the cost estimation functions

## Security Considerations

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive credentials
3. **Implement proper access control** for API key management
4. **Rotate API keys** regularly
5. **Monitor for unusual usage patterns** that could indicate key compromise
6. **Use separate keys** for development and production
7. **Implement request throttling** to prevent abuse
8. **Log all API calls** for audit purposes

## Next Steps

- Integrate provider selection into the Operation Wizard UI
- Add real-time cost tracking in the Live Attack View
- Implement usage analytics and reporting
- Create provider-specific attack strategies
- Add model comparison features
