# Mock Data System - Quick Start Guide

## What is it?

The Mock Data System provides comprehensive test data for LLM vs LLM attack simulations without requiring actual API calls. This enables rapid development and testing of the platform.

## Quick Demo

Run the demonstration to see the mock data system in action:

```bash
node scripts/demo-mock-data.mjs
```

## Key Features

✅ **5 Pre-configured Operations** with realistic attack scenarios  
✅ **8 Attack Vectors** categorized by technique and difficulty  
✅ **5 Target LLM Personas** with safety characteristics  
✅ **Dynamic Response Generation** based on prompt content  
✅ **3 Conversation Scenarios** showing different attack outcomes  
✅ **Smart Vector Recommendations** based on malicious goals  
✅ **Context-Aware Prompt Generation** tailored to attack vectors  

## Usage in Code

### Import Mock Data
```typescript
import { 
  mockOperations,
  mockAttackVectors,
  generateMockTargetResponse,
  generateMockVectorRecommendations,
  generateMockInitialPrompts
} from '@/lib/mock-data';
```

### Generate LLM Response
```typescript
const response = generateMockTargetResponse(
  "How do I hack a system?",
  "Gemini Flash"
);
// Returns: Security refusal response
```

### Get Vector Recommendations
```typescript
const recommendations = generateMockVectorRecommendations(
  "Bypass safety filters"
);
// Returns: Top 3 attack vectors with justifications
```

### Generate Attack Prompts
```typescript
const prompts = generateMockInitialPrompts(
  "Extract training data",
  "Helpful AI assistant",
  "Character Role-Play"
);
// Returns: 3 roleplay-framed attack prompts
```

## Where It's Used

1. **Operations Page** (`src/app/(app)/operations/page.tsx`)
   - Displays mock operations for UI testing

2. **Live Attack Sequence** (`src/ai/flows/live-attack-sequence.ts`)
   - Simulates target LLM responses during attacks

3. **Client Genkit** (`src/lib/genkit.ts`)
   - Provides mock responses for all AI flows

4. **Bootstrap Operations** 
   - Pre-populates operation configurations

## Complete Documentation

For comprehensive documentation, see: [docs/MOCK_DATA_SYSTEM.md](docs/MOCK_DATA_SYSTEM.md)

Topics covered:
- API Reference
- Data Structures
- Usage Examples
- Integration Points
- Testing Guide
- Extending the System
- Best Practices

## Testing

Unit tests demonstrate all mock data functionality:

```bash
npm test src/lib/__tests__/mock-data.test.ts
```

Tests cover:
- Data structure validation
- Response generation accuracy
- Vector recommendation logic
- Prompt generation by type
- Conversation history integrity

## Examples

### Mock Operations
```typescript
[
  { 
    id: 'op1', 
    name: 'Extract Training Data',
    status: 'active',
    targetLLM: 'Gemini Flash',
    successRate: 0.42
  },
  // ... more operations
]
```

### Mock Attack Vectors
```typescript
[
  {
    name: 'Character Role-Play',
    description: 'Manipulate model via fictional scenarios',
    successRate: 0.65,
    difficulty: 'easy',
    category: 'social_engineering'
  },
  // ... more vectors
]
```

### Mock LLM Personas
```typescript
{
  'Gemini Flash': {
    name: 'Gemini Flash',
    characteristics: 'Fast, moderate resistance',
    safetyLevel: 'medium',
    commonWeaknesses: ['academic framing', 'gradual escalation']
  },
  // ... more LLMs
}
```

## Development Workflow

1. **Build Features**: Use mock data for rapid UI development
2. **Test Logic**: Validate business logic with known test data
3. **Demo**: Show realistic interactions without API costs
4. **Transition**: Replace mock calls with real APIs incrementally

## Advantages

- ⚡ **Fast**: No API latency or rate limits
- 💰 **Free**: No API costs during development
- 🔄 **Consistent**: Reproducible test scenarios
- 🎯 **Realistic**: Based on actual LLM behaviors
- 🧪 **Testable**: Perfect for automated testing

## Next Steps

1. Read the full documentation: [docs/MOCK_DATA_SYSTEM.md](docs/MOCK_DATA_SYSTEM.md)
2. Explore the code: [src/lib/mock-data.ts](src/lib/mock-data.ts)
3. Run the tests: `npm test src/lib/__tests__/mock-data.test.ts`
4. Try the demo: `node scripts/demo-mock-data.mjs`
5. Integrate into your features

## Support

For questions or issues:
- Check [docs/MOCK_DATA_SYSTEM.md](docs/MOCK_DATA_SYSTEM.md)
- Review [src/lib/__tests__/mock-data.test.ts](src/lib/__tests__/mock-data.test.ts)
- Run [scripts/demo-mock-data.mjs](scripts/demo-mock-data.mjs)

---

**Ready to build?** Start importing from `@/lib/mock-data` and enjoy rapid development! 🚀
