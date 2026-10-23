import {
  getCategory,
  isAlphabetic,
  isBaseForm,
  isDigit,
  isLowerCase,
  isMark,
  isPunctuation,
  isTitleCase,
  isUpperCase,
  isWhiteSpace,
} from 'unicode-properties';

/** ホバーに出す unicode-properties の結果。 */
export interface PropertyLine {
  name: string;
  value: string;
}

/** 符号位置について、category と各判定の結果を順に返す。 */
export function characterProperties(codePoint: number): PropertyLine[] {
  const flag = (value: boolean) => (value ? 'true' : 'false');
  return [
    { name: 'category', value: getCategory(codePoint) },
    { name: 'isAlphabetic', value: flag(isAlphabetic(codePoint)) },
    { name: 'isDigit', value: flag(isDigit(codePoint)) },
    { name: 'isPunctuation', value: flag(isPunctuation(codePoint)) },
    { name: 'isLowerCase', value: flag(isLowerCase(codePoint)) },
    { name: 'isUpperCase', value: flag(isUpperCase(codePoint)) },
    { name: 'isTitleCase', value: flag(isTitleCase(codePoint)) },
    { name: 'isWhiteSpace', value: flag(isWhiteSpace(codePoint)) },
    { name: 'isBaseForm', value: flag(isBaseForm(codePoint)) },
    { name: 'isMark', value: flag(isMark(codePoint)) },
  ];
}
