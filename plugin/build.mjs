import * as esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const watch = process.argv.includes('--watch');

/** @type {esbuild.BuildOptions} */
const codeOptions = {
  entryPoints: ['src/code.ts'],
  bundle: true,
  format: 'iife',
  target: 'es2017',
  outfile: 'dist/code.js',
  logLevel: 'info',
};

/** @type {esbuild.BuildOptions} */
const uiOptions = {
  entryPoints: ['src/ui/main.tsx'],
  bundle: true,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  target: 'es2017',
  outdir: 'dist',
  write: false, // kept in memory, inlined into dist/ui.html below
  logLevel: 'info',
};

/** Inline the in-memory JS + CSS bundles into the HTML template → dist/ui.html. */
async function writeUiHtml(outputFiles) {
  const js = outputFiles.find((f) => f.path.endsWith('.js'))?.text ?? '';
  const css = outputFiles.find((f) => f.path.endsWith('.css'))?.text ?? '';
  const template = await readFile('src/ui/index.html', 'utf8');
  const html = template
    .replace('<!-- INLINE_CSS -->', () => `<style>\n${css}</style>`)
    .replace('<!-- INLINE_JS -->', () => `<script>\n${js}</script>`);
  await mkdir('dist', { recursive: true });
  await writeFile('dist/ui.html', html);
  console.log(`  dist/ui.html  ${(html.length / 1024).toFixed(1)}kb (self-contained)`);
}

const inlineHtmlPlugin = {
  name: 'inline-html',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length === 0 && result.outputFiles) {
        await writeUiHtml(result.outputFiles);
      }
    });
  },
};

if (watch) {
  const codeCtx = await esbuild.context(codeOptions);
  const uiCtx = await esbuild.context({ ...uiOptions, plugins: [inlineHtmlPlugin] });
  await Promise.all([codeCtx.watch(), uiCtx.watch()]);
  console.log('watching src/ …');
} else {
  await esbuild.build(codeOptions);
  const result = await esbuild.build(uiOptions);
  await writeUiHtml(result.outputFiles);
}
