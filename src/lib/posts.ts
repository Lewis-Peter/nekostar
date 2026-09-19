import type { CollectionEntry } from 'astro:content';
import { DEFAULT_LANG, localizePath, type Lang } from './i18n';

export type Post = CollectionEntry<'posts'>;

/**
 * 文章按语言分目录存放：src/content/posts/zh/ 和 .../en/，
 * 于是 entry.id 长这样：`zh/t14s-eng-sample`。语言和 slug 都从 id 里拆，
 * 不需要在每篇 frontmatter 里重复写一遍 lang，也就不会写岔。
 *
 * 中英同一篇文章靠**文件名相同**配对（zh/foo.md ↔ en/foo.md），
 * 没有对应文件就是还没翻译，页面上不会出现语言链接。
 */
export function postLang(post: Post): Lang {
  return post.id.startsWith('en/') ? 'en' : 'zh';
}

/** 去掉语言目录后的文件名，同时也是两种语言之间的配对键 */
export function postSlug(post: Post) {
  return post.id.replace(/^(zh|en)\//, '');
}

export function postPath(post: Post) {
  return localizePath(postLang(post), `/posts/${postSlug(post)}/`);
}

export function isLang(lang: Lang) {
  return (post: Post) => postLang(post) === lang;
}

/** getCollection 的过滤器：某个语言下、未标 draft 的文章 */
export function publishedIn(lang: Lang) {
  return ({ id, data }: Post) => !data.draft && (id.startsWith('en/') ? 'en' : 'zh') === lang;
}

export function byNewest(a: Post, b: Post) {
  return b.data.date.getTime() - a.data.date.getTime();
}

const DATE_LOCALE: Record<Lang, string> = { zh: 'zh-CN', en: 'en-US' };

export function formatDate(date: Date, lang: Lang = DEFAULT_LANG) {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatCardDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year} · ${month} · ${day}`;
}

export function formatMonthDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month} · ${day}`;
}

export function estimateReadingTime(body = '') {
  const clean = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`\[\]()-]/g, ' ');
  const chineseCharacters = clean.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinWords = clean.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  // 中英分开计速：中文按每分钟 400 字，英文按 220 词。同一篇文章的中英两版
  // 篇幅相当，但若共用一个除数，英文版会被算得明显偏快。
  return Math.max(1, Math.ceil(chineseCharacters / 400 + latinWords / 220));
}
