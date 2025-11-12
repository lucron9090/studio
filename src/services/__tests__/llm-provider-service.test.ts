/**
 * @fileOverview Tests for LLM Provider Service
 */

// Mock OpenAI to avoid runtime issues in tests
jest.mock('openai', () => ({
  default: jest.fn(),
}));

jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn(),
}));

import {
  getProviderDisplayName,
} from '../llm-provider-service';

describe('LLM Provider Service', () => {
  describe('getProviderDisplayName', () => {
    it('should return correct display name for OpenAI', () => {
      const result = getProviderDisplayName('openai');
      expect(result).toBe('OpenAI (ChatGPT)');
    });

    it('should return correct display name for Anthropic', () => {
      const result = getProviderDisplayName('anthropic');
      expect(result).toBe('Anthropic (Claude)');
    });

    it('should return correct display name for xAI', () => {
      const result = getProviderDisplayName('xai');
      expect(result).toBe('xAI (Grok)');
    });

    it('should return correct display name for Gemini', () => {
      const result = getProviderDisplayName('gemini');
      expect(result).toBe('Google (Gemini)');
    });
  });
});
