import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  globals: {
    isolatedModules: true,
  },
  testEnvironment: "jsdom", // Ambiente per test basati su browser
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(ts|js)$": "ts-jest", // Trasforma solo TypeScript e JavaScript
  },
  transformIgnorePatterns: [
    "/node_modules/(?!jose)/", // Trasforma i moduli ECMAScript come 'jose'
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Aggiunge file di setup
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Mapping per l'alias @
  },
  cache: true,
};

export default config;
