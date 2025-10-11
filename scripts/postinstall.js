#!/usr/bin/env node
/* eslint-disable no-console */

// rn-toolkit postinstall script
// - Improves readability and structured logging
// - Installs strictly pinned required dependencies in the host app (exact versions)
// - Respects host configuration via package.json -> rnToolkit { autoInstall, manager, silent, skipConfigure }
// - Configures iOS/Android for react-native-vector-icons
// - Never fails the consumer install on errors

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PREFIX = '[rn-toolkit postinstall]';
const log = (...args) => console.log(PREFIX, ...args);
const warn = (...args) => console.warn(PREFIX, ...args);

// Strictly pinned required dependencies for rn-toolkit to work
const REQUIRED_DEPS = [
  { name: '@react-native-clipboard/clipboard', version: '1.16.3' },
  { name: '@react-navigation/bottom-tabs', version: '7.4.7' },
  { name: '@react-navigation/native', version: '7.1.17' },
  { name: '@react-navigation/stack', version: '7.4.8' },
  { name: 'react-native-device-info', version: '14.1.1' },
  { name: 'react-native-gesture-handler', version: '2.28.0' },
  { name: 'react-native-localize', version: '3.5.2' },
  { name: 'react-native-mmkv', version: '3.3.3' },
  { name: 'react-native-safe-area-context', version: '5.6.1' },
  { name: 'react-native-screens', version: '4.16.0' },
  { name: 'react-native-svg', version: '15.14.0' },
  { name: 'react-native-vector-icons', version: '10.3.0' },
  { name: 'react-native-drawer-layout', version: '4.1.13' },
  { name: 'react-native-reanimated', version: '4.1.3' },
  { name: 'react-native-worklets', version: '0.6.1' },
];

function readJSON(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
}

// 文件：scripts/postinstall.js，方法：findHostRoot()
function findHostRoot() {
  const INIT_CWD = process.env.INIT_CWD || null;
  const pkg = readJSON(path.join(process.cwd(), 'package.json')) || {};
  const inNodeModules = __dirname.includes(path.join('node_modules', '@gaozh1024', 'rn-toolkit'));
  const isToolkitRepo = pkg.name === '@gaozh1024/rn-toolkit' && !inNodeModules;

  if (isToolkitRepo) {
    // 真正的“在本地 rn-toolkit 仓库内开发”场景：跳过宿主操作
    log('Detected local install inside rn-toolkit repo, skip host operations.');
    return null;
  }
  // 其他场景：返回宿主根（手动执行时 INIT_CWD 可能为空，回退到当前目录）
  return INIT_CWD || process.cwd();
}

function loadHostConfig(hostRoot) {
  const pkgPath = path.join(hostRoot, 'package.json');
  const pkg = readJSON(pkgPath) || {};
  const cfg = pkg.rnToolkit || {};
  return {
    autoInstall: cfg.autoInstall !== false, // default true
    manager: cfg.manager || 'auto',        // 'auto' | 'yarn' | 'npm' | 'pnpm'
    silent: !!cfg.silent,                  // less logs from child installers
    skipConfigure: !!cfg.skipConfigure,    // skip iOS/Android configuration
    pkg,
    pkgPath,
  };
}

function resolvePackageManager(prefer, userAgent) {
  if (prefer && prefer !== 'auto') return prefer;
  const ua = (userAgent || process.env.npm_config_user_agent || '').toLowerCase();
  if (ua.includes('yarn')) return 'yarn';
  if (ua.includes('pnpm')) return 'pnpm';
  return 'npm';
}

function getDeclaredVersion(pkg, name) {
  const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg || {};
  return dependencies[name] || devDependencies[name] || peerDependencies[name] || null;
}

function hasInstalledPackage(hostRoot, name) {
  const checkPaths = [];
  // 优先检查宿主应用的 node_modules
  checkPaths.push(path.join(hostRoot, 'node_modules', name, 'package.json'));
  // 回退检查 RN 项目根目录（workspace/hoist 场景）
  const projectRoot = findProjectRoot();
  if (projectRoot && projectRoot !== hostRoot) {
    checkPaths.push(path.join(projectRoot, 'node_modules', name, 'package.json'));
  }
  return checkPaths.some(p => fs.existsSync(p));
}

function collectInstallList(hostRoot, requiredList) {
  const toInstall = [];
  for (const { name, version } of requiredList) {
    // 仅当宿主的 node_modules 中缺失时加入安装列表
    if (!hasInstalledPackage(hostRoot, name)) {
      toInstall.push({ name, version });
    }
  }
  return toInstall;
}

