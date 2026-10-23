declare module 'https://esm.sh/encoding-japanese' {
  interface ConvertOptions {
    to: string;
    from: string;
    type?: 'array' | 'string';
    fallback?: 'html-entity' | 'html-entity-hex' | 'ignore' | 'error';
  }

  interface EncodingStatic {
    stringToCode(input: string): number[];
    convert(data: number[], options: ConvertOptions & { type: 'string' }): string;
    convert(data: number[], options: ConvertOptions): number[];
  }

  const Encoding: EncodingStatic;
  export default Encoding;
}
