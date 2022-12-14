/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ["**/__tests__/**/?(*.)test.[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/src/test-utils/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      'ts-jest', { 
        diagnostics: {
          warnOnly: true
        }
      }
    ],
  },
  moduleNameMapper: {
    "\\.png$": "<rootDir>/src/test-utils/__mocks__/file.mock.ts",
  },
};