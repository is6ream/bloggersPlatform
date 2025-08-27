/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest", // чтобы работал TypeScript
  testEnvironment: "node",
  testMatch: ["**/*.e2e-spec.ts", "**/*.test.ts"], // ищет только тесты
};

module.exports = config;
