#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * rn-toolkit postinstall
 * - 安装并固定所需依赖（精确版本）到宿主 package.json
 * - 自动配置 iOS/Android 的 @react-native-vector-icons/ionicons
 * - 自动确保 Babel plugins 包含 'react-native-reanimated/plugin' 并位于最后
 * - 遵循宿主 package.json -> rnToolkit 配置：{ autoInstall, manager, silent, skipConfigure }
 * - 保持稳定：任何错误均不影响宿主安装流程（只打印警告）
 *
 * 注意：不向后兼容旧包名，仅支持 @react-native-vector-icons/ionicons
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PREFIX = '[rn-toolkit postinstall]';
const log = (...args) => console.log(PREFIX, ...args);
const warn = (...args) => console.warn(PREFIX, ...args);

// 精确版本依赖列表（如需调整版本，只在此处维护）
const REQUIRED_DEPS = [
  { name: '@react-native-clipboard/clipboard', version: '1.16.3' },
  { name: '@react-navigation/bottom-tabs', version: '7.4.9' },
  { name: '@react-navigation/native', version: '7.1.18' },
  { name: '@react-navigation/native-stack', version: '7.3.28' },
  { name: 'react-native-device-info', version: '14.1.1' },
  { name: 'react-native-gesture-handler', version: '2.28.0' },
  { name: 'react-native-localize', version: '3.5.4' },
  { name: 'react-native-mmkv', version: '3.3.3' },
  { name: 'react-native-safe-area-context', version: '5.6.1' },
  { name: 'react-native-screens', version: '4.16.0' },
  { name: 'react-native-svg', version: '15.14.0' },
  { name: '@react-native-vector-icons/ionicons', version: '12.3.0' },
  { name: 'react-native-drawer-layout', version: '4.1.13' },
  { name: 'react-native-reanimated', version: '4.1.3' },
  { name: 'react-native-worklets', version: '0.6.1' },
  { name: 'react-native-permissions', version: '5.4.2' },
];

const VECTOR_ICONS_MODULE = '@react-native-vector-icons/ionicons';

function readJSON(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
}

function findHostRoot() {
  const INIT_CWD = process.env.INIT_CWD || null;
  const pkg = readJSON(path.join(process.cwd(), 'package.json')) || {};
  const inNodeModules = __dirname.includes(path.join('node_modules', '@gaozh1024', 'rn-toolkit'));
  const isToolkitRepo = pkg.name === '@gaozh1024/rn-toolkit' && !inNodeModules;
  if (isToolkitRepo) {
    log('Detected local install inside rn-toolkit repo, skip host operations.');
    return null;
  }
  return INIT_CWD || process.cwd();
}

