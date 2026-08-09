import { createHash } from 'node:crypto';
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const PUBLIC_FONT_DIR = path.join(ROOT, 'public/fonts/noto-serif-sc');
const DIST_FONT_DIR = path.join(DIST_DIR, 'fonts/noto-serif-sc');
const FONT_CSS_PATH = path.join(ROOT, 'src/styles/fonts.css');
const GLOBAL_CSS_PATH = path.join(ROOT, 'src/styles/global.css');
const MANIFEST_PATH = path.join(ROOT, 'scripts/noto-serif-sc-subset.json');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const WEIGHTS = [300, 400];
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr'
]);

function decodeEntities(value) {
  const named = new Map([
    ['amp', '&'], ['apos', "'"], ['gt', '>'], ['lt', '<'], ['nbsp', '\u00a0'], ['quot', '"']
  ]);

  return value.replace(/&(#(?:x[\da-f]+|\d+)|[a-z][\da-z]+);/gi, (entity, name) => {
    if (name[0] === '#') {
      const hex = name[1]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
      try {
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
      } catch {
        return entity;
      }
    }
    return named.get(name.toLowerCase()) ?? entity;
  });
}

function readClassNames(attributes) {
  const match = attributes.match(/(?:^|\s)class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return new Set((match?.[1] ?? match?.[2] ?? match?.[3] ?? '').split(/\s+/).filter(Boolean));
}

function extractSerifText(html, serifTags, serifClasses) {
  const stack = [];
  let activeMatches = 0;
  let rawTag = null;
  let output = '';
  const tokens = html.match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g) ?? [];

  for (const token of tokens) {
    if (rawTag) {
      const closing = token.match(/^<\/\s*([\w:-]+)/);
      if (closing?.[1].toLowerCase() === rawTag) {
        const frame = stack.pop();
        if (frame?.matches) activeMatches -= 1;
        rawTag = null;
      }
      continue;
    }

    if (!token.startsWith('<')) {
      if (activeMatches > 0) output += decodeEntities(token);
      continue;
    }
    if (token.startsWith('<!--') || token.startsWith('<!')) continue;

    const closing = token.match(/^<\/\s*([\w:-]+)/);
    if (closing) {
      const tag = closing[1].toLowerCase();
      while (stack.length > 0) {
        const frame = stack.pop();
        if (frame.matches) activeMatches -= 1;
        if (frame.tag === tag) break;
      }
      continue;
    }

    const opening = token.match(/^<\s*([\w:-]+)([\s\S]*?)\/?\s*>$/);
    if (!opening) continue;
    const tag = opening[1].toLowerCase();
    const classes = readClassNames(opening[2]);
    const matches = serifTags.has(tag) || [...classes].some((name) => serifClasses.has(name));
    const selfClosing = /\/\s*>$/.test(token) || VOID_ELEMENTS.has(tag);

    if (matches) activeMatches += 1;
    if (!selfClosing) {
      stack.push({ tag, matches });
      if (tag === 'script' || tag === 'style') rawTag = tag;
    } else if (matches) {
      activeMatches -= 1;
    }
  }

  return output;
}

async function findFiles(directory, extension) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findFiles(fullPath, extension));
    else if (entry.isFile() && entry.name.endsWith(extension)) files.push(fullPath);
  }
  return files;
}

async function getSerifTargets() {
  const css = (await readFile(GLOBAL_CSS_PATH, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  const tags = new Set();
  const classes = new Set();
  const selectors = [];

  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/font-family\s*:\s*var\(\s*--font-serif\s*\)/.test(match[2])) continue;
    for (const rawSelector of match[1].split(',')) {
      const selector = rawSelector.trim();
      if (/^h[1-4]$/i.test(selector)) tags.add(selector.toLowerCase());
      else if (/^\.[\w-]+$/.test(selector)) classes.add(selector.slice(1));
      else throw new Error(`Unsupported serif selector in global.css: ${selector}`);
      selectors.push(selector);
    }
  }

  if (selectors.length === 0) throw new Error('No var(--font-serif) selectors found in global.css');
  return { tags, classes, selectors: [...new Set(selectors)].sort() };
}

async function collectCharacters(targets) {
  const htmlFiles = await findFiles(DIST_DIR, '.html');
  const characters = new Set();

  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, 'utf8');
    const text = extractSerifText(html, targets.tags, targets.classes);
    for (const character of text) {
      if (!/\s/u.test(character)) characters.add(character);
    }
  }

  return [...characters]
    .sort((left, right) => left.codePointAt(0) - right.codePointAt(0))
    .join('');
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function fileExists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

