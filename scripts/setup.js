#!/usr/bin/env node
/**
 * QuizVerse — Interactive setup: prompts for credentials, then pushes to Render
 * Run: node scripts/setup.js
 */

import { createInterface } from 'readline';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  const content = readFileSync(path, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) {
      const v = m[2].trim().replace(/^["']|["']$/g, '');
      if (v && !v.includes('USER:PASSWORD') && !v.includes('cluster.xxx')) out[m[1].trim()] = v;
    }
  }
  return out;
}

function ask(rl, q, def = '') {
  const suffix = def ? ` [${def}]` : '';
  return new Promise((resolve) => {
    rl.question(`${q}${suffix}: `, (a) => resolve((a || def).trim()));
  });
}

async function main() {
  const env = { ...loadEnv(resolve(root, '.env.setup')), ...loadEnv(resolve(root, 'backend', '.env')) };
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n--- QuizVerse Setup ---\n');

  let MONGODB_URI = env.MONGODB_URI;
  let RENDER_API_KEY = env.RENDER_API_KEY;
  const RENDER_SERVICE_ID = env.RENDER_SERVICE_ID || 'srv-d6n3nn3h46gs73c1qa4g';

  if (!MONGODB_URI || MONGODB_URI.includes('cluster.xxx')) {
    console.log('MONGODB_URI: Get from Atlas → Security → Database Access → Edit user → Password → Connect → Drivers');
    console.log('Format: mongodb+srv://USER:PASS@cluster.xxx.mongodb.net/quizverse?retryWrites=true&w=majority\n');
    MONGODB_URI = await ask(rl, 'Paste MONGODB_URI');
  }
  if (!RENDER_API_KEY) {
    console.log('\nRENDER_API_KEY: Get from dashboard.render.com → Account Settings → API Keys → Create\n');
    RENDER_API_KEY = await ask(rl, 'Paste RENDER_API_KEY');
  }

  rl.close();

  if (!MONGODB_URI || !RENDER_API_KEY) {
    console.error('\nMissing credentials. Exiting.');
    process.exit(1);
  }

  if (!MONGODB_URI.includes('/quizverse')) {
    MONGODB_URI = MONGODB_URI.replace(/\?/, '/quizverse?');
    console.log('Added /quizverse to URI');
  }

  writeFileSync(resolve(root, '.env.setup'), `MONGODB_URI=${MONGODB_URI}
RENDER_API_KEY=${RENDER_API_KEY}
RENDER_SERVICE_ID=${RENDER_SERVICE_ID}
`, { mode: 0o600 });

  const { spawn } = await import('child_process');
  const sub = spawn('node', [resolve(__dirname, 'auto-setup.js')], {
    env: { ...process.env, MONGODB_URI, RENDER_API_KEY, RENDER_SERVICE_ID },
    stdio: 'inherit',
  });
  sub.on('close', (code) => process.exit(code ?? 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
