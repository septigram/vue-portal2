/** 色分けとホバーの単位。U+000A だけを改行として分ける。 */
export type Token =
  | { kind: 'break' }
  | { kind: 'char'; codePoint: number };

/** 文字列を符号位置と改行の列へ分ける。 */
export function segment(text: string): Token[] {
  const tokens: Token[] = [];
  for (const character of text) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }
    if (codePoint === 0x0a) {
      tokens.push({ kind: 'break' });
    } else {
      tokens.push({ kind: 'char', codePoint });
    }
  }
  return tokens;
}
