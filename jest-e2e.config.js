/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/node_modules/**',
  ],
  coverageDirectory: './coverage/e2e',
  setupFilesAfterEnv: ['./setupTests.ts'],
}
