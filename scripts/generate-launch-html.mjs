import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const distDir = resolve(repoRoot, 'dist');
const distHtmlPath = resolve(distDir, 'index.html');
const launchPath = resolve(repoRoot, 'launch.html');

const html = await readFile(distHtmlPath, 'utf8');

const stylesheetMatch = html.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/i);
const scriptMatch = html.match(/<script type="module"[^>]*src="([^"]+\.js)"[^>]*><\/script>/i);

if (!stylesheetMatch || !scriptMatch) {
  throw new Error('Could not find built CSS/JS assets in dist/index.html');
}

const cssPath = resolve(distDir, stylesheetMatch[1].replace(/^\//, ''));
const jsPath = resolve(distDir, scriptMatch[1].replace(/^\//, ''));

const css = await readFile(cssPath, 'utf8');
const js = await readFile(jsPath, 'utf8');

const standaloneHtml = html
  .replace(/<link rel="icon"[^>]*>\s*/i, '')
  .replace(stylesheetMatch[0], () => `<style>\n${css}\n</style>`)
  .replace(scriptMatch[0], () => `<script type="module">\n${js}\n</script>`);

await writeFile(launchPath, standaloneHtml);
