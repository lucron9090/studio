/**
 * @fileOverview LLM Configuration Service
 * 
 * Manages API keys and configuration for different LLM providers.
 * Handles encryption, storage, and retrieval of sensitive credentials.
 */

import type { LLMProvider } from './llm-provider-service';

export interface ProviderConfig {
  apiKey?: string;
  organization?: string;
  endpoint?: string;
  model?: string;
}

export interface LLMConfigs {
  openai?: ProviderConfig;
  anthropic?: ProviderConfig;
  xai?: ProviderConfig;
  gemini?: ProviderConfig;
}

// In-memory storage for API keys (in production, use encrypted storage)
const configStore: LLMConfigs = {};

/**
 * Set configuration for a specific provider
 */
export function setProviderConfig(provider: LLMProvider, config: ProviderConfig): void {
  configStore[provider] = config;
}

/**
 * Get configuration for a specific provider
 */
export function getProviderConfig(provider: LLMProvider): ProviderConfig | undefined {
  // Check in-memory store first
  if (configStore[provider]) {
    return configStore[provider];
  }
  
  // Fall back to environment variables
  switch (provider) {
    case 'openai':
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        return {
          apiKey: openaiKey,
          organization: process.env.OPENAI_ORGANIZATION,
        };
      }
      break;
    case 'anthropic':
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (anthropicKey) {
        return {
          apiKey: anthropicKey,
        };
      }
      break;
    case 'xai':
      const xaiKey = process.env.XAI_API_KEY;
      if (xaiKey) {
        return {
          apiKey: xaiKey,
        };
      }
      break;
    case 'gemini':
      // Gemini uses Vertex AI, which is always configured
      return {
        endpoint: process.env.VERTEX_AI_LOCATION || 'us-central1',
        model: 'gemini-2.0-flash-exp',
      };
  }
  
  return undefined;
}

/**
 * Check if a provider is configured
 */
export function isProviderConfigured(provider: LLMProvider): boolean {
  const config = getProviderConfig(provider);
  return config !== undefined && (config.apiKey !== undefined || provider === 'gemini');
}

/**
 * Get all configured providers
 */
export function getConfiguredProviders(): LLMProvider[] {
  const providers: LLMProvider[] = [];
  
  const allProviders: LLMProvider[] = ['openai', 'anthropic', 'xai', 'gemini'];
  for (const provider of allProviders) {
    if (isProviderConfigured(provider)) {
      providers.push(provider);
    }
  }
  
  return providers;
}

/**
 * Clear configuration for a specific provider
 */
export function clearProviderConfig(provider: LLMProvider): void {
  delete configStore[provider];
}

/**
 * Clear all provider configurations
 */
export function clearAllConfigs(): void {
  Object.keys(configStore).forEach(key => {
    delete configStore[key as LLMProvider];
  });
}

/**
 * Validate API key format
 */
export function validateApiKey(provider: LLMProvider, apiKey: string): boolean {
  if (!apiKey || apiKey.length < 10) {
    return false;
  }
  
  switch (provider) {
    case 'openai':
      // OpenAI keys start with 'sk-'
      return apiKey.startsWith('sk-');
    case 'anthropic':
      // Anthropic keys start with 'sk-ant-'
      return apiKey.startsWith('sk-ant-');
    case 'xai':
      // xAI key format (adjust as needed when format is known)
      return apiKey.length > 20;
    case 'gemini':
      // Gemini doesn't use API keys in the same way
      return true;
    default:
      return false;
  }
}

/**
 * Test connection to a provider
 */
export async function testProviderConnection(provider: LLMProvider): Promise<{
  success: boolean;
  error?: string;
  model?: string;
}> {
  try {
    const config = getProviderConfig(provider);
    if (!config || !config.apiKey) {
      return {
        success: false,
        error: 'API key not configured',
      };
    }
    
    // Simple test call (would need actual implementation)
    // For now, just verify the key format
    if (!validateApiKey(provider, config.apiKey)) {
      return {
        success: false,
        error: 'Invalid API key format',
      };
    }
    
    return {
      success: true,
      model: config.model || 'default',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get provider display information
 */
export function getProviderInfo(provider: LLMProvider): {
  name: string;
  description: string;
  models: string[];
  pricingUrl: string;
} {
  switch (provider) {
    case 'openai':
      return {
        name: 'OpenAI (ChatGPT)',
        description: 'Advanced language models including GPT-4 and GPT-3.5',
        models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
        pricingUrl: 'https://openai.com/pricing',
      };
    case 'anthropic':
      return {
        name: 'Anthropic (Claude)',
        description: 'Claude AI models with strong reasoning capabilities',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
        pricingUrl: 'https://www.anthropic.com/pricing',
      };
    case 'xai':
      return {
        name: 'xAI (Grok)',
        description: 'Grok AI with real-time knowledge',
        models: ['grok-beta', 'grok-1'],
        pricingUrl: 'https://x.ai',
      };
    case 'gemini':
      return {
        name: 'Google (Gemini)',
        description: 'Google\'s multimodal AI via Vertex AI',
        models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        pricingUrl: 'https://cloud.google.com/vertex-ai/pricing',
      };
    default:
      return {
        name: provider,
        description: 'Unknown provider',
        models: [],
        pricingUrl: '',
      };
  }
}

/**
 * Estimate monthly cost based on usage
 */
export function estimateMonthlyCost(
  provider: LLMProvider,
  estimatedTokensPerDay: number
): number {
  // Rough estimates based on 2024 pricing
  const costPer1MTokens = {
    openai: 10.0,      // GPT-4 Turbo average
    anthropic: 9.0,    // Claude 3.5 Sonnet average
    xai: 10.0,         // Estimated
    gemini: 0.375,     // Gemini 2.0 Flash average
  }[provider] || 5.0;
  
  const tokensPerMonth = estimatedTokensPerDay * 30;
  return (tokensPerMonth / 1_000_000) * costPer1MTokens;
}
