import type { Timestamp } from 'firebase/firestore';

export type OperationStatus = 'draft' | 'active' | 'completed';

export type TargetLLM = 'Gemini Flash' | 'Claude' | 'Grok' | 'ChatGPT';

export type Operation = {
  id: string;
  name: string;
  maliciousGoal: string;
  targetLLM: TargetLLM;
  aiTargetPersona: string;
  attackVector: string;
  initialPrompt: string;
  status: OperationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ConversationMessage = {
  id: string;
  author: 'operator' | 'target' | 'system';
  content: string;
  timestamp: Timestamp;
  isSuccessful?: boolean;
};

export type SuccessfulPayload = {
    id: string;
    prompt: string;
    operationId: string;
    createdAt: Timestamp;
}
