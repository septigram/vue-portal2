import { describe, expect, it } from 'vitest';
import { unicodeNotation } from './unicode-notation';

describe('unicodeNotation', () => {
  it('U+0430 は &#x430; である', () => {
    expect(unicodeNotation(0x430)).toBe('&#x430;');
  });

  it('U+0061 は &#x61; である', () => {
    expect(unicodeNotation(0x61)).toBe('&#x61;');
  });

  it('U+1F600 は &#x1f600; である', () => {
    expect(unicodeNotation(0x1f600)).toBe('&#x1f600;');
  });
});
