/**
 * Jest setup file
 * 
 * This file runs before each test file in the suite.
 * Use it to configure or set up the testing framework.
 */

// Import jest-dom matchers
// Uncomment after installing @testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Firebase
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com'
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789'
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:test'
