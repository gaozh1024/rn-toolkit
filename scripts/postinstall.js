#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findProjectRoot() {
  let currentDir = process.cwd();
  
  // 向上查找，直到找到包含 package.json 的目录
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8'));
      // 确保这是一个 React Native 项目
      if (packageJson.dependencies && 
          (packageJson.dependencies['react-native'] || packageJson.devDependencies?.['react-native'])) {
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
    
    // 检查是否已经配置了 RNVectorIcons
    if (podfileContent.includes('RNVectorIcons')) {
      console.log('✅ iOS Podfile 已配置 RNVectorIcons');
      return true;
    }
    
    // 在 target 'YourProject' do 之后添加 RNVectorIcons
    const targetRegex = /target\s+['"][^'"]+['"]\s+do/;
    if (targetRegex.test(podfileContent)) {
      podfileContent = podfileContent.replace(
        targetRegex,
        match => `${match}\n  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'`
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
    
    // 检查是否已经配置了字体
    if (buildGradleContent.includes('react-native-vector-icons/fonts.gradle')) {
      console.log('✅ Android build.gradle 已配置字体');
      return true;
    }
    
    // 在文件末尾添加字体配置
    buildGradleContent += '\napply from: "../../node_modules/react-native-vector-icons/fonts.gradle"\n';
    
    fs.writeFileSync(buildGradlePath, buildGradleContent);
    console.log('✅ 已自动配置 Android build.gradle');
    return true;
  } catch (error) {
    console.log('❌ 配置 Android build.gradle 失败:', error.message);
  }
  
  return false;
}

function main() {
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
    
    if (iosConfigured) {
      console.log('📱 iOS: 请运行 "cd ios && pod install"');
    }
    
    if (androidConfigured) {
      console.log('🤖 Android: 配置已完成');
    }
  } else {
    console.log('\n📝 请手动配置 react-native-vector-icons:');
    console.log('iOS: 在 Podfile 中添加 pod \'RNVectorIcons\', :path => \'../node_modules/react-native-vector-icons\'');
    console.log('Android: 在 android/app/build.gradle 中添加 apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"');
  }
}

if (require.main === module) {
  main();
}