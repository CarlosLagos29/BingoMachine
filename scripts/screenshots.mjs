import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

const OUTPUT_DIR = 'docs';
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

// A game in progress, so the screenshots show drawn numbers instead of an empty board
const DRAWN = [7, 12, 23, 31, 45, 48, 56, 62, 67, 74, 81, 88, 3, 19, 39, 90, 52, 27];
const GAME = {
  drawn: DRAWN,
  remaining: Array.from({ length: 90 }, (_, index) => index + 1).filter((n) => !DRAWN.includes(n)),
  currentNumber: DRAWN.at(-1),
};

const SHOTS = [
  {
    file: 'screenshot-desktop.webp',
    viewport: { width: 1280, height: 800 },
  },
  {
    file: 'screenshot-mobile.webp',
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  },
];

const executablePath = CHROME_CANDIDATES.find((path) => path && existsSync(path));
if (!executablePath) {
  console.error('Chrome not found. Set CHROME_PATH to your Chrome or Chromium executable.');
  process.exit(1);
}

await mkdir(OUTPUT_DIR, { recursive: true });
const server = await preview({ preview: { port: 4173, strictPort: true }, logLevel: 'silent' });
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await puppeteer.launch({ executablePath });

try {
  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport(shot.viewport);
    await page.evaluateOnNewDocument((game) => {
      for (const [key, value] of Object.entries(game)) {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    }, GAME);
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 20_000 });
    await page.screenshot({ path: `${OUTPUT_DIR}/${shot.file}`, type: 'webp', quality: 85 });
    console.log(`Saved ${OUTPUT_DIR}/${shot.file}`);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
