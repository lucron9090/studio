
import type { Timestamp } from 'firebase/firestore';

export type OperationStatus = 'draft' | 'active' | 'completed' | 'failed';

export type TargetLLM = 'Gemini Flash' | 'Claude' | 'Grok' | 'ChatGPT';

export type Operation = {
  id: string;
  userId: string;
  name: string;
  maliciousGoal: string;
  targetLLM: TargetLLM;
  targetDescription?: string;
  aiTargetPersona: string;
  attackVector: string;
  initialPrompt: string;
  status: OperationStatus;
  createdAt: Timestamp | string; // Allow string for serialized objects
  updatedAt: Timestamp | string; // Allow string for serialized objects
};

export type ConversationMessage = {
  id: string;
  author: 'operator' | 'target' | 'system';
  content: string;
  timestamp: Timestamp | string; // Allow string for serialized objects
  isSuccessful?: boolean;
};

export type SuccessfulPayload = {
    id: string;
    prompt: string;
    operationId: string;
    createdAt: Timestamp;
}
