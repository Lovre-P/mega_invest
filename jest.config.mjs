// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // Path to Next.js app
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if you have a setup file
  testEnvironment: 'node', // For backend tests like auth.ts
  moduleDirectories: ['node_modules', '<rootDir>/'],
  preset: 'ts-jest',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured by next/jest)
    // For example, if you have a path alias like "@/*": ["./src/*"] in tsconfig.json
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(customJestConfig);
