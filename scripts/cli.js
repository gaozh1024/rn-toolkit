#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  process.exit(r.status || 0);
}

const sub = process.argv[2];
if (!sub || sub === 'postinstall') {
  const script = path.join(__dirname, 'postinstall.js');
  // 默认把 INIT_CWD 设为当前工作目录，便于手动触发
  process.env.INIT_CWD = process.env.INIT_CWD || process.cwd();
  run('node', [script]);
} else {
  console.log('Unknown command:', sub);
  console.log('Usage: rn-toolkit [postinstall]');
  process.exit(1);
}