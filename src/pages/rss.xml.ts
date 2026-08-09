import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { byNewest } from '../lib/posts';
import { SITE } from '../site.config';

// 限制订阅源体积，让 RSS 客户端只获取最近更新的内容。
const RSS_ITEM_LIMIT = 30;

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(byNewest);

  return rss({
    title: SITE.name,
    description: SITE.description,
    // context.site 来自 astro.config.mjs 的 site（即 SITE.origin）
    site: context.site ?? SITE.origin,
    items: posts.slice(0, RSS_ITEM_LIMIT).map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
      categories: post.data.tags
    })),
    customData: '<language>zh-CN</language>'
  });
}
