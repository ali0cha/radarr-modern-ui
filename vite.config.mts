import path from 'path';
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import react from '@vitejs/plugin-react';
import { defineConfig, transformWithOxc, type Plugin } from 'vite';
import { patchCssModules } from 'vite-css-modules';

const src = path.resolve(import.meta.dirname, 'frontend/src');
const outDir = path.resolve(import.meta.dirname, '_output/UI');

const contentDir = path.join(src, 'Content');

function htmlFiles() {
  return readdirSync(src).filter((name) => name.endsWith('.html'));
}

// Static files that are not part of the module graph (fonts, images,
// manifest, login pages, ...) are copied as-is next to the bundle.
function copyStaticContent(): Plugin {
  function copyAll() {
    mkdirSync(outDir, { recursive: true });

    cpSync(contentDir, path.join(outDir, 'Content'), { recursive: true });

    for (const file of htmlFiles()) {
      cpSync(path.join(src, file), path.join(outDir, file));
    }

    // The login and logout pages are served by the backend, and they link to
    // the styles of the app as Content/styles.css, which the old build wrote.
    const assetsDir = path.join(outDir, 'assets');
    const styles = readdirSync(assetsDir)
      .filter((name) => name.endsWith('.css'))
      .sort()
      .map((name) => readFileSync(path.join(assetsDir, name), 'utf8'))
      .join('\n');

    writeFileSync(path.join(outDir, 'Content', 'styles.css'), styles);
  }

  return {
    name: 'copy-static-content',

    buildStart() {
      for (const file of htmlFiles()) {
        this.addWatchFile(path.join(src, file));
      }

      this.addWatchFile(contentDir);
    },

    closeBundle() {
      copyAll();
    },
  };
}

// Vite only parses JSX in .jsx/.tsx files. Much of the frontend is still
// JavaScript with JSX, so transform those files here until they are converted
// to TypeScript.
function jsxInJavaScript(): Plugin {
  return {
    name: 'jsx-in-javascript',
    enforce: 'pre',

    async transform(code, id) {
      if (!id.startsWith(src) || !id.endsWith('.js')) {
        return null;
      }

      return transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: { runtime: 'automatic' },
      });
    },
  };
}

// Imports such as 'Components/Link/Button' resolve relative to frontend/src,
// which webpack handled with `resolve.modules`.
const srcAliases = Object.fromEntries(
  readdirSync(src, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [entry.name, path.join(src, entry.name)])
);

export default defineConfig({
  plugins: [
    patchCssModules({ exportMode: 'default' }),
    jsxInJavaScript(),
    react(),
    copyStaticContent(),
  ],

  base: '/',

  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },

  build: {
    outDir,
    emptyOutDir: true,
    target: 'esnext',
    sourcemap: true,
  },

  experimental: {
    // The backend rewrites url base in index.html, every other asset is
    // resolved relative to the file that references it.
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'html') {
        return `/${filename}`;
      }

      return { relative: true };
    },
  },

  optimizeDeps: {
    exclude: ['moment'],
  },

  resolve: {
    alias: {
      ...srcAliases,
      jquery: 'jquery/dist/jquery.min.js',
    },
  },

  css: {
    postcss: path.resolve(import.meta.dirname, 'frontend'),
    modules: {
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
    lightningcss: {
      // Some stylesheets contain selectors that browsers already ignore, such
      // as `.top::after.default` in Tooltip. Drop them instead of failing.
      errorRecovery: true,
    },
  },
});
