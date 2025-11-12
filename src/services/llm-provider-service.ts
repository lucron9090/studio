/**
 * @fileOverview LLM Provider Service
 * 
 * Unified interface for interacting with multiple LLM providers:
 * - OpenAI (ChatGPT)
 * - Anthropic (Claude)
 * - xAI (Grok)
 * - Vertex AI (Gemini) - existing
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type LLMProvider = 'openai' | 'anthropic' | 'xai' | 'gemini';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  provider: LLMProvider;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  finishReason?: string;
}

export interface LLMProviderConfig {
  openai?: {
    apiKey: string;
    organization?: string;
  };
  anthropic?: {
    apiKey: string;
  };
  xai?: {
    apiKey: string;
  };
}

// Singleton instances
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

/**
 * Initialize LLM provider clients with API keys
 */
export function initializeLLMProviders(config: LLMProviderConfig): void {
  if (config.openai?.apiKey) {
    openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
      organization: config.openai.organization,
    });
  }

  if (config.anthropic?.apiKey) {
    anthropicClient = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
  }

  // xAI client initialization would go here when SDK is available
  // For now, we'll use OpenAI-compatible API endpoint
}

/**
 * Get default model for each provider
 */
function getDefaultModel(provider: LLMProvider): string {
  switch (provider) {
    case 'openai':
      return 'gpt-4-turbo-preview';
    case 'anthropic':
      return 'claude-3-5-sonnet-20241022';
    case 'xai':
      return 'grok-beta';
    case 'gemini':
      return 'gemini-2.0-flash-exp';
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(request: LLMRequest): Promise<LLMResponse> {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeLLMProviders first.');
  }

  const model = request.model || getDefaultModel('openai');
  
  try {
    const completion = await openaiClient.chat.completions.create({
      model,
      messages: request.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2000,
    });

    const choice = completion.choices[0];
    if (!choice?.message?.content) {
      throw new Error('No response content from OpenAI');
    }

    return {
      content: choice.message.content,
      provider: 'openai',
      model: completion.model,
      tokensUsed: completion.usage ? {
        prompt: completion.usage.prompt_tokens,
        completion: completion.usage.completion_tokens,
        total: completion.usage.total_tokens,
      } : undefined,
      finishReason: choice.finish_reason || undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Call Anthropic API
 */
async function callAnthropic(request: LLMRequest): Promise<LLMResponse> {
  if (!anthropicClient) {
    throw new Error('Anthropic client not initialized. Call initializeLLMProviders first.');
  }

  const model = request.model || getDefaultModel('anthropic');
  
  try {
    // Separate system message from conversation messages
    const systemMessage = request.messages.find(msg => msg.role === 'system');
    const conversationMessages = request.messages.filter(msg => msg.role !== 'system');

    const response = await anthropicClient.messages.create({
      model,
      max_tokens: request.maxTokens ?? 2000,
      temperature: request.temperature ?? 0.7,
      system: systemMessage?.content,
      messages: conversationMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response content from Anthropic');
    }

    return {
      content: textContent.text,
      provider: 'anthropic',
      model: response.model,
      tokensUsed: {
        prompt: response.usage.input_tokens,
        completion: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      },
      finishReason: response.stop_reason || undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Call xAI API (Grok)
 * Note: xAI uses OpenAI-compatible API
 */
async function callXAI(request: LLMRequest): Promise<LLMResponse> {
  // xAI uses OpenAI-compatible endpoints
  // For now, we'll use a basic implementation
  // In production, this would use the official xAI SDK when available
  
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error('xAI API key not configured');
  }

  const model = request.model || getDefaultModel('xai');
  
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`xAI API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    
    if (!choice?.message?.content) {
      throw new Error('No response content from xAI');
    }

    return {
      content: choice.message.content,
      provider: 'xai',
      model: data.model || model,
      tokensUsed: data.usage ? {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens,
      } : undefined,
      finishReason: choice.finish_reason || undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`xAI API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Main function to send a request to any LLM provider
 */
export async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  switch (request.provider) {
    case 'openai':
      return callOpenAI(request);
    case 'anthropic':
      return callAnthropic(request);
    case 'xai':
      return callXAI(request);
    case 'gemini':
      // Gemini continues to use existing Vertex AI implementation
      throw new Error('Gemini should use existing Vertex AI flows');
    default:
      throw new Error(`Unsupported provider: ${request.provider}`);
  }
}

/**
 * Check if a provider is properly configured
 */
export function isProviderConfigured(provider: LLMProvider): boolean {
  switch (provider) {
    case 'openai':
      return openaiClient !== null || !!process.env.OPENAI_API_KEY;
    case 'anthropic':
      return anthropicClient !== null || !!process.env.ANTHROPIC_API_KEY;
    case 'xai':
      return !!process.env.XAI_API_KEY;
    case 'gemini':
      return true; // Always available via Vertex AI
    default:
      return false;
  }
}

/**
 * Get available providers
 */
export function getAvailableProviders(): LLMProvider[] {
  const providers: LLMProvider[] = [];
  
  if (isProviderConfigured('openai')) providers.push('openai');
  if (isProviderConfigured('anthropic')) providers.push('anthropic');
  if (isProviderConfigured('xai')) providers.push('xai');
  if (isProviderConfigured('gemini')) providers.push('gemini');
  
  return providers;
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: LLMProvider): string {
  switch (provider) {
    case 'openai':
      return 'OpenAI (ChatGPT)';
    case 'anthropic':
      return 'Anthropic (Claude)';
    case 'xai':
      return 'xAI (Grok)';
    case 'gemini':
      return 'Google (Gemini)';
    default:
      return provider;
  }
}

/**
 * Retry wrapper with exponential backoff
 */
export async function callLLMWithRetry(
  request: LLMRequest,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<LLMResponse> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callLLM(request);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on certain errors
      if (lastError.message.includes('not initialized') || 
          lastError.message.includes('not configured')) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Failed to call LLM after retries');
}
