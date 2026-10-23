import { describe, expect, it } from 'vitest';
import { sjisCode } from './sjis';

describe('sjisCode', () => {
  it('U+0061 は 61 である', () => {
    expect(sjisCode(0x61)).toBe('61');
  });

  it('U+0430 は 8470 である', () => {
    expect(sjisCode(0x430)).toBe('8470');
  });

  it('U+3042 は 82A0 である', () => {
    expect(sjisCode(0x3042)).toBe('82A0');
  });

  it('U+FF5E は 8160 である', () => {
    expect(sjisCode(0xff5e)).toBe('8160');
  });

  it('U+301C は SJIS コードを持たない', () => {
    expect(sjisCode(0x301c)).toBeNull();
  });

  it('U+1F363 は SJIS コードを持たない', () => {
    expect(sjisCode(0x1f363)).toBeNull();
  });
});
