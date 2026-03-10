#!/usr/bin/env node
/**
 * QuizVerse — Auto-setup: Push MONGODB_URI to Render and trigger deploy
 *
 * Usage:
 *   node scripts/auto-setup.js
 *
 * Required env vars:
 *   MONGODB_URI     - Full connection string (from Atlas)
 *   RENDER_API_KEY  - From https://dashboard.render.com → Account Settings → API Keys
 *   RENDER_SERVICE_ID - e.g. srv-d6n3nn3h46gs73c1qa4g (from Render service URL)
 *
 * Or use .env.setup (gitignored) with these variables.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

// Load .env.setup if present
loadEnv(resolve(root, '.env.setup'));
loadEnv(resolve(root, 'backend', '.env'));

const MONGODB_URI = process.env.MONGODB_URI;
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID || 'srv-d6n3nn3h46gs73c1qa4g';

const isPlaceholder = (s) => !s || s.includes('cluster.xxx') || s.includes('USER:PASSWORD') || s === 'your_render_api_key';
if (isPlaceholder(MONGODB_URI) || isPlaceholder(RENDER_API_KEY)) {
  console.error(`
QuizVerse Auto-Setup — Missing credentials

Create .env.setup in project root with:
  MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.xxx.mongodb.net/quizverse?retryWrites=true&w=majority
  RENDER_API_KEY=your_render_api_key
  RENDER_SERVICE_ID=srv-d6n3nn3h46gs73c1qa4g

Or set env vars: MONGODB_URI, RENDER_API_KEY

Get MONGODB_URI:
  Atlas → Security → Database Access → Edit user → Edit Password → Copy connection string
  Add /quizverse before ? in the URI

Get RENDER_API_KEY:
  dashboard.render.com → Account Settings → API Keys → Create
`);
  process.exit(1);
}

async function main() {
  const serviceId = RENDER_SERVICE_ID;

  // 1. Set MONGODB_URI on Render
  const setRes = await fetch(
    `https://api.render.com/v1/services/${serviceId}/env-vars/MONGODB_URI`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: MONGODB_URI }),
    }
  );

  if (!setRes.ok) {
    const err = await setRes.text();
    console.error('Render API error (set env):', setRes.status, err);
    process.exit(1);
  }
  console.log('✓ MONGODB_URI set on Render');

  // 2. Trigger deploy
  const deployRes = await fetch(
    `https://api.render.com/v1/services/${serviceId}/deploys`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clearCache: 'do_not_clear' }),
    }
  );

  if (!deployRes.ok) {
    const err = await deployRes.text();
    console.error('Render API error (deploy):', deployRes.status, err);
    process.exit(1);
  }
  const deploy = await deployRes.json();
  console.log('✓ Deploy triggered:', deploy.status || deploy.id);
  console.log('\nCheck: https://dashboard.render.com');
  console.log('Site: https://quizverse-lyart.vercel.app');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
