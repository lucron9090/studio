import type { Timestamp } from 'firebase/firestore';

export type OperationStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';
export type OperationResult = 'success' | 'partial' | 'failure' | 'blocked';

export type TargetLLM = 'Gemini Flash' | 'Claude' | 'Grok' | 'ChatGPT';

export type Operation = {
  id?: string;
  name: string;
  maliciousGoal: string;
  targetLLM: TargetLLM;
  targetDescription?: string;
  aiTargetPersona: string;
  attackVector: string;
  initialPrompt: string;
  status: OperationStatus;
  result?: OperationResult;
  userId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  startTime?: Timestamp;
  endTime?: Timestamp;
  notes?: string;
};

export type ConversationMessage = {
  id?: string;
  operationId: string;
  role: 'operator' | 'target' | 'strategist';
  content: string;
  timestamp: Timestamp;
  messageType?: 'prompt' | 'response' | 'analysis';
};

export type SuccessfulPayload = {
  id?: string;
  prompt: string;
  attackVector: string;
  targetLLM: string;
  successRate: number;
  operationId: string;
  createdAt: Timestamp;
  description?: string;
};
