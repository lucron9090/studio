# Testing Infrastructure

This directory contains test files for the application. The testing infrastructure is set up but test dependencies are not yet installed.

## Getting Started with Testing

### 1. Install Test Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

### 2. Add Test Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3. Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

- **Unit Tests**: Test individual functions and utilities
  - Example: `error-handling.test.ts`
  
- **Component Tests**: Test React components in isolation
  - Place in `src/components/__tests__/`
  
- **Integration Tests**: Test multiple components/services together
  - Place in `src/__tests__/integration/`
  
- **AI Flow Tests**: Test AI flow logic
  - Place in `src/ai/flows/__tests__/`

## Writing Tests

### Example Unit Test

```typescript
import { myFunction } from '../myModule';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Example Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Keep tests simple and focused** - One test should test one thing
2. **Use descriptive test names** - Clearly state what is being tested
3. **Arrange-Act-Assert pattern** - Set up, execute, verify
4. **Mock external dependencies** - Firebase, APIs, etc.
5. **Test error cases** - Don't just test the happy path
6. **Aim for high coverage** - But focus on critical paths first

## Coverage Goals

- **Utilities**: 90%+ coverage
- **AI Flows**: 80%+ coverage  
- **Components**: 70%+ coverage
- **Overall**: 70%+ coverage

## TODO

- [ ] Install test dependencies
- [ ] Set up test database (Firebase emulators)
- [ ] Add component tests
- [ ] Add AI flow tests
- [ ] Add integration tests
- [ ] Configure code coverage thresholds
- [ ] Integrate with CI/CD pipeline
