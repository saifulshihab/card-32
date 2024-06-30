/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/jest-setup.ts"],
  coverageThreshold: {
    global: {
      functions: 50,
    },
  },
};
