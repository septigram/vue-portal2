import { describe, expect, it } from 'vitest';
import { characterProperties } from './properties';

function valueOf(codePoint: number, name: string): string {
  const line = characterProperties(codePoint).find((item) => item.name === name);
  if (!line) {
    throw new Error(name);
  }
  return line.value;
}

describe('characterProperties', () => {
  it('U+0430 は Cyrillic の小文字である', () => {
    expect(characterProperties(0x430).map((item) => item.name)).toEqual([
      'category',
      'eastAsianWidth',
      'isAlphabetic',
      'isDigit',
      'isPunctuation',
      'isLowerCase',
      'isUpperCase',
      'isTitleCase',
      'isWhiteSpace',
      'isBaseForm',
      'isMark',
    ]);
    expect(valueOf(0x430, 'category')).toBe('Ll');
    expect(valueOf(0x430, 'eastAsianWidth')).toBe('A');
    expect(valueOf(0x430, 'isAlphabetic')).toBe('true');
    expect(valueOf(0x430, 'isDigit')).toBe('false');
    expect(valueOf(0x430, 'isPunctuation')).toBe('false');
    expect(valueOf(0x430, 'isLowerCase')).toBe('true');
    expect(valueOf(0x430, 'isUpperCase')).toBe('false');
    expect(valueOf(0x430, 'isTitleCase')).toBe('false');
    expect(valueOf(0x430, 'isWhiteSpace')).toBe('false');
    expect(valueOf(0x430, 'isBaseForm')).toBe('true');
    expect(valueOf(0x430, 'isMark')).toBe('false');
  });

  it('U+0030 は数字である', () => {
    expect(valueOf(0x30, 'isDigit')).toBe('true');
    expect(valueOf(0x30, 'isAlphabetic')).toBe('false');
  });

  it('U+0020 は空白である', () => {
    expect(valueOf(0x20, 'isWhiteSpace')).toBe('true');
  });

  it('半角の A は Na、全角のＡは F である', () => {
    expect(valueOf(0x41, 'eastAsianWidth')).toBe('Na');
    expect(valueOf(0xff21, 'eastAsianWidth')).toBe('F');
  });
});
