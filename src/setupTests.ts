import '@testing-library/jest-dom';
import { testConfig } from './config/test.config';

// Set process.env.NODE_ENV
process.env.NODE_ENV = 'test';

// Mock window.import for Vite's import.meta.env
Object.defineProperty(window, 'import', {
  value: {
    meta: {
      env: testConfig
    }
  },
  writable: true,
  configurable: true
});

// Mock window location
const mockLocation = {
  href: '',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
  replace: jest.fn(),
  assign: jest.fn()
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Set up localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress console errors during tests
console.error = jest.fn();
console.warn = jest.fn();