import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    /** 本文专属的社交分享图，public/ 下的路径。不填则用 SITE.ogImage 那张全站默认图 */
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    /** 只有真的用到那个 API 服务的文章才设为 true，文末才会出现引用 */
    apiNote: z.boolean().default(false)
  })
});

export const collections = { posts };
