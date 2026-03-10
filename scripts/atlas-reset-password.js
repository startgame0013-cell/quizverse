#!/usr/bin/env node
/**
 * Reset MongoDB Atlas database user password via API, then run auto-setup.
 *
 * Required env vars:
 *   ATLAS_PUBLIC_KEY   - Atlas API public key (from Organization → API Keys)
 *   ATLAS_PRIVATE_KEY  - Atlas API private key
 *   ATLAS_GROUP_ID     - Project ID (from URL: cloud.mongodb.com/v2/XXXXX)
 *   ATLAS_CLUSTER      - e.g. cluster8.kwdmpdu.mongodb.net
 *   ATLAS_USERNAME     - e.g. startgame001_db_user (or new username to create)
 *   RENDER_API_KEY
 *   RENDER_SERVICE_ID
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
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

loadEnv(resolve(root, '.env.setup'));
loadEnv(resolve(root, 'backend', '.env'));

const ATLAS_PUBLIC = process.env.ATLAS_PUBLIC_KEY;
const ATLAS_PRIVATE = process.env.ATLAS_PRIVATE_KEY;
const ATLAS_GROUP_ID = process.env.ATLAS_GROUP_ID || '6967bf8e825e4c082a15e182';
const ATLAS_CLUSTER = process.env.ATLAS_CLUSTER || 'cluster8.kwdmpdu.mongodb.net';
const ATLAS_USERNAME = process.env.ATLAS_USERNAME || 'startgame001_db_user';
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID || 'srv-d6n3nn3h46gs73c1qa4g';

if (!ATLAS_PUBLIC || !ATLAS_PRIVATE || !RENDER_API_KEY) {
  console.error(`
Atlas Reset + Render Setup — Missing credentials

Add to .env.setup:
  ATLAS_PUBLIC_KEY=your_atlas_public_key
  ATLAS_PRIVATE_KEY=your_atlas_private_key
  ATLAS_GROUP_ID=6967bf8e825e4c082a15e182
  ATLAS_CLUSTER=cluster8.kwdmpdu.mongodb.net
  ATLAS_USERNAME=startgame001_db_user
  RENDER_API_KEY=your_render_api_key
  RENDER_SERVICE_ID=srv-d6n3nn3h46gs73c1qa4g

Get Atlas API keys: Atlas → Organization → Access Manager → API Keys → Create
`);
  process.exit(1);
}

function randomPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function curl(method, url, body, digestUser, digestPass) {
  return new Promise((resolvePromise, reject) => {
    const args = [
      '-s', '-w', '\n%{http_code}',
      '-u', `${digestUser}:${digestPass}`,
      '--digest',
      '-X', method,
      '-H', 'Content-Type: application/json',
      url,
    ];
    if (body) args.splice(args.indexOf(url), 0, '-d', body);
    const proc = spawn('curl', args);
    let out = '';
    proc.stdout.on('data', (d) => { out += d; });
    proc.stderr.on('data', (d) => { console.error(d.toString()); });
    proc.on('close', (code) => {
      const parts = out.trim().split('\n');
      const status = parts.pop();
      const json = parts.join('\n');
      resolvePromise({ status: parseInt(status, 10), body: json });
    });
    proc.on('error', reject);
  });
}

async function main() {
  const password = randomPassword();
  const uri = `mongodb+srv://${ATLAS_USERNAME}:${encodeURIComponent(password)}@${ATLAS_CLUSTER}/quizverse?retryWrites=true&w=majority`;

  // Update Atlas database user password
  const url = `https://cloud.mongodb.com/api/atlas/v2/groups/${ATLAS_GROUP_ID}/databaseUsers/admin/${ATLAS_USERNAME}`;
  const body = JSON.stringify({
    password,
    roles: [{ roleName: 'atlasAdmin', databaseName: 'admin' }],
  });

  const res = await curl('PATCH', url, body, ATLAS_PUBLIC, ATLAS_PRIVATE);

  if (res.status >= 400) {
    // Try creating user if doesn't exist
    const createUrl = `https://cloud.mongodb.com/api/atlas/v2/groups/${ATLAS_GROUP_ID}/databaseUsers`;
    const createBody = JSON.stringify({
      username: ATLAS_USERNAME,
      password,
      roles: [{ roleName: 'atlasAdmin', databaseName: 'admin' }],
    });
    const createRes = await curl('POST', createUrl, createBody, ATLAS_PUBLIC, ATLAS_PRIVATE);
    if (createRes.status >= 400) {
      console.error('Atlas API error:', createRes.status, createRes.body);
      console.error('Falling back to manual setup. Run: node scripts/auto-setup.js');
      console.error('Get MONGODB_URI from Atlas (Edit user → new password) and add to .env.setup');
      process.exit(1);
    }
    console.log('✓ Atlas database user created');
  } else {
    console.log('✓ Atlas database user password reset');
  }

  process.env.MONGODB_URI = uri;
  process.env.RENDER_API_KEY = RENDER_API_KEY;
  process.env.RENDER_SERVICE_ID = RENDER_SERVICE_ID;

  const { spawn: run } = await import('child_process');
  const sub = run('node', [resolve(__dirname, 'auto-setup.js')], {
    env: { ...process.env, MONGODB_URI: uri },
    stdio: 'inherit',
  });
  sub.on('close', (code) => process.exit(code || 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
