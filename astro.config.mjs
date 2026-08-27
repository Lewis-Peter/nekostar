import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE, pendingPlaceholders } from './src/site.config';
import { codeThemeLight, codeThemeDark } from './src/lib/code-theme';

/**
 * 读出各文章的发布日期，给 sitemap 的 lastmod 用。
 *
 * 这里没法用 getCollection——那是运行时 API，配置文件阶段还没有 Astro 上下文，
 * 所以直接读文件抠 frontmatter。只认 date 和 draft 两个字段，够用且不会因为
 * schema 以后加字段而失效。
 */
function postLastmod() {
  const dir = './src/content/posts';
  const dates = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const frontmatter = fs.readFileSync(path.join(dir, file), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) continue;
    const [, fm] = frontmatter;
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    const raw = fm.match(/^date:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
    const date = raw && new Date(raw);
    if (!date || Number.isNaN(date.valueOf())) continue;
    dates.set(`/posts/${file.replace(/\.mdx?$/, '')}/`, date);
  }
  return dates;
}

/** 构建结束时列出 src/site.config.ts 里还没填的占位项。 */
function placeholderReport() {
  return {
    name: 'placeholder-report',
    hooks: {
      'astro:build:done': ({ logger }) => {
        const pending = pendingPlaceholders();
        if (pending.length === 0) return;
        logger.warn(`还有 ${pending.length} 处占位未填写（src/site.config.ts）：`);
        for (const key of pending) logger.warn(`  · ${key}`);
      }
    }
  };
}

const lastmodByPath = postLastmod();
const newestPost = [...lastmodByPath.values()].sort((a, b) => b - a)[0] ?? null;
/** 这些页面的内容由文章列表决定，最后修改时间跟着最新一篇走 */
const LISTING_PATHS = new Set(['/', '/posts/']);

export default defineConfig({
  site: SITE.origin,
  integrations: [
    mdx(),
    sitemap({
      // 标签页默认不进 sitemap，和页面上的 noindex 共用 SITE.indexTagPages 这一个开关
      filter: (page) => SITE.indexTagPages || !new URL(page).pathname.startsWith('/tags/'),
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        // 首页和归档页跟着最新一篇文章走；文章页用自己的发布日期
        const lastmod = lastmodByPath.get(pathname) ?? (LISTING_PATHS.has(pathname) ? newestPost : null);
        if (lastmod) item.lastmod = lastmod.toISOString();
        return item;
      }
    }),
    placeholderReport()
  ],
  vite: {
    // 经 Cloudflare Tunnel 访问时，Vite 会按 Host 头拦截陌生域名，dev 和 preview 都要放行
    server: { allowedHosts: ['nekostar.blog'] },
    preview: { allowedHosts: ['nekostar.blog'] }
  },
  markdown: {
    shikiConfig: {
      // 自定义配色，见 src/lib/code-theme.ts：内置主题在本站底色上对比度普遍不达标
      themes: {
        light: codeThemeLight,
        dark: codeThemeDark
      },
      defaultColor: false,
      wrap: true
    }
  }
});
