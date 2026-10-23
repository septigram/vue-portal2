import Encoding from 'https://esm.sh/encoding-japanese';

/**
 * Windows-31J に含まれる符号位置の SJIS コードを返す。
 * UNICODE から SJIS へ変換し、同じバイト列を戻した文字が元と一致するときだけ採用する。
 */
export function sjisCode(codePoint: number): string | null {
  const text = String.fromCodePoint(codePoint);
  const unicodeArray = Encoding.stringToCode(text);
  let sjisBytes: number[];
  try {
    sjisBytes = Encoding.convert(unicodeArray, {
      to: 'SJIS',
      from: 'UNICODE',
      fallback: 'error',
    });
  } catch {
    return null;
  }
  const restored = Encoding.convert(sjisBytes, {
    to: 'UNICODE',
    from: 'SJIS',
    type: 'string',
  });
  if (restored !== text) {
    return null;
  }
  return sjisBytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join('');
}
