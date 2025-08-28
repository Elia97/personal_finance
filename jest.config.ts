import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node", // Ambiente per test unitari
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(ts|js)$": "ts-jest", // Trasforma solo TypeScript e JavaScript
  },
  setupFilesAfterEnv: [], // Rimuovo i file di setup
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Mapping per l'alias @
  },
};

export default config;
