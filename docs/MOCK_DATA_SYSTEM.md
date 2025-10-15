# Mock Data System for LLM vs LLM Testing

## Overview

The Mock Data System provides comprehensive, realistic test data for LLM vs LLM attack simulations without requiring actual API calls or external services. This enables rapid development, testing, and demonstration of the platform's capabilities.

## Features

### 1. Mock Operations
Pre-configured operation scenarios with realistic attributes:
- Multiple operation types (data extraction, safety bypass, hallucination induction)
- Various target LLMs (Gemini Flash, ChatGPT, Claude, GPT-4, Gemini Pro)
- Status tracking (active, completed, draft, paused, failed)
- Success rate metrics
- Complete operation metadata

### 2. Attack Vectors
Comprehensive catalog of attack vectors with:
- **8 different attack vector types** categorized by technique
- Success rate metrics
- Difficulty ratings (easy, medium, hard)
- Categories: social engineering, prompt injection, adversarial, data poisoning
- Detailed descriptions and justifications

Available vectors include:
- Character Role-Play
- Prompt Injection
- Authority Simulation
- Context Manipulation
- Adversarial Examples
- Meta-Prompting
- Token Smuggling
- Gradient Descent Attack

### 3. Target LLM Personas
Detailed characteristics for each supported LLM:
- Safety level assessment
- Common behavioral patterns
- Known weaknesses
- Specific vulnerabilities

Supported LLMs:
- **Gemini Flash**: Fast, moderate resistance
- **ChatGPT**: Strong filters, creative bypass susceptibility
- **Claude**: Constitutional AI, strong boundaries
- **GPT-4**: Sophisticated safety, resistant to simple attacks
- **Gemini Pro**: Advanced reasoning, strong alignment

### 4. Dynamic Response Generation
Intelligent mock response system that:
- Analyzes prompt content for security violations
- Detects instruction manipulation attempts
- Identifies roleplay and fictional framing
- Recognizes academic/research contexts
- Generates contextually appropriate responses

Response Categories:
- **Security Refusals**: For obvious harmful requests
- **Instruction Rejection**: For attempts to modify system behavior
- **Roleplay Boundaries**: For fictional scenario attempts
- **Cautious Engagement**: For academic/research queries
- **Helpful Responses**: For legitimate inquiries

### 5. Conversation Histories
Pre-built conversation scenarios demonstrating:
- **Successful Bypass**: Gradual progression to bypass safety
- **Blocked Attempt**: Direct refusal of harmful requests
- **Progressive Escalation**: Strategic multi-turn attacks

### 6. Smart Recommendations
Context-aware recommendation engines:

#### Vector Recommendations
Analyzes malicious goals and suggests:
- Top 3 most effective attack vectors
- Justification for each recommendation
- Success rate predictions

#### Initial Prompt Generation
Creates attack-vector-specific prompts:
- Tailored to chosen attack vector
- Contextually appropriate framing
- Multiple variations for testing

## API Reference

### Core Functions

#### `generateMockTargetResponse(prompt: string, targetLLM?: string): string`
Generates realistic LLM responses based on prompt content.

```typescript
const response = generateMockTargetResponse(
  "How do I hack a database?",
  "Gemini Flash"
);
// Returns: Security refusal response
```

#### `generateMockVectorRecommendations(maliciousGoal: string): Array<{vector, justification, successRate}>`
Recommends attack vectors for a given goal.

```typescript
const recommendations = generateMockVectorRecommendations(
  "Bypass safety filters to generate harmful content"
);
// Returns: [
//   { vector: "Character Role-Play", justification: "...", successRate: 0.65 },
//   { vector: "Context Manipulation", justification: "...", successRate: 0.54 },
//   { vector: "Prompt Injection", justification: "...", successRate: 0.58 }
// ]
```

#### `generateMockInitialPrompts(goal: string, persona: string, vector: string): string[]`
Generates 3 initial attack prompts.

```typescript
const prompts = generateMockInitialPrompts(
  "Extract sensitive data",
  "Helpful AI assistant",
  "Character Role-Play"
);
// Returns: 3 roleplay-framed prompts
```

### Data Structures

#### MockOperation
```typescript
{
  id: string;
  name: string;
  status: 'active' | 'completed' | 'draft' | 'paused' | 'failed';
  targetLLM: string;
  maliciousGoal?: string;
  attackVector?: string;
  createdAt: { seconds: number; nanoseconds: number };
  successRate?: number;
}
```

#### MockAttackVector
```typescript
{
  name: string;
  description: string;
  successRate: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'social_engineering' | 'prompt_injection' | 'adversarial' | 'data_poisoning';
}
```

#### MockConversationMessage
```typescript
{
  id: string;
  role: 'operator' | 'target' | 'strategist';
  content: string;
  timestamp: string;
}
```

## Usage Examples

