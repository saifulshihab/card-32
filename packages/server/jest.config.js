/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  coverageThreshold: {
    global: {
      functions: 20,
    },
  },
};
