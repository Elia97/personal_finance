// filepath: c:\Users\eliaz\projects\personal_finance\setup-tests.ts
import "@testing-library/jest-dom";
import fetch, { Request, Response, Headers } from "node-fetch";

// Mock globale di fetch con cast esplicito
global.fetch = fetch as unknown as typeof global.fetch;

// Aggiungi i tipi per Request, Response e Headers
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
global.Headers = Headers as unknown as typeof global.Headers;
