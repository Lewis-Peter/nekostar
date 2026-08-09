import type { APIContext } from 'astro';
import { SITE } from '../site.config';

// 用端点生成而不是放 public/，这样 sitemap 地址跟着 SITE.origin 走，换域名不会漏改。
export function GET(context: APIContext) {
  const origin = (context.site ?? new URL(SITE.origin)).origin;
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    ''
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