function googleCssUrl(characters) {
  const url = new URL('https://fonts.googleapis.com/css2');
  url.searchParams.set('family', 'Noto Serif SC:wght@300;400');
  url.searchParams.set('text', characters);
  url.searchParams.set('display', 'swap');
  return url;
}

async function fetchExactSubsets(characters) {
  const cssUrl = googleCssUrl(characters);
  const cssResponse = await fetch(cssUrl, { headers: { 'user-agent': USER_AGENT } });
  if (!cssResponse.ok) throw new Error(`Google Fonts CSS returned HTTP ${cssResponse.status}`);
  const googleCss = await cssResponse.text();
  const remoteUrls = new Map();

  for (const block of googleCss.match(/@font-face\s*\{[^{}]*\}/g) ?? []) {
    const weight = Number(block.match(/font-weight\s*:\s*(300|400)/)?.[1]);
    const remoteUrl = block.match(/src\s*:\s*url\((['"]?)(https:\/\/[^)'"]+)\1\)\s*format\((['"])woff2\3\)/)?.[2];
    if (WEIGHTS.includes(weight) && remoteUrl) remoteUrls.set(weight, remoteUrl);
  }

  if (WEIGHTS.some((weight) => !remoteUrls.has(weight))) {
    throw new Error('Google Fonts CSS did not contain WOFF2 sources for both requested weights');
  }

  const downloads = new Map();
  await Promise.all([...new Set(remoteUrls.values())].map(async (remoteUrl) => {
    const response = await fetch(remoteUrl, { headers: { 'user-agent': USER_AGENT } });
    if (!response.ok) throw new Error(`Google Fonts file returned HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    if (data.subarray(0, 4).toString('ascii') !== 'wOF2') {
      throw new Error('Google Fonts returned a font that is not WOFF2');
    }
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    downloads.set(remoteUrl, {
      data,
      file: `noto-serif-sc-subset.${hash}.woff2`,
      bytes: data.byteLength
    });
  }));

  return {
    cssUrl: cssUrl.href,
    fonts: Object.fromEntries(WEIGHTS.map((weight) => [weight, downloads.get(remoteUrls.get(weight))]))
  };
}

function fontFaces(files, { minified = false } = {}) {
  if (minified) {
    return WEIGHTS.map((weight) =>
      `@font-face{font-family:"Noto Serif SC";font-style:normal;font-weight:${weight};font-display:swap;src:url(/fonts/noto-serif-sc/${files[weight]}) format("woff2")}`
    ).join('');
  }

  return WEIGHTS.map((weight) => `/* Noto Serif SC ${weight} — exact build-time subset */
@font-face {
  font-family: 'Noto Serif SC';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(/fonts/noto-serif-sc/${files[weight]}) format('woff2');
}`).join('\n\n');
}

function sourceFontCss(files) {
  return `/*
 * Self-hosted WOFF2 faces. Noto Serif SC is reduced after each Astro build
 * to the exact characters used by serif-rendered elements in dist HTML.
 */

/* JetBrains Mono 400 — latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/fonts/jetbrains-mono/jetbrains-mono-latin-400.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

${fontFaces(files)}
`;
}

const NOTO_FACE_PATTERN = /@font-face\s*\{(?=[^{}]*font-family\s*:\s*(['"]?)Noto Serif SC\1\s*;)[^{}]*\}/g;

async function prepareBuiltCss(files) {
  const cssFiles = await findFiles(DIST_DIR, '.css');
  const replacements = [];

  for (const cssPath of cssFiles) {
    const css = await readFile(cssPath, 'utf8');
    const oldFaces = css.match(NOTO_FACE_PATTERN);
    if (!oldFaces) continue;
    const nextCss = fontFaces(files, { minified: true }) + css.replace(NOTO_FACE_PATTERN, '');
    const contentHash = createHash('sha256').update(nextCss).digest('hex').slice(0, 12);
    const oldName = path.basename(cssPath);
    const stem = oldName.slice(0, -4).replace(/\.[\w-]{8,}$/, '');
    const nextName = `${stem}.${contentHash}.css`;
    replacements.push({
      oldCssPath: cssPath,
      nextCssPath: path.join(path.dirname(cssPath), nextName),
      oldName,
      nextName,
      nextCss,
      oldFaceCount: oldFaces.length
    });
  }

  if (replacements.length === 0) {
    throw new Error('Could not find bundled Noto Serif SC @font-face rules in dist CSS');
  }
  return replacements;
}

async function prepareBuiltHtml(cssReplacements) {
  const htmlFiles = await findFiles(DIST_DIR, '.html');
  const replacements = [];

  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, 'utf8');
    const nextHtml = cssReplacements.reduce(
      (output, css) => output.split(css.oldName).join(css.nextName),
      html
    );
    if (nextHtml !== html) replacements.push({ htmlPath, nextHtml });
  }

  if (replacements.length === 0) {
    throw new Error('Could not find the bundled CSS filename in dist HTML');
  }
  return replacements;
}

async function removeStaleFontFiles(directory, keepFiles) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'OFL.txt' || keepFiles.has(entry.name)) continue;
    await rm(path.join(directory, entry.name), { recursive: true, force: true });
  }
}

function warnSubsetNotUpdated(error, changed) {
  const border = '!'.repeat(78);
  console.warn(`\n${border}`);
  console.warn('WARNING: NOTO SERIF SC EXACT SUBSET WAS NOT UPDATED');
  console.warn(changed
    ? 'The serif character set changed, but the Google Fonts request failed.'
    : 'A required local subset file is missing, and the Google Fonts request failed.');
  console.warn(`Reason: ${error.message}`);
  console.warn('Existing font files and CSS were kept. New title characters may fall back');
  console.warn('to the system serif font. The build will continue.');
  console.warn(`${border}\n`);
}

async function main() {
  const targets = await getSerifTargets();
  const characters = await collectCharacters(targets);
  const manifest = await readManifest();
  const forceUpdate = process.argv.includes('--force');
  const previousFiles = manifest?.files ?? {};
  const expectedFiles = [...new Set(WEIGHTS.map((weight) => previousFiles[weight]).filter(Boolean))];
  const charactersChanged = manifest?.characters !== characters;
  const filesExist = expectedFiles.length > 0 &&
    (await Promise.all(expectedFiles.map((file) => fileExists(path.join(PUBLIC_FONT_DIR, file))))).every(Boolean);

  console.log(`[serif subset] selectors: ${targets.selectors.join(', ')}`);
  console.log(`[serif subset] ${[...characters].length} unique non-whitespace characters from dist HTML`);

  if (!forceUpdate && !charactersChanged && filesExist) {
    await mkdir(DIST_FONT_DIR, { recursive: true });
    await Promise.all(expectedFiles.map((file) =>
      copyFile(path.join(PUBLIC_FONT_DIR, file), path.join(DIST_FONT_DIR, file))
    ));
    console.log('[serif subset] character set unchanged; reused existing hashed WOFF2 file(s)');
    return;
  }

  let subset;
  try {
    subset = await fetchExactSubsets(characters);
  } catch (error) {
    warnSubsetNotUpdated(error, charactersChanged);
    return;
  }

  const files = Object.fromEntries(WEIGHTS.map((weight) => [weight, subset.fonts[weight].file]));
  const uniqueFonts = new Map(WEIGHTS.map((weight) => [subset.fonts[weight].file, subset.fonts[weight]]));
  const builtCss = await prepareBuiltCss(files);
  const builtHtml = await prepareBuiltHtml(builtCss);
  const keepFiles = new Set(uniqueFonts.keys());

  await mkdir(PUBLIC_FONT_DIR, { recursive: true });
  await mkdir(DIST_FONT_DIR, { recursive: true });
  for (const [file, font] of uniqueFonts) {
    await writeFile(path.join(PUBLIC_FONT_DIR, file), font.data);
    await writeFile(path.join(DIST_FONT_DIR, file), font.data);
  }
  for (const replacement of builtCss) {
    await writeFile(replacement.nextCssPath, replacement.nextCss);
  }
  for (const replacement of builtHtml) {
    await writeFile(replacement.htmlPath, replacement.nextHtml);
  }
  for (const replacement of builtCss) {
    if (replacement.oldCssPath !== replacement.nextCssPath) {
      await rm(replacement.oldCssPath);
    }
  }
  await writeFile(FONT_CSS_PATH, sourceFontCss(files));
  await writeFile(MANIFEST_PATH, `${JSON.stringify({
    family: 'Noto Serif SC',
    weights: WEIGHTS,
    selectors: targets.selectors,
    characters,
    characterCount: [...characters].length,
    files,
    bytes: Object.fromEntries(WEIGHTS.map((weight) => [weight, subset.fonts[weight].bytes])),
    css2: subset.cssUrl
  }, null, 2)}\n`);
  await removeStaleFontFiles(PUBLIC_FONT_DIR, keepFiles);
  await removeStaleFontFiles(DIST_FONT_DIR, keepFiles);

  const totalBytes = [...uniqueFonts.values()].reduce((sum, font) => sum + font.bytes, 0);
  const replacedFaces = builtCss.reduce((sum, item) => sum + item.oldFaceCount, 0);
  console.log(`[serif subset] wrote ${uniqueFonts.size} content-hashed WOFF2 file(s), ${totalBytes} bytes total`);
  console.log(`[serif subset] replaced ${replacedFaces} bundled @font-face rule(s); public and dist are in sync`);
}

await main();
