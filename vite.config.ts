import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const virtualHttps = 'virtual-https:';

/** `https://` のモジュール指定子を取得して束ねる。 */
function httpsModulePlugin() {
  return {
    name: 'https-module',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id.startsWith(virtualHttps)) {
        return id;
      }
      if (id.startsWith('https://')) {
        return virtualHttps + encodeURIComponent(id);
      }
      return null;
    },
    async load(id: string) {
      if (!id.startsWith(virtualHttps)) {
        return null;
      }
      const url = decodeURIComponent(id.slice(virtualHttps.length));
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${response.status} ${url}`);
      }
      const code = await response.text();
      return code.replace(
        /(from\s+|import\s*\(\s*|import\s+)(['"])(\/[^'"]+)\2/g,
        (_match, lead: string, quote: string, spec: string) =>
          `${lead}${quote}${new URL(spec, response.url).href}${quote}`,
      );
    },
    transform(code: string) {
      if (!code.includes('https://')) {
        return null;
      }
      const replaced = code.replace(
        /(from\s+|import\s*\(\s*|import\s+)(['"])(https:\/\/[^'"]+)\2/g,
        (_match, lead: string, quote: string, spec: string) =>
          `${lead}${quote}${virtualHttps}${encodeURIComponent(spec)}${quote}`,
      );
      if (replaced === code) {
        return null;
      }
      return replaced;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [httpsModulePlugin(), vue()],
  test: {
    environment: 'node',
    pool: 'forks',
  },
})
