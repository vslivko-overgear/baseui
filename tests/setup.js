// jsdom lacks a few browser APIs the components use.
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia ??= (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false });
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
window.HTMLElement.prototype.scrollIntoView ??= () => {};
window.Element.prototype.getAnimations ??= () => [];
afterEach(cleanup);
globalThis.CSS ??= {};
globalThis.CSS.supports ??= () => false;
import '@testing-library/jest-dom/vitest';

// Pages read files of the repository with fetch (tokens.css); in the tests the address is the dev server of jsdom, which does not exist: answer from the disk.
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(String(input?.url ?? input), 'http://localhost:3000/');
  if (url.hostname === 'localhost' && url.port === '3000') {
    try { return new Response(await readFile(join(process.cwd(), decodeURIComponent(url.pathname))), { status: 200 }); } catch { return new Response('not found', { status: 404 }); }
  }
  return realFetch(input, init);
};
