import { getScript } from 'unicode-properties';

/** 符号位置の文字種名を返す。 */
export function scriptOf(codePoint: number): string {
  return getScript(codePoint);
}
