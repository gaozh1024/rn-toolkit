#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  process.exit(r.status || 0);
}

const sub = process.argv[2];
if (!sub || sub === 'postinstall') {
  const script = path.join(__dirname, 'postinstall.js');
  process.env.INIT_CWD = process.env.INIT_CWD || process.cwd();
  // 在工具包目录内运行，以匹配 npm 生命周期的行为
  run('node', [script], { cwd: path.dirname(script) });
} else {
  console.log('Unknown command:', sub);
  console.log('Usage: rn-toolkit [postinstall]');
  process.exit(1);
}