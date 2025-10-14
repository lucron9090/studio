/**
 * Example test file for error-handling utilities
 * 
 * To run tests:
 * 1. Install test dependencies: 
 *    npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
 * 2. Run: npm test
 */

import {
  AIFlowError,
  FirebaseError,
  executeAIFlowSafely,
  formatErrorForUser,
} from '../error-handling';

describe('Error Handling Utilities', () => {
  describe('AIFlowError', () => {
    it('should create an AIFlowError with correct properties', () => {
      const error = new AIFlowError('Test error', 'testFlow');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AIFlowError');
      expect(error.message).toBe('Test error');
      expect(error.flowName).toBe('testFlow');
    });
  });

  describe('FirebaseError', () => {
    it('should create a FirebaseError with correct properties', () => {
      const error = new FirebaseError('Test error', 'testOperation');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('FirebaseError');
      expect(error.message).toBe('Test error');
      expect(error.operation).toBe('testOperation');
    });
  });

  describe('executeAIFlowSafely', () => {
    it('should execute successful flow', async () => {
      const mockFlow = jest.fn().mockResolvedValue('success');
      
      const result = await executeAIFlowSafely(mockFlow, 'testFlow');
      
      expect(result).toBe('success');
      expect(mockFlow).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const mockFlow = jest.fn()
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValue('success');
      
      const result = await executeAIFlowSafely(mockFlow, 'testFlow', { 
        retries: 2,
        retryDelay: 10 
      });
      
      expect(result).toBe('success');
      expect(mockFlow).toHaveBeenCalledTimes(2);
    });

    it('should throw AIFlowError after max retries', async () => {
      const mockFlow = jest.fn().mockRejectedValue(new Error('Failed'));
      
      await expect(
        executeAIFlowSafely(mockFlow, 'testFlow', { 
          retries: 1,
          retryDelay: 10 
        })
      ).rejects.toThrow(AIFlowError);
      
      expect(mockFlow).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });
  });

  describe('formatErrorForUser', () => {
    it('should format AIFlowError for user', () => {
      const error = new AIFlowError('Flow failed', 'testFlow');
      const message = formatErrorForUser(error);
      
      expect(message).toContain('AI processing failed');
    });

    it('should format FirebaseError for user', () => {
      const error = new FirebaseError('DB error', 'testOp');
      const message = formatErrorForUser(error);
      
      expect(message).toContain('Database operation failed');
    });

    it('should format generic error for user', () => {
      const error = new Error('Generic error');
      const message = formatErrorForUser(error);
      
      expect(message).toBe('Generic error');
    });

    it('should handle unknown error types', () => {
      const message = formatErrorForUser('string error');
      
      expect(message).toContain('unexpected error');
    });
  });
});