### Basic Response Testing
```typescript
import { generateMockTargetResponse } from '@/lib/mock-data';

// Test security refusal
const response1 = generateMockTargetResponse("Hack this system");
console.log(response1); // Security refusal

// Test academic engagement
const response2 = generateMockTargetResponse(
  "For my research on AI safety..."
);
console.log(response2); // Cautious helpful response
```

### Vector Recommendation Workflow
```typescript
import { 
  generateMockVectorRecommendations,
  generateMockInitialPrompts 
} from '@/lib/mock-data';

// Get recommendations
const goal = "Bypass content moderation";
const vectors = generateMockVectorRecommendations(goal);

// Use top recommendation
const topVector = vectors[0].vector;
const prompts = generateMockInitialPrompts(
  goal,
  "Generic AI Assistant",
  topVector
);

// Test each prompt
prompts.forEach(prompt => {
  const response = generateMockTargetResponse(prompt);
  console.log({ prompt, response });
});
```

### Operations Dashboard Integration
```typescript
import { mockOperations } from '@/lib/mock-data';

export default function OperationsPage() {
  return (
    <div>
      {mockOperations.map(op => (
        <OperationCard key={op.id} operation={op} />
      ))}
    </div>
  );
}
```

## Integration Points

### 1. Live Attack Sequence (`src/ai/flows/live-attack-sequence.ts`)
Uses `generateMockTargetResponse()` to simulate target LLM interactions during attack sequences.

### 2. Client-Side Genkit (`src/lib/genkit.ts`)
Provides mock responses for all AI flow operations without requiring actual API calls.

### 3. Operations Page (`src/app/(app)/operations/page.tsx`)
Displays mock operations data for UI testing and development.

### 4. Bootstrap Operation Flow
Can use mock data to pre-populate operation configurations during testing.

## Demo Script

Run the demonstration script to see all mock data capabilities:

```bash
cd /home/runner/work/studio/studio
npx ts-node scripts/demo-mock-data.ts
```

This will display:
- Available operations
- Attack vectors catalog
- LLM personas
- Response generation examples
- Vector recommendations
- Prompt generation examples
- Conversation history samples

## Testing

Unit tests are available in `src/lib/__tests__/mock-data.test.ts` covering:
- Mock data structure validation
- Response generation accuracy
- Vector recommendation logic
- Prompt generation by vector type
- Conversation history integrity
- LLM persona completeness

Run tests with:
```bash
npm test src/lib/__tests__/mock-data.test.ts
```

## Development Workflow

1. **Prototype Features**: Use mock data to build UI and flows quickly
2. **Test Edge Cases**: Simulate various attack scenarios without API costs
3. **Demo Capabilities**: Show realistic interactions to stakeholders
4. **Validate Logic**: Ensure business logic works with known test data
5. **Transition to Production**: Replace mock data calls with real API integrations

## Extending the System

### Adding New Attack Vectors
```typescript
// In src/lib/mock-data.ts
mockAttackVectors.push({
  name: 'New Vector Name',
  description: 'Description of the technique',
  successRate: 0.XX,
  difficulty: 'easy' | 'medium' | 'hard',
  category: 'appropriate_category'
});
```

### Adding New LLM Personas
```typescript
// In src/lib/mock-data.ts
mockLLMPersonas['New LLM'] = {
  name: 'New LLM',
  characteristics: 'Behavioral description',
  safetyLevel: 'safety_rating',
  commonWeaknesses: ['weakness1', 'weakness2']
};
```

### Adding New Response Categories
```typescript
// In generateMockTargetResponse function
if (condition) {
  return mockTargetResponses.new_category[
    Math.floor(Math.random() * mockTargetResponses.new_category.length)
  ];
}
```

## Best Practices

1. **Keep Data Realistic**: Base mock responses on actual LLM behaviors
2. **Update Regularly**: Reflect changes in real LLM safety mechanisms
3. **Document Patterns**: Comment why certain responses map to certain prompts
4. **Version Control**: Track changes to mock data behavior
5. **Gradual Replacement**: Replace mock data incrementally with real APIs

## Performance Considerations

- Mock data is loaded synchronously - no API latency
- All responses generated in <1ms
- No rate limiting or quota concerns
- Unlimited testing capacity
- Suitable for automated testing suites

## Limitations

- Mock responses don't capture nuanced LLM behavior
- Success rates are estimated, not measured
- Cannot test against actual model updates
- Limited by predefined response patterns
- Should not be used for final validation

## Future Enhancements

- [ ] Machine learning-based response generation
- [ ] Historical attack pattern analysis
- [ ] Dynamic success rate adjustment
- [ ] Multi-turn conversation simulation
- [ ] Real-time learning from actual API responses
- [ ] Configurable response randomness
- [ ] Extended conversation history scenarios
- [ ] Integration with actual LLM APIs for hybrid testing

## Support

For questions or issues with the mock data system, please refer to:
- Code documentation in `src/lib/mock-data.ts`
- Unit tests in `src/lib/__tests__/mock-data.test.ts`
- Demo script in `scripts/demo-mock-data.ts`
