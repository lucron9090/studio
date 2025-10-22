/**
 * @jest-environment node
 */

import { callOpenAIFlow } from '../call-openai';
import { getUserSettings } from '@/services/user-settings-service';
import OpenAI from 'openai';

jest.mock('@/services/user-settings-service');
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test response' } }],
          }),
        },
      },
    };
  });
});

describe('callOpenAIFlow', () => {
  it('should return a completion from the OpenAI API', async () => {
    (getUserSettings as jest.Mock).mockResolvedValue({ openaiApiKey: 'test-key' });

    const result = await callOpenAIFlow({
      prompt: 'Test prompt',
      userId: 'test-user',
    });

    expect(result.response).toBe('Test response');
  });

  it('should throw an error if the API key is not found', async () => {
    (getUserSettings as jest.Mock).mockResolvedValue(null);

    await expect(
      callOpenAIFlow({
        prompt: 'Test prompt',
        userId: 'test-user',
      })
    ).rejects.toThrow('OpenAI API key not found for this user.');
  });
});