function buildInstallCommand(manager, deps, silent) {
  if (!deps.length) return null;
  const specList = deps.map(d => `${d.name}@${d.version}`).join(' ');
  if (manager === 'yarn') return `yarn add -E ${specList}${silent ? ' --silent' : ''}`;
  if (manager === 'pnpm') return `pnpm add -E ${specList}${silent ? ' --silent' : ''}`;
  // npm
  return `npm install --save --save-exact ${specList}${silent ? ' --silent' : ''}`;
}

function execInHost(cmd, cwd) {
  log('> ' + cmd);
  execSync(cmd, { stdio: 'inherit', cwd });
}

// ---------------- iOS/Android configuration for vector-icons -----------------
function findProjectRoot() {
  let currentDir = process.cwd();
  while (currentDir !== path.dirname(currentDir)) {
    const pkgPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const packageJson = readJSON(pkgPath);
      if (packageJson && (packageJson.dependencies?.['react-native'] || packageJson.devDependencies?.['react-native'])) {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

function configureIOS() {
  const projectRoot = findProjectRoot();
  if (!projectRoot) return false;
  const iosDir = path.join(projectRoot, 'ios');
  const podfilePath = path.join(iosDir, 'Podfile');
  if (!fs.existsSync(iosDir) || !fs.existsSync(podfilePath)) {
    console.log('⚠️  iOS 目录或 Podfile 不存在，跳过 iOS 配置');
    return false;
  }
  try {
    let podfileContent = fs.readFileSync(podfilePath, 'utf8');
    if (podfileContent.includes('RNVectorIcons')) {
      console.log('✅ iOS Podfile 已配置 RNVectorIcons');
      return true;
    }
    const targetRegex = /target\s+['"][^'"]+['"]\s+do/;
    if (targetRegex.test(podfileContent)) {
      podfileContent = podfileContent.replace(
        targetRegex,
        (match) => `${match}\n  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'`
      );
      fs.writeFileSync(podfilePath, podfileContent);
      console.log('✅ 已自动配置 iOS Podfile');
      console.log('📝 请运行: cd ios && pod install');
      return true;
    }
  } catch (error) {
    console.log('❌ 配置 iOS Podfile 失败:', error.message);
  }
  return false;
}

function configureAndroid() {
  const projectRoot = findProjectRoot();
  if (!projectRoot) return false;
  const androidDir = path.join(projectRoot, 'android');
  const buildGradlePath = path.join(androidDir, 'app', 'build.gradle');
  if (!fs.existsSync(androidDir) || !fs.existsSync(buildGradlePath)) {
    console.log('⚠️  Android 目录或 build.gradle 不存在，跳过 Android 配置');
    return false;
  }
  try {
    let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
    if (buildGradleContent.includes('react-native-vector-icons/fonts.gradle')) {
      console.log('✅ Android build.gradle 已配置字体');
      return true;
    }
    buildGradleContent += '\napply from: "../../node_modules/react-native-vector-icons/fonts.gradle"\n';
    fs.writeFileSync(buildGradlePath, buildGradleContent);
    console.log('✅ 已自动配置 Android build.gradle');
    return true;
  } catch (error) {
    console.log('❌ 配置 Android build.gradle 失败:', error.message);
  }
  return false;
}

function runPlatformConfiguration() {
  console.log('🚀 开始配置 react-native-vector-icons...');
  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.log('⚠️  未找到 React Native 项目根目录，跳过自动配置');
    console.log('📝 请手动配置 react-native-vector-icons');
    return;
  }
  console.log(`📁 找到项目根目录: ${projectRoot}`);
  const iosConfigured = configureIOS();
  const androidConfigured = configureAndroid();
  if (iosConfigured || androidConfigured) {
    console.log('\n🎉 react-native-vector-icons 配置完成！');
    if (iosConfigured) console.log('📱 iOS: 请运行 "cd ios && pod install"');
    if (androidConfigured) console.log('🤖 Android: 配置已完成');
  } else {
    console.log('\n📝 请手动配置 react-native-vector-icons:');
    console.log('iOS: 在 Podfile 中添加 pod \'RNVectorIcons\', :path => \'../node_modules/react-native-vector-icons\'');
    console.log('Android: 在 android/app/build.gradle 中添加 apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"');
  }
}

function configureBabelReanimatedPlugin() {
  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.log('⚠️  未找到 React Native 项目根目录，跳过 Babel 配置');
    return false;
  }
  const babelPath = path.join(projectRoot, 'babel.config.js');
  if (!fs.existsSync(babelPath)) {
    console.log('⚠️  未找到 babel.config.js，跳过自动配置。请手动在 plugins 最后一行添加 \"react-native-reanimated/plugin\"');
    return false;
  }
  try {
    let content = fs.readFileSync(babelPath, 'utf8');

    const regex = /plugins\s*:\s*\[\s*([\s\S]*?)\s*\]/m;
    const match = content.match(regex);
    if (!match) {
      // 新增：未检测到 plugins，则自动创建并加入 reanimated 插件（且保证位于最后）
      const exportsRegex = /module\.exports\s*=\s*\{\s*([\s\S]*?)\s*\};?/m;
      const objMatch = content.match(exportsRegex);
      if (objMatch) {
        const objInner = objMatch[1];
        const newObjInner = `plugins: [\n    'react-native-reanimated/plugin'\n  ],\n${objInner}`;
        const replaced = content.replace(exportsRegex, `module.exports = {\n${newObjInner}\n};`);
        fs.writeFileSync(babelPath, replaced, 'utf8');
        console.log('✅ 未检测到 plugins，已创建并添加 reanimated 插件');
        return true;
      }

      // 回退：无法定位导出对象，末尾追加安全修改逻辑
      content += `\n// rn-toolkit auto-added plugins\ntry {\n  module.exports = module.exports || {};\n  module.exports.plugins = Array.isArray(module.exports.plugins) ? module.exports.plugins : [];\n  if (!module.exports.plugins.includes('react-native-reanimated/plugin')) {\n    module.exports.plugins.push('react-native-reanimated/plugin');\n  }\n  // 确保插件位于最后\n  const idx = module.exports.plugins.indexOf('react-native-reanimated/plugin');\n  if (idx !== -1 && idx !== module.exports.plugins.length - 1) {\n    module.exports.plugins.splice(idx, 1);\n    module.exports.plugins.push('react-native-reanimated/plugin');\n  }\n} catch (e) {}\n`;
      fs.writeFileSync(babelPath, content, 'utf8');
      console.log('✅ 未检测到 plugins，已在文件末尾追加并添加 reanimated 插件');
      return true;
    }

    let inner = match[1];
    // 移除已有 reanimated 插件（避免重复），稍后统一追加到最后
    inner = inner.replace(/['"]react-native-reanimated\/plugin['"]\s*,?/g, '').trim();
    inner = inner.replace(/,\s*$/, '');

    const newInner = inner.length > 0
      ? `${inner},\n    'react-native-reanimated/plugin'`
      : `'react-native-reanimated/plugin'`;

    const newSection = `plugins: [\n    ${newInner}\n  ]`;
    const newContent = content.replace(regex, newSection);

    if (newContent !== content) {
      fs.writeFileSync(babelPath, newContent, 'utf8');
      console.log('✅ 已将 reanimated Babel 插件添加到 plugins 最后一行');
      return true;
    } else {
      console.log('ℹ️  Babel 配置无需变更');
      return false;
    }
  } catch (error) {
    console.log('❌ 配置 Babel 失败:', error.message);
    return false;
  }
}

function main() {
  try {
    if (process.env.RN_TOOLKIT_SKIP_POSTINSTALL === '1') {
      log('Skip postinstall because RN_TOOLKIT_SKIP_POSTINSTALL=1');
      return;
    }

    const hostRoot = findHostRoot();
    if (!hostRoot) return; // 在本地 rn-toolkit 仓库内开发，跳过宿主操作

    const cfg = loadHostConfig(hostRoot);
    const manager = resolvePackageManager(cfg.manager, process.env.npm_config_user_agent);
    const toInstall = collectInstallList(hostRoot, REQUIRED_DEPS);

    if (!cfg.autoInstall) {
      if (toInstall.length === 0) {
        log('All required dependencies already present in node_modules, skip install.');
      } else {
        log('Auto-install disabled. Missing dependencies detected:');
        for (const d of toInstall) {
          console.log(`  - ${d.name}@${d.version}`);
        }
      }
    } else {
      if (toInstall.length === 0) {
        log('All required dependencies already present in node_modules, skip install.');
      } else {
        log('Installing missing required dependencies (exact versions):');
        toInstall.forEach(d => console.log(`  - ${d.name}@${d.version}`));
        const cmd = buildInstallCommand(manager, toInstall, cfg.silent);
        if (cmd) execInHost(cmd, hostRoot);
        log('Dependencies installed successfully.');
      }
    }

    if (!cfg.skipConfigure) {
      // 新增：配置 Babel 插件（确保在平台配置前完成）
      configureBabelReanimatedPlugin();
      runPlatformConfiguration();
    } else {
      log('Skip platform configuration as per host config.');
    }
  } catch (err) {
    warn('Postinstall encountered an error but will not fail consumer install.');
    warn(String(err && err.message ? err.message : err));
  }
}

if (require.main === module) {
  main();
}