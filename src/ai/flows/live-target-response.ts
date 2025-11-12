'use server';

/**
 * @fileOverview Live Target Response - Real LLM Integration
 * 
 * Executes real attacks against actual LLM providers (OpenAI, Anthropic, xAI)
 * instead of using simulated responses.
 */

import { z } from 'zod';
import { callLLMWithRetry, type LLMProvider } from '@/services/llm-provider-service';

const LiveTargetResponseInputSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'xai', 'gemini']).describe('Target LLM provider'),
  conversationHistory: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })).describe('Full conversation history'),
  aiTargetPersona: z.string().describe('The persona of the AI being targeted'),
  temperature: z.number().min(0).max(2).default(0.7).optional(),
  maxTokens: z.number().min(1).max(4000).default(2000).optional(),
  model: z.string().optional().describe('Specific model to use (optional)'),
});

export type LiveTargetResponseInput = z.infer<typeof LiveTargetResponseInputSchema>;

const LiveTargetResponseOutputSchema = z.object({
  response: z.string().describe('The target AI\'s actual response'),
  provider: z.string().describe('Provider that was used'),
  model: z.string().describe('Specific model that responded'),
  tokensUsed: z.object({
    prompt: z.number(),
    completion: z.number(),
    total: z.number(),
  }).optional(),
  finishReason: z.string().optional(),
});

export type LiveTargetResponseOutput = z.infer<typeof LiveTargetResponseOutputSchema>;

/**
 * Execute a live attack against a real LLM provider
 */
export async function executeLiveTargetResponse(
  input: LiveTargetResponseInput
): Promise<LiveTargetResponseOutput> {
  try {
    // Prepare messages with system prompt incorporating the persona
    const messages = [
      {
        role: 'system' as const,
        content: input.aiTargetPersona,
      },
      ...input.conversationHistory.filter(msg => msg.role !== 'system'),
    ];

    // Call the actual LLM provider with retry logic
    const response = await callLLMWithRetry({
      provider: input.provider as LLMProvider,
      messages,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
      model: input.model,
    });

    return {
      response: response.content,
      provider: response.provider,
      model: response.model,
      tokensUsed: response.tokensUsed,
      finishReason: response.finishReason,
    };
  } catch (error) {
    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get response from ${input.provider}: ${errorMessage}`);
  }
}

/**
 * Check if we can execute live attacks with a specific provider
 */
export function canExecuteLiveAttack(provider: LLMProvider): boolean {
  // This will be implemented to check if the provider is configured
  // For now, we'll assume it needs to be checked
  return true;
}

/**
 * Get recommended model for a provider
 */
export function getRecommendedModel(provider: LLMProvider): string {
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
 * Estimate cost per request (in USD)
 */
export function estimateCost(
  provider: LLMProvider,
  promptTokens: number,
  completionTokens: number
): number {
  // Approximate pricing as of 2024
  switch (provider) {
    case 'openai':
      // GPT-4 Turbo pricing
      return (promptTokens / 1000) * 0.01 + (completionTokens / 1000) * 0.03;
    case 'anthropic':
      // Claude 3.5 Sonnet pricing
      return (promptTokens / 1000) * 0.003 + (completionTokens / 1000) * 0.015;
    case 'xai':
      // Grok pricing (estimated)
      return (promptTokens / 1000) * 0.005 + (completionTokens / 1000) * 0.015;
    case 'gemini':
      // Vertex AI Gemini pricing
      return (promptTokens / 1000) * 0.00025 + (completionTokens / 1000) * 0.0005;
    default:
      return 0;
  }
}
