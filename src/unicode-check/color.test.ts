import { describe, expect, it } from 'vitest';
import { backgroundColors, foregroundColors } from './color';

describe('foregroundColors', () => {
  it('文字種が Latin だけのとき、前景色は黒である', () => {
    expect(foregroundColors(['Latin']).get('Latin')).toBe('rgb(0, 0, 0)');
  });

  it('Latin と Cyrillic では Cyrillic の色相が 0 度である', () => {
    const colors = foregroundColors(['Latin', 'Cyrillic']);
    expect(colors.get('Latin')).toBe('rgb(0, 0, 0)');
    expect(colors.get('Cyrillic')).toBe('rgb(179, 89, 89)');
  });

  it('Common が Cyrillic より前の色相になる', () => {
    const colors = foregroundColors(['Cyrillic', 'Common']);
    expect(colors.get('Common')).toBe('rgb(179, 89, 89)');
    expect(colors.get('Cyrillic')).toBe('rgb(89, 179, 179)');
  });

  it('同じ文字種名の列を再度与えても前景色は変わらない', () => {
    const first = foregroundColors(['Han', 'Latin', 'Han']);
    const second = foregroundColors(['Han', 'Latin', 'Han']);
    expect([...second.entries()]).toEqual([...first.entries()]);
  });
});

describe('backgroundColors', () => {
  it('文字種が Latin だけのとき、背景色は #eee である', () => {
    expect(backgroundColors(['Latin']).get('Latin')).toBe('#eee');
  });

  it('Latin と Cyrillic では Cyrillic の背景が色相 0 度、S=0.1、V=1.0 である', () => {
    const colors = backgroundColors(['Latin', 'Cyrillic']);
    expect(colors.get('Latin')).toBe('#eee');
    expect(colors.get('Cyrillic')).toBe('rgb(255, 230, 230)');
  });

  it('Common が Cyrillic より前の色相になる', () => {
    const colors = backgroundColors(['Cyrillic', 'Common']);
    expect(colors.get('Common')).toBe('rgb(255, 230, 230)');
    expect(colors.get('Cyrillic')).toBe('rgb(230, 255, 255)');
  });
});
