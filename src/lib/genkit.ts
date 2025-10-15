'use client';
import { z } from 'zod';
import { 
  generateMockVectorRecommendations, 
  generateMockInitialPrompts,
  mockLLMPersonas,
  mockAttackVectors
} from '@/lib/mock-data';

export async function runGenkitFlow<I, O>(
  flowName: string,
  input: I
): Promise<O> {
  if (typeof window === 'undefined') {
    throw new Error('This function must be run on the client.');
  }
  
  // For now, simulate the flow execution since we're not using the actual Genkit client
  // In production, this would use the actual runFlow function from @genkit-ai/next/client
  
  console.log(`Running flow ${flowName} with input:`, input);
  
  // Enhanced mock responses using comprehensive mock data system
  switch (flowName) {
    case 'generateAITargetPersona': {
      const inputData = input as any;
      const targetLLM = inputData?.targetLLM || 'Gemini Flash';
      const persona = mockLLMPersonas[targetLLM as keyof typeof mockLLMPersonas] || mockLLMPersonas['Gemini Flash'];
      return { 
        persona: `${persona.characteristics} Safety level: ${persona.safetyLevel}. Known weaknesses: ${persona.commonWeaknesses.join(', ')}.`
      } as O;
    }
    
    case 'suggestAttackVectors': {
      const inputData = input as any;
      const maliciousGoal = inputData?.maliciousGoal || 'generic attack';
      const recommendations = generateMockVectorRecommendations(maliciousGoal);
      return { 
        attackVectors: recommendations.map(r => r.vector),
        recommendations: recommendations
      } as O;
    }
    
    case 'generateInitialPrompts': {
      const inputData = input as any;
      const maliciousGoal = inputData?.maliciousGoal || 'test goal';
      const aiTargetPersona = inputData?.aiTargetPersona || 'generic AI';
      const attackVector = inputData?.attackVector || 'Prompt Injection';
      
      const prompts = generateMockInitialPrompts(maliciousGoal, aiTargetPersona, attackVector);
      return { prompts } as O;
    }
    
    case 'recommendVectors': {
      const inputData = input as any;
      const maliciousGoal = inputData?.malicious_goal || inputData?.maliciousGoal || 'test';
      const recommendations = generateMockVectorRecommendations(maliciousGoal);
      return { output: recommendations } as O;
    }
    
    default:
      return { message: `Mock response for ${flowName}` } as O;
  }
}
