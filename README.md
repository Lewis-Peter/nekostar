# Nekostar

[nekostar.blog](https://nekostar.blog) — 基于 Astro 的个人技术博客，面向硬件、安全和 Linux 内核方向的内容发布。作者 Lewis。

## 本地开发

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
pnpm preview
```

## 写文章

在 `src/content/posts/` 新建 `.md` 或 `.mdx` 文件：

```yaml
---
title: "文章标题"
date: 2026-08-08
tags: ["linux", "security"]
summary: "用于文章列表和 SEO 的一句话摘要"
draft: false
apiNote: false
---
```

需要在正文中直接使用 Astro 组件时，请使用 `.mdx`；普通文章使用 `.md` 即可。草稿设为 `draft: true` 后不会生成文章页，也不会出现在列表中。

`apiNote: true` 会在文末显示那段 AI API 服务的引用，默认关闭——只给真正用到这个服务的文章打开，避免无关文章挂无关内容。

## 发布前配置

**站点级**占位内容集中在 `src/site.config.ts`：

| 配置项 | 用途 |
| --- | --- |
| `SITE.origin` | sitemap 与绝对链接使用的域名 |
| `SITE.name` / `logo` / `author` | 站名、页眉 logo、页脚署名 |
| `SITE.ogImage` | 社交分享预览图（1200×630 PNG，放 `public/`）；为 `null` 时输出 summary 卡片 |
| `LINKS.github` / `email` | 页脚与关于页的联系方式；为 `null` 时不渲染 |
| `GISCUS.*` | 评论区；未配置时不加载 giscus 脚本 |
| `API_SERVICE.site` | AI API 服务站地址；为 `null` 时 /tools 显示待配置提示 |

约定：**值为 `null` 表示尚未确定**。组件遇到 `null` 不会渲染死链接，`pnpm build` 结束时会列出所有未填项。

构建警告**不覆盖**下面这些页面内嵌的占位内容，它们需要各自去改（页面上带朱红虚线的 `[data-pending]` 是另一个提示信号）：

- `src/pages/projects.astro` — 三个项目的 `url` 均为 `null`，卡片会显示「项目详情（待补充）」
- `src/pages/about.astro` — 骨架文案
- `src/content/posts/cardputer-chat.md` — 示例文章，代码里用的是 `api.example.com`

上线前：构建无警告 + 页面上看不到虚线 + 上面四处处理掉。

## 站点输出

- `/rss.xml` — RSS 订阅（`src/pages/rss.xml.ts`）
- `/sitemap-index.xml` — sitemap
- `/posts/` — 全文归档，按年份分组
- `/tags/<tag>/` — 标签页
- `/robots.txt` — 指向 sitemap（`src/pages/robots.txt.ts`，跟随 `SITE.origin`）

每个页面都会输出 canonical、Open Graph 和 Twitter Card。文章页额外带 `og:type=article`、发布时间和标签。

## 部署

站点托管在 Cloudflare Pages（项目名 `nekostar`），走 Direct Upload。

```bash
pnpm deploy    # astro check && astro build && wrangler pages deploy
```

需要环境变量：

```bash
export CLOUDFLARE_API_TOKEN=<有 Pages:Edit 权限的 token>
export CLOUDFLARE_ACCOUNT_ID=895d2b6d62a42bfd0289e9bf969f5942
```

域名：

- `nekostar.blog` → Pages 项目（CNAME 到 `nekostar.pages.dev`，proxied）
- `nekostar.pages.dev` → Pages 默认域名，可用来验证部署

`astro.config.mjs` 里 `vite.server/preview.allowedHosts` 是早期用 Cloudflare Tunnel 从本机对外服务时留下的，现在不需要了，但留着不影响本地调试。
