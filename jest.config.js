module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(mp3|wav|m4a|aac)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
