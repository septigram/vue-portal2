import { describe, expect, it } from 'vitest';
import { segment } from './segment';

const representative = String.fromCodePoint(0x61, 0x6d, 0x430, 0x7a, 0x6f, 0x6e);

describe('segment', () => {
  it('空文字列の結果は空である', () => {
    expect(segment('')).toEqual([]);
  });

  it('代表例は 6 個の符号位置であり、3 番目は U+0430 である', () => {
    const tokens = segment(representative);
    expect(tokens).toHaveLength(6);
    expect(tokens[2]).toEqual({ kind: 'char', codePoint: 0x430 });
  });

  it('U+000A は改行であり、その前後の符号位置は分かれる', () => {
    expect(segment('a\nb')).toEqual([
      { kind: 'char', codePoint: 0x61 },
      { kind: 'break' },
      { kind: 'char', codePoint: 0x62 },
    ]);
  });

  it('U+000D U+000A では、U+000D が一つの符号位置、U+000A が改行である', () => {
    expect(segment('a\r\nb')).toEqual([
      { kind: 'char', codePoint: 0x61 },
      { kind: 'char', codePoint: 0x0d },
      { kind: 'break' },
      { kind: 'char', codePoint: 0x62 },
    ]);
  });

  it('U+0065 U+0301 は二つの符号位置である', () => {
    expect(segment('e\u0301')).toEqual([
      { kind: 'char', codePoint: 0x65 },
      { kind: 'char', codePoint: 0x301 },
    ]);
  });

  it('U+1F600 は一つの符号位置である', () => {
    expect(segment('\u{1F600}')).toEqual([{ kind: 'char', codePoint: 0x1f600 }]);
  });
});
