module.exports = {
  globalSetup: './jest.global-setup.js',
  setupFiles: ['dotenv/config'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: {
    '@latitude55/libs': '<rootDir>src/libs',
    '@latitude55/modules(.*)': '<rootDir>src/modules/$1',
    '@latitude55/types': '<rootDir>src/types',
    '@latitude55/middleware': '<rootDir>src/middleware'
  },
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 45,
      functions: 80,
      lines: 70
    }
  }
};
