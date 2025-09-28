import type { ColorSpace } from './types';

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, v];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return [ (r + m) * 255, (g + m) * 255, (b + m) * 255 ];
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/**
 * 纯 JS 颜色插值函数（不依赖 Reanimated），适合 Animated 路径的颜色过渡
 * - progress01: 归一化进度（0→1）
 * - inputRange/outputColors: 区间与颜色序列（长度相同，Hex 3/6 位）
 * - colorSpace: RGB 或 HSV（HSV 会考虑 Hue 环绕）
 */
export function interpolateColorJS(
  progress01: number,
  inputRange: number[],
  outputColors: string[],
  colorSpace: ColorSpace = 'RGB'
): string {
  const t = clamp01(progress01);
  if (inputRange.length !== outputColors.length) {
    throw new Error('[interpolateColorJS] inputRange and outputColors length mismatch');
  }

  // 查找区间
  let i = 0;
  while (i < inputRange.length - 1 && t > inputRange[i + 1]) i++;
  const t0 = inputRange[i];
  const t1 = inputRange[Math.min(i + 1, inputRange.length - 1)];
  const localT = t1 === t0 ? 0 : (t - t0) / (t1 - t0);

  const c0 = outputColors[i];
  const c1 = outputColors[Math.min(i + 1, outputColors.length - 1)];

  if (colorSpace === 'HSV') {
    const [r0, g0, b0] = hexToRgb(c0);
    const [r1, g1, b1] = hexToRgb(c1);
    const [h0, s0, v0] = rgbToHsv(r0, g0, b0);
    const [h1, s1, v1] = rgbToHsv(r1, g1, b1);
    // Hue 环绕，走最短路径
    let dh = h1 - h0;
    if (Math.abs(dh) > 180) dh -= Math.sign(dh) * 360;
    const h = h0 + dh * localT;
    const s = lerp(s0, s1, localT);
    const v = lerp(v0, v1, localT);
    const [r, g, b] = hsvToRgb(h, s, v);
    return rgbToHex(r, g, b);
  } else {
    const [r0, g0, b0] = hexToRgb(c0);
    const [r1, g1, b1] = hexToRgb(c1);
    const r = lerp(r0, r1, localT);
    const g = lerp(g0, g1, localT);
    const b = lerp(b0, b1, localT);
    return rgbToHex(r, g, b);
  }
}