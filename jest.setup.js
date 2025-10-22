/**
 * Jest setup file
 * 
 * This file runs before each test file in the suite.
 * Use it to configure or set up the testing framework.
 */

// Polyfills for Firebase Auth
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}
if (typeof global.Request === 'undefined') {
  global.Request = require('node-fetch').Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = require('node-fetch').Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = require('node-fetch').Headers;
}

// Import jest-dom matchers
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com'
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789'
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:test'
process.env.ENCRYPTION_SECRET = 'test-secret'
