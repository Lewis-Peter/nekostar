import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export function byNewest(a: Post, b: Post) {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
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
  return Math.max(1, Math.ceil((chineseCharacters + latinWords) / 300));
}
