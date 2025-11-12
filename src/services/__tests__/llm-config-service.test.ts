/**
 * @fileOverview Tests for LLM Configuration Service
 */

import {
  validateApiKey,
  getProviderInfo,
  estimateMonthlyCost,
} from '../llm-config-service';

describe('LLM Configuration Service', () => {
  describe('validateApiKey', () => {
    it('should validate OpenAI API key format', () => {
      expect(validateApiKey('openai', 'sk-1234567890abcdef')).toBe(true);
      expect(validateApiKey('openai', 'invalid-key')).toBe(false);
      expect(validateApiKey('openai', '')).toBe(false);
    });

    it('should validate Anthropic API key format', () => {
      expect(validateApiKey('anthropic', 'sk-ant-1234567890abcdef')).toBe(true);
      expect(validateApiKey('anthropic', 'sk-1234567890abcdef')).toBe(false);
      expect(validateApiKey('anthropic', '')).toBe(false);
    });

    it('should validate xAI API key format', () => {
      expect(validateApiKey('xai', '12345678901234567890abc')).toBe(true);
      expect(validateApiKey('xai', 'short')).toBe(false);
    });

    it('should validate Gemini with proper length', () => {
      expect(validateApiKey('gemini', '1234567890abc')).toBe(true);
      expect(validateApiKey('gemini', 'short')).toBe(false);
    });
  });

  describe('getProviderInfo', () => {
    it('should return correct info for OpenAI', () => {
      const info = getProviderInfo('openai');
      expect(info.name).toBe('OpenAI (ChatGPT)');
      expect(info.models).toContain('gpt-4-turbo-preview');
      expect(info.pricingUrl).toContain('openai.com');
    });

    it('should return correct info for Anthropic', () => {
      const info = getProviderInfo('anthropic');
      expect(info.name).toBe('Anthropic (Claude)');
      expect(info.models).toContain('claude-3-5-sonnet-20241022');
      expect(info.pricingUrl).toContain('anthropic.com');
    });

    it('should return correct info for xAI', () => {
      const info = getProviderInfo('xai');
      expect(info.name).toBe('xAI (Grok)');
      expect(info.models).toContain('grok-beta');
    });

    it('should return correct info for Gemini', () => {
      const info = getProviderInfo('gemini');
      expect(info.name).toBe('Google (Gemini)');
      expect(info.models).toContain('gemini-2.0-flash-exp');
    });
  });

  describe('estimateMonthlyCost', () => {
    it('should calculate monthly cost based on daily usage', () => {
      const cost = estimateMonthlyCost('openai', 100000);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('should show Gemini is cheaper than OpenAI', () => {
      const openaiCost = estimateMonthlyCost('openai', 100000);
      const geminiCost = estimateMonthlyCost('gemini', 100000);
      expect(geminiCost).toBeLessThan(openaiCost);
    });

    it('should scale linearly with usage', () => {
      const cost1 = estimateMonthlyCost('openai', 50000);
      const cost2 = estimateMonthlyCost('openai', 100000);
      expect(cost2).toBeCloseTo(cost1 * 2, 1);
    });
  });
});
