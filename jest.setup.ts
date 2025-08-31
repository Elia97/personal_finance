import fetch from "node-fetch";
import { TextEncoder, TextDecoder } from "util";

global.fetch = fetch as unknown as (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;
global.setImmediate = ((
  callback: (...args: unknown[]) => void,
  ...args: unknown[]
) => setTimeout(callback, 0, ...args)) as unknown as typeof setImmediate;
global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
