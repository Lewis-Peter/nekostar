/**
 * 全站占位符集中在这个文件里。
 *
 * 约定：值为 null = 尚未确定。组件遇到 null 时不会渲染死链接，
 * 并且 `pnpm build` 结束时会列出所有还没填的项（见 astro.config.mjs）。
 * 上线前把这里填完、构建时不再有警告，就说明没有漏网的占位内容。
 */

export const SITE = {
  /** 页脚署名、about 页使用；站名是 Nekostar，作者是 Lewis，两者分开 */
  author: 'Lewis',
  /** <title> 与首页 h1，和域名保持同一个词 */
  name: 'Nekostar',
  /** 页眉左上角 */
  logo: 'Nekostar',
  description: '硬件、安全与 Linux 内核方向的研究和实践。',
  /** 只影响 sitemap 和绝对链接；域名换了改这一行 */
  origin: 'https://nekostar.blog',
  /**
   * 社交分享预览图，放在 public/ 下的路径，例如 '/og.png'。
   * 建议 1200×630 的 PNG/JPG（各平台基本不支持 SVG）。
   * 为 null 时只输出 summary 卡片，不会输出坏图链接。
   */
  ogImage: null as string | null
};

export const LINKS: Record<string, string | null> = {
  github: 'https://github.com/Lewis-Peter',
  email: null
};

/** 留空则文章页不加载 giscus，只显示一行说明，不会在控制台报错 */
export const GISCUS: Record<string, string | null> = {
  repo: null,
  repoId: null,
  category: 'Announcements',
  categoryId: null
};

/**
 * AI API 服务。服务本身是独立站点，价格、模型列表和接入文档都在那边，
 * 博客只负责推荐，所以这里只需要一个出口地址。
 */
export const API_SERVICE: Record<string, string | null> = {
  /** 服务站主页。填上之后 /tools 会出现出口链接 */
  site: 'https://herosub2.moira-e.com'
};

/** 构建时用来提示哪些占位还没填 */
export function pendingPlaceholders() {
  const groups: Record<string, Record<string, string | null>> = {
    SITE: { ogImage: SITE.ogImage },
    LINKS,
    GISCUS,
    API_SERVICE
  };
  const pending: string[] = [];
  for (const [group, values] of Object.entries(groups)) {
    for (const [key, value] of Object.entries(values)) {
      if (value === null) pending.push(`${group}.${key}`);
    }
  }
  return pending;
}
