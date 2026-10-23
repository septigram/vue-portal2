import { describe, expect, it } from 'vitest';
import { limitText, TEXT_LIMIT } from './limit';

describe('limitText', () => {
  it('空文字列と上限以内の文字列はそのまま返す', () => {
    expect(limitText('')).toBe('');
    expect(limitText('a'.repeat(TEXT_LIMIT))).toBe('a'.repeat(TEXT_LIMIT));
  });

  it('上限を超えた符号位置は捨てる', () => {
    expect(limitText('a'.repeat(TEXT_LIMIT) + 'Z')).toBe('a'.repeat(TEXT_LIMIT));
  });

  it('絵文字は一つの符号位置として数える', () => {
    const emoji = '\u{1F600}';
    expect(limitText(emoji.repeat(TEXT_LIMIT) + 'Z')).toBe(emoji.repeat(TEXT_LIMIT));
    expect(limitText('a'.repeat(TEXT_LIMIT - 1) + emoji + 'Z')).toBe('a'.repeat(TEXT_LIMIT - 1) + emoji);
  });

  it('U+000A も一つの符号位置として数える', () => {
    expect(limitText('a'.repeat(TEXT_LIMIT - 1) + '\nZ')).toBe('a'.repeat(TEXT_LIMIT - 1) + '\n');
  });
});