function loadHostConfig(hostRoot) {
  const pkgPath = path.join(hostRoot, 'package.json');
  const pkg = readJSON(pkgPath) || {};
  const cfg = pkg.rnToolkit || {};
  return {
    autoInstall: cfg.autoInstall !== false, // default true
    manager: cfg.manager || 'auto',        // 'auto' | 'yarn' | 'npm' | 'pnpm'
    silent: !!cfg.silent,                  // 传递静默参数给安装命令
    skipConfigure: !!cfg.skipConfigure,    // 跳过 iOS/Android 配置
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

function collectInstallList(hostRoot, requiredList) {
  const cfgPkgPath = path.join(hostRoot, 'package.json');
  const cfgPkg = readJSON(cfgPkgPath) || {};
  const toInstall = [];
  for (const { name, version } of requiredList) {
    const declared = getDeclaredVersion(cfgPkg, name);
    if (!declared || declared !== version) {
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
  return `npm install --save --save-exact ${specList}${silent ? ' --silent' : ''}`;
}

function execInHost(cmd, cwd) {
  log('> ' + cmd);
  execSync(cmd, { stdio: 'inherit', cwd });
}

// ---------------- 项目根路径与平台配置（ionicons） ----------------
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

function resolveVectorIconsPaths(projectRoot) {
  const modulePathAbs = path.join(projectRoot, 'node_modules', VECTOR_ICONS_MODULE);
  if (!fs.existsSync(modulePathAbs)) return null;
  const podspecAbs = path.join(modulePathAbs, 'RNVectorIcons.podspec');
  const fontsGradleAbs = path.join(modulePathAbs, 'fonts.gradle');
  return {
    moduleName: VECTOR_ICONS_MODULE,
    modulePathAbs,
    podspecAbs: fs.existsSync(podspecAbs) ? podspecAbs : null,
    fontsGradleAbs: fs.existsSync(fontsGradleAbs) ? fontsGradleAbs : null,
  };
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
    const vi = resolveVectorIconsPaths(projectRoot);
    if (!vi || !vi.podspecAbs) {
      console.log('⚠️  未检测到 RNVectorIcons.podspec（ionicons 包），跳过自动 iOS 配置');
      return false;
    }
    const targetRegex = /target\s+['"][^'"]+['"]\s+do/;
    const relPathToModule = path.relative(iosDir, vi.modulePathAbs);
    if (targetRegex.test(podfileContent)) {
      podfileContent = podfileContent.replace(
        targetRegex,
        (match) => `${match}\n  pod 'RNVectorIcons', :path => '${relPathToModule}'`
      );
      fs.writeFileSync(podfilePath, podfileContent);
      console.log(`✅ 已自动配置 iOS Podfile（模块：${vi.moduleName}）`);
      console.log('📝 请运行: cd ios && pod install');
      return true;
    } else {
      console.log('⚠️  未匹配到 target 块，请手动在目标 target 内添加 pod 行');
      return false;
    }
  } catch (error) {
    console.log('❌ 配置 iOS Podfile 失败:', error.message);
    return false;
  }
}

function configureAndroid() {
  const projectRoot = findProjectRoot();
  if (!projectRoot) return false;
  const androidDir = path.join(projectRoot, 'android');
  const appDir = path.join(androidDir, 'app');
  const buildGradlePath = path.join(appDir, 'build.gradle');
  if (!fs.existsSync(androidDir) || !fs.existsSync(buildGradlePath)) {
    console.log('⚠️  Android 目录或 build.gradle 不存在，跳过 Android 配置');
    return false;
  }
  try {
    let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
    if (buildGradleContent.includes('fonts.gradle')) {
      console.log('✅ Android build.gradle 已配置字体');
      return true;
    }
    const vi = resolveVectorIconsPaths(projectRoot);
    if (!vi || !vi.fontsGradleAbs) {
      console.log('⚠️  未检测到 fonts.gradle（ionicons 包），跳过自动 Android 配置');
      return false;
    }
    const relFontsGradle = path.relative(appDir, vi.fontsGradleAbs);
    buildGradleContent += `\napply from: "${relFontsGradle}"\n`;
    fs.writeFileSync(buildGradlePath, buildGradleContent);
    console.log(`✅ 已自动配置 Android build.gradle（模块：${vi.moduleName}）`);
    return true;
  } catch (error) {
    console.log('❌ 配置 Android build.gradle 失败:', error.message);
    return false;
  }
}

function runPlatformConfiguration() {
  console.log('🚀 开始配置 @react-native-vector-icons/ionicons...');
  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.log('⚠️  未找到 React Native 项目根目录，跳过自动配置');
    console.log('📝 请手动配置 @react-native-vector-icons/ionicons');
    return;
  }
  console.log(`📁 找到项目根目录: ${projectRoot}`);
  const iosConfigured = configureIOS();
  const androidConfigured = configureAndroid();
  if (iosConfigured || androidConfigured) {
    console.log('\n🎉 @react-native-vector-icons/ionicons 配置完成！');
    if (iosConfigured) console.log('📱 iOS: 请运行 "cd ios && pod install"');
    if (androidConfigured) console.log('🤖 Android: 配置已完成');
  } else {
    console.log('\n📝 请手动配置 @react-native-vector-icons/ionicons:');
    console.log('iOS: 在 Podfile 的 target 内添加 pod \"RNVectorIcons\"，:path 指向 node_modules/@react-native-vector-icons/ionicons');
    console.log('Android: 在 android/app/build.gradle 中添加 apply from: 指向该包内的 fonts.gradle');
  }
}

// ---------------- Babel reanimated 插件保障 ----------------
function configureBabelReanimatedPlugin() {
  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.log('⚠️  未找到 React Native 项目根目录，跳过 Babel 配置');
    return false;
  }
  const babelPath = path.join(projectRoot, 'babel.config.js');
  if (!fs.existsSync(babelPath)) {
    console.log('⚠️  未找到 babel.config.js，跳过自动配置。请手动在 plugins 最后一行添加 "react-native-reanimated/plugin"');
    return false;
  }
  try {
    let content = fs.readFileSync(babelPath, 'utf8');
    const regex = /plugins\s*:\s*\[\s*([\s\S]*?)\s*\]/m;
    const match = content.match(regex);
    if (!match) {
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
      content += `\n// rn-toolkit auto-added plugins\ntry {\n  module.exports = module.exports || {};\n  module.exports.plugins = Array.isArray(module.exports.plugins) ? module.exports.plugins : [];\n  if (!module.exports.plugins.includes('react-native-reanimated/plugin')) {\n    module.exports.plugins.push('react-native-reanimated/plugin');\n  }\n  const idx = module.exports.plugins.indexOf('react-native-reanimated/plugin');\n  if (idx !== -1 && idx !== module.exports.plugins.length - 1) {\n    module.exports.plugins.splice(idx, 1);\n    module.exports.plugins.push('react-native-reanimated/plugin');\n  }\n} catch (e) {}\n`;
      fs.writeFileSync(babelPath, content, 'utf8');
      console.log('✅ 未检测到 plugins，已在文件末尾追加并添加 reanimated 插件');
      return true;
    }

    let inner = match[1];
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

// ---------------- 主流程 ----------------
function ensureGestureHandlerImportAtTop() {
  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.log('⚠️  未找到 React Native 项目根目录，跳过 index.js 检查');
    return false;
  }
  const indexJsPath = path.join(projectRoot, 'index.js');
  if (!fs.existsSync(indexJsPath)) {
    console.log('⚠️  未找到 index.js，跳过插入 react-native-gesture-handler');
    return false;
  }
  try {
    let content = fs.readFileSync(indexJsPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const firstLine = (lines[0] || '').replace(/^\uFEFF/, '').trim();
    const target = "import 'react-native-gesture-handler';";
    if (firstLine === target) {
      console.log('✅ index.js 第一行已包含 react-native-gesture-handler 导入');
      return true;
    }
    const newContent = [target, ...lines].join('\n');
    fs.writeFileSync(indexJsPath, newContent, 'utf8');
    console.log('✅ 已在 index.js 第一行添加 react-native-gesture-handler 导入');
    return true;
  } catch (error) {
    console.log('❌ 修改 index.js 失败:', error.message);
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
    if (!hostRoot) return;

    const cfg = loadHostConfig(hostRoot);
    const manager = resolvePackageManager(cfg.manager, process.env.npm_config_user_agent);
    const toInstall = collectInstallList(hostRoot, REQUIRED_DEPS);

    if (!cfg.autoInstall) {
      if (toInstall.length === 0) {
        log('All required dependencies already pinned in package.json, skip install.');
      } else {
        log('Auto-install disabled. Missing or mismatched dependencies detected:');
        for (const d of toInstall) console.log(`  - ${d.name}@${d.version}`);
      }
    } else {
      if (toInstall.length === 0) {
        log('All required dependencies already pinned in package.json, skip install.');
      } else {
        log('Installing and pinning required dependencies (exact versions):');
        toInstall.forEach(d => console.log(`  - ${d.name}@${d.version}`));
        const cmd = buildInstallCommand(manager, toInstall, cfg.silent);
        if (cmd) execInHost(cmd, hostRoot);
        log('Dependencies installed and written to package.json.');
      }
    }

    if (!cfg.skipConfigure) {
      configureBabelReanimatedPlugin();
      runPlatformConfiguration();
    } else {
      log('Skip platform configuration as per host config.');
    }
    // 新增：确保 index.js 第一行包含 react-native-gesture-handler 导入
    ensureGestureHandlerImportAtTop();
  } catch (err) {
    warn('Postinstall encountered an error but will not fail consumer install.');
    warn(String(err && err.message ? err.message : err));
  }
}

if (require.main === module) {
  main();
}