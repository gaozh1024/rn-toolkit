export type IconfontGlyph = { font_class: string; unicode: string };
export type IconfontJSON = {
  font_family?: string;
  glyphs: IconfontGlyph[];
  [key: string]: any;
};

let unicodeMap: Record<string, string> = {};
let fontFamily = 'iconfont';
let aliasMap: Record<string, string> = {};

export function setIconfontConfig(config: { data: IconfontJSON; fontFamily?: string }) {
  const { data } = config;
  unicodeMap = (data?.glyphs || []).reduce((acc: Record<string, string>, g: IconfontGlyph) => {
    acc[g.font_class] = g.unicode;
    return acc;
  }, {});
  fontFamily = config.fontFamily || data?.font_family || 'iconfont';
}

export function setIconfontAliases(map: Record<string, string>) {
  aliasMap = { ...map };
}

export function getIconfontChar(name: string): string | null {
  const resolved = aliasMap[name] ?? name;
  const hex = unicodeMap[resolved];
  if (!hex) return null;
  try {
    return String.fromCharCode(parseInt(hex, 16));
  } catch (e) {
    return null;
  }
}

export function getIconfontFamily() {
  return fontFamily;
}