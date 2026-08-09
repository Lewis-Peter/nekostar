import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE, pendingPlaceholders } from './src/site.config';
import { codeThemeLight, codeThemeDark } from './src/lib/code-theme';

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

export default defineConfig({
  site: SITE.origin,
  integrations: [mdx(), sitemap(), placeholderReport()],
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
