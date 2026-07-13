module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(mp3|mp4|wav)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
