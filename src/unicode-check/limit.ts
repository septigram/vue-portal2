/** 結果に使う符号位置の上限。 */
export const TEXT_LIMIT = 1000;

/** 先頭の符号位置だけを残す。上限以降は結果に使わない。 */
export function limitText(text: string): string {
  let count = 0;
  let index = 0;
  for (const character of text) {
    if (count === TEXT_LIMIT) {
      return text.slice(0, index);
    }
    count += 1;
    index += character.length;
  }
  return text;
}
