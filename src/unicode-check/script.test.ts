import { describe, expect, it } from 'vitest';
import { scriptOf } from './script';

describe('scriptOf', () => {
  it('代表例の Latin 文字は Latin である', () => {
    for (const codePoint of [0x61, 0x6d, 0x7a, 0x6f, 0x6e]) {
      expect(scriptOf(codePoint)).toBe('Latin');
    }
  });

  it('U+0430 は Cyrillic である', () => {
    expect(scriptOf(0x430)).toBe('Cyrillic');
  });
});
