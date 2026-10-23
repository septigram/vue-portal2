/** 符号位置を `&#x` で始まる Unicode 表記にする。 */
export function unicodeNotation(codePoint: number): string {
  return `&#x${codePoint.toString(16)};`;
}
