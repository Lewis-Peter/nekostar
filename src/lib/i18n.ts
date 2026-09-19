/**
 * 双语站的语言定义与界面文案。
 *
 * 中文是默认语言，放在站点根目录（/、/posts/、/about/）；英文整体挂在 /en/ 下面。
 * 两边都是构建期渲染出来的真页面，不是靠 JS 切文案——搜索引擎只认它抓到的
 * HTML，之前那套 data-i18n 客户端切换爬虫是看不见的，英文内容等于不存在。
 */

export const LANGS = ['zh', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'zh';

/** <html lang> 与 hreflang 用的完整语言标记 */
export const HTML_LANG: Record<Lang, string> = {
  zh: 'zh-CN',
  en: 'en'
};

/** Open Graph 的 locale 写法，和 hreflang 的格式不一样，单独列一张表 */
export const OG_LOCALE: Record<Lang, string> = {
  zh: 'zh_CN',
  en: 'en_US'
};

/**
 * 给某个语言的站内路径加前缀。中文是默认语言，不带前缀，
 * 这样原有的 /posts/xxx/ 链接不会因为上了双语而全部失效。
 */
export function localizePath(lang: Lang, path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return lang === DEFAULT_LANG ? normalized : `/en${normalized === '/' ? '/' : normalized}`;
}

/** 从 URL 路径反推当前语言，供 404 之类拿不到 props 的地方使用 */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

export const SITE_DESCRIPTION: Record<Lang, string> = {
  zh: '硬件、安全与 Linux 内核方向的研究和实践。',
  en: 'Research and hands-on notes on hardware, security, and the Linux kernel.'
};

type Dict = {
  [key: string]: string;
};

const zh: Dict = {
  'nav.posts': '文章',
  'nav.about': '关于',
  'nav.aria': '主导航',
  'skip': '跳到正文',
  'home.aria': '首页',
  'footer.tagline': '保持好奇，持续折腾。',
  'controls.aria': '显示偏好',
  'controls.theme.system': '自动',
  'controls.theme.light': '浅色',
  'controls.theme.dark': '深色',
  'controls.theme.prefix': '颜色模式',
  'controls.language.action': 'Switch to English',
  'controls.language.label': 'EN',

  'home.intro': '记录硬件开发、安全研究和 Linux 内核实践，分享真正跑通过的代码与踩过的坑。',
  'home.recent': '最近文章',
  'home.empty': '还没有公开的文章。第一篇正在写，写完会出现在这里。',
  'home.focus': '关注方向',
  'home.focusValue': 'ESP32 / 嵌入式 / Linux 内核 / 安全研究 / AI 工具',
  'home.tags': '标签',
  'home.archive': '归档',
  'home.archiveEmpty': '按时间浏览 →',
  'home.subscribe': '订阅',
  'home.rss': 'RSS 订阅 →',

  'archive.title': '全部文章',
  'archive.description': '站内全部文章按时间归档。',
  'archive.empty': '还没有公开的文章。',
  'back.home': '返回首页',
  'back.posts': '返回文章列表',
  'back.allPosts': '返回全部文章',

  'tag.label': '标签',
  'tag.aria': '文章标签',

  'post.about': '约',
  'post.minRead': '分钟阅读',
  'post.translationNoteZh': '这篇文章也有英文版：',
  'post.translationNoteEn': '本文译自中文原文：',
  'post.translationLinkZh': 'Read in English',
  'post.translationLinkEn': '阅读中文原文',
  'post.onlyZh': '这篇文章暂时只有中文版。',

  'comments.title': '讨论',
  'comments.hint': '欢迎补充、勘误或分享你的实践经验。',
  'comments.pending': '评论区还没配置（见 src/site.config.ts 的 GISCUS）。',

  'about.title': '关于',
  'about.description': '关于本站作者与这份技术笔记。',
  'about.heading': '你好，我是 Lewis。',
  'about.lead': '一名关注硬件、安全与 Linux 内核的研究者，也喜欢把 AI 工具装进各种不太常见的设备里。',
  'about.workshopHeading': '关于这间数字工作室',
  'about.workshopBody': '这个博客用来记录完整的技术过程：为什么做、怎样实现、哪里失败，以及最终有哪些可以复用的结论。比起只给答案，我更希望留下推导答案的路径。',
  'about.contactHeading': '联系我',
  'about.contactBody': '欢迎讨论嵌入式开发、内核、安全研究或项目合作。',
  'about.based': '常驻',
  'about.focus': '关注',
  'about.status': '状态',
  'about.statusValue': '持续折腾中',
  'post.toc': '目次',
  'post.backToTop': '返回顶部',
  'post.backToTopShort': '顶部',
  'code.copy': '复制',
  'code.copied': '已复制',
  'image.close': '关闭 (ESC)',

  'notFound.title': '页面不存在',
  'notFound.description': '没有找到这个页面。',
  'notFound.heading': '这里什么都没有',
  'notFound.body': '链接可能拼错了，或者这篇内容还没写出来。',
  'notFound.home': '← 回首页',
  'notFound.posts': '全部文章'
};

const en: Dict = {
  'nav.posts': 'Posts',
  'nav.about': 'About',
  'nav.aria': 'Main navigation',
  'skip': 'Skip to content',
  'home.aria': 'home',
  'footer.tagline': 'Stay curious. Keep building.',
  'controls.aria': 'Display preferences',
  'controls.theme.system': 'System',
  'controls.theme.light': 'Light',
  'controls.theme.dark': 'Dark',
  'controls.theme.prefix': 'Color mode',
  'controls.language.action': '切换到中文',
  'controls.language.label': '中',

  'home.intro': 'Notes on hardware, security research, and the Linux kernel—tested code, hard-won lessons, and all.',
  'home.recent': 'Recent posts',
  'home.empty': 'No posts published yet. The first one is being written and will show up here.',
  'home.focus': 'FOCUS AREAS',
  'home.focusValue': 'ESP32 / Embedded / Linux Kernel / Security / AI Tools',
  'home.tags': 'TAGS',
  'home.archive': 'ARCHIVE',
  'home.archiveEmpty': 'Browse by date →',
  'home.subscribe': 'SUBSCRIBE',
  'home.rss': 'RSS feed →',

  'archive.title': 'All posts',
  'archive.description': 'Every post on the site, archived by date.',
  'archive.empty': 'No posts published yet.',
  'back.home': 'Back home',
  'back.posts': 'Back to posts',
  'back.allPosts': 'Back to all posts',

  'tag.label': 'Tag',
  'tag.aria': 'Post tags',

  'post.about': 'About',
  'post.minRead': 'min read',
  'post.translationNoteZh': 'An English version of this post is available: ',
  'post.translationNoteEn': 'Translated from the Chinese original: ',
  'post.translationLinkZh': 'Read in English',
  'post.translationLinkEn': '阅读中文原文',
  'post.onlyZh': 'This post is only available in Chinese for now.',

  'comments.title': 'Discussion',
  'comments.hint': 'Corrections, additions, and field notes are always welcome.',
  'comments.pending': 'Comments are not configured yet (see GISCUS in src/site.config.ts).',

  'about.title': 'About',
  'about.description': 'About the author and these engineering notes.',
  'about.heading': 'Hi, I am Lewis.',
  'about.lead': 'A researcher focused on hardware, security, and the Linux kernel—with a habit of putting AI tools on unusual devices.',
  'about.workshopHeading': 'About this digital workshop',
  'about.workshopBody': 'This blog records the full technical process: why a project exists, how it works, where it failed, and what can be reused. The path to an answer matters as much as the answer itself.',
  'about.contactHeading': 'Contact',
  'about.contactBody': 'Get in touch about embedded development, kernels, security research, or project collaboration.',
  'about.based': 'Based',
  'about.focus': 'Focus',
  'about.status': 'Status',
  'about.statusValue': 'Always tinkering',
  'post.toc': 'Contents',
  'post.backToTop': 'Back to top',
  'post.backToTopShort': 'Top',
  'code.copy': 'Copy',
  'code.copied': 'Copied',
  'image.close': 'Close (ESC)',

  'notFound.title': 'Page not found',
  'notFound.description': 'That page does not exist.',
  'notFound.heading': 'Nothing here',
  'notFound.body': 'The link may be wrong, or this page has not been written yet.',
  'notFound.home': '← Home',
  'notFound.posts': 'All posts'
};

const DICTS: Record<Lang, Dict> = { zh, en };

export function t(lang: Lang, key: keyof typeof zh) {
  return DICTS[lang][key] ?? DICTS[DEFAULT_LANG][key] ?? key;
}

/** 「N 篇 / N posts」这种带数字的量词，英文还要区分单复数，单拎出来 */
export function postCount(lang: Lang, count: number) {
  if (lang === 'en') return `${count} ${count === 1 ? 'post' : 'posts'}`;
  return `${count} 篇`;
}
