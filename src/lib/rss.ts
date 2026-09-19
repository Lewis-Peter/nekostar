import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { byNewest, postPath, publishedIn } from './posts';
import { HTML_LANG, SITE_DESCRIPTION, type Lang } from './i18n';
import { SITE } from '../site.config';

// 限制订阅源体积，让 RSS 客户端只获取最近更新的内容。
const RSS_ITEM_LIMIT = 30;

/** 中英各有一份订阅源：/rss.xml 和 /en/rss.xml，各自只收该语言的文章 */
export async function feed(context: APIContext, lang: Lang) {
  const posts = (await getCollection('posts', publishedIn(lang))).sort(byNewest);

  return rss({
    title: SITE.name,
    description: SITE_DESCRIPTION[lang],
    // context.site 来自 astro.config.mjs 的 site（即 SITE.origin）
    site: context.site ?? SITE.origin,
    items: posts.slice(0, RSS_ITEM_LIMIT).map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: postPath(post),
      categories: post.data.tags
    })),
    customData: `<language>${HTML_LANG[lang]}</language>`
  });
}
