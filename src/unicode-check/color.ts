/** HSV を sRGB の `rgb(R, G, B)` へ変換する。既定は前景色の S=0.5, V=0.7。 */
export function hsvToRgb(hue: number, saturation = 0.5, value = 0.7): string {
  const c = value * saturation;
  const h = hue / 60;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = value - c;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (h < 1) {
    red = c;
    green = x;
  } else if (h < 2) {
    red = x;
    green = c;
  } else if (h < 3) {
    green = c;
    blue = x;
  } else if (h < 4) {
    green = x;
    blue = c;
  } else if (h < 5) {
    red = x;
    blue = c;
  } else {
    red = c;
    blue = x;
  }
  const channel = (value: number) => Math.round((value + m) * 255);
  return `rgb(${channel(red)}, ${channel(green)}, ${channel(blue)})`;
}

/** Latin 以外の文字種名を符号単位順に並べ、色相を等分する。 */
function scriptHues(scripts: readonly string[]): { hasLatin: boolean; hues: Map<string, number> } {
  const unique = [...new Set(scripts)];
  const nonLatin = unique.filter((name) => name !== 'Latin').sort();
  const count = nonLatin.length;
  const hues = new Map<string, number>();
  nonLatin.forEach((name, index) => {
    hues.set(name, (360 * index) / count);
  });
  return { hasLatin: unique.includes('Latin'), hues };
}

/**
 * 文字種名ごとに前景色を決める。
 * Latin は黒。それ以外は文字種名の符号単位順で色相を等分する。
 */
export function foregroundColors(scripts: readonly string[]): Map<string, string> {
  const { hasLatin, hues } = scriptHues(scripts);
  const colors = new Map<string, string>();
  if (hasLatin) {
    colors.set('Latin', 'rgb(0, 0, 0)');
  }
  for (const [name, hue] of hues) {
    colors.set(name, hsvToRgb(hue));
  }
  return colors;
}

/**
 * 文字種名ごとに背景色を決める。
 * Latin は #eee。それ以外は前景色と同じ色相で、S=0.1, V=1.0。
 */
export function backgroundColors(scripts: readonly string[]): Map<string, string> {
  const { hasLatin, hues } = scriptHues(scripts);
  const colors = new Map<string, string>();
  if (hasLatin) {
    colors.set('Latin', '#eee');
  }
  for (const [name, hue] of hues) {
    colors.set(name, hsvToRgb(hue, 0.1, 1));
  }
  return colors;
}
