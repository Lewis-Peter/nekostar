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
cover: "/images/<slug>/cover.png"   # 可选
draft: false
apiNote: false
---
```

需要在正文中直接使用 Astro 组件时，请使用 `.mdx`；普通文章使用 `.md` 即可。草稿设为 `draft: true` 后不会生成文章页，也不会出现在列表中。

`apiNote: true` 会在文末显示那段 AI API 服务的引用，默认关闭——只给真正用到这个服务的文章打开，避免无关文章挂无关内容。

`cover` 是本文专属的社交分享图（1200×630 或 16:9，放 `public/images/<slug>/`），会覆盖
`SITE.ogImage` 那张全站默认图；不填就继续用默认的。注意它只影响 `og:image` / `twitter:image`，
正文开头要不要放这张图得自己在 Markdown 里写——两处互不干涉。

文章配图统一放 `public/images/<slug>/`，正文里用 `/images/<slug>/xxx.png` 这样的绝对路径引用。
入库前记得剥掉图片元数据（手机截图会带机型和时间戳）：`magick in.jpg -strip out.jpg`。

## 发布前配置

**站点级**占位内容集中在 `src/site.config.ts`：

| 配置项 | 用途 |
| --- | --- |
| `SITE.origin` | sitemap 与绝对链接使用的域名 |
| `SITE.name` / `logo` / `author` | 站名、页眉 logo、页脚署名 |
| `SITE.ogImage` | 社交分享预览图的**默认值**（1200×630 PNG，放 `public/`）；文章可用 frontmatter 的 `cover` 覆盖，为 `null` 且文章没写 `cover` 时输出 summary 卡片 |
| `SITE.indexTagPages` | 标签页是否让搜索引擎收录；`false` 时不进 sitemap 且输出 `noindex, follow`。文章少时标签页和 `/posts/` 内容重合，属于薄内容，攒到十几篇再改 `true` |
| `LINKS.github` / `email` | 页脚与关于页的联系方式；为 `null` 时不渲染 |
| `GISCUS.*` | 评论区；未配置时不加载 giscus 脚本 |
| `API_SERVICE.site` | AI API 服务站地址；为 `null` 时 /tools 显示待配置提示 |

约定：**值为 `null` 表示尚未确定**。组件遇到 `null` 不会渲染死链接，`pnpm build` 结束时会列出所有未填项。

构建警告**不覆盖**页面内嵌的占位内容，它们需要各自去改（页面上带朱红虚线的 `[data-pending]` 是另一个提示信号）：

- `src/pages/about.astro` — 骨架文案

上线前：构建无警告 + 页面上看不到虚线 + 上面一处处理掉。

## 暂时下架的页面

文件名以 `_` 开头的页面不会生成路由，导航里也没有入口，等内容做起来再挂回去：

- `src/pages/_tools.astro` — AI API 服务的推荐页，连同文末的 `ApiPromo` 一起停用
- `src/pages/_projects.astro` — 项目列表；`projects` 数组现在是空的，加回条目后去掉文件名前缀、恢复 `BaseLayout` 的导航项即可

## SEO

- `sitemap-index.xml` → `sitemap-0.xml`，`robots.txt` 末尾有 `Sitemap:` 声明，已提交 Google Search Console
- `lastmod` 由 `astro.config.mjs` 的 `postLastmod()` 从文章 frontmatter 的 `date` 读出；
  首页和 `/posts/` 跟着最新一篇走。那里读不了 `getCollection`（运行时 API），所以是直接解析文件
- 标签页当前不收录，见上面的 `SITE.indexTagPages`
- `robots.txt` 里 `# BEGIN/END Cloudflare Managed content` 之间那段是 Cloudflare 面板注入的 AI 爬虫
  策略，不在本仓库里，改要去 Cloudflare 的 AI Crawl Control。它只挡 AI 抓取，`Googlebot` 不受影响

## 站点输出

- `/rss.xml` — RSS 订阅（`src/pages/rss.xml.ts`）
- `/sitemap-index.xml` — sitemap
- `/posts/` — 全文归档，按年份分组
- `/tags/<tag>/` — 标签页
- `/robots.txt` — 指向 sitemap（`src/pages/robots.txt.ts`，跟随 `SITE.origin`）

每个页面都会输出 canonical、Open Graph 和 Twitter Card。文章页额外带 `og:type=article`、发布时间和标签。

## 字体

站点自托管以下字体，字体文件与页面通过同一域名分发，不依赖 Google Fonts 的运行时请求：

- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)：400 字重，仅保留 latin 分片。
- [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC)：300、400 字重；`astro build` 后扫描 `dist/**/*.html`，按实际使用衬线体的字符生成精确子集。

两款字体均采用 [SIL Open Font License 1.1](https://openfontlicense.org/)。随字体分发的许可证分别位于 `public/fonts/jetbrains-mono/OFL.txt` 和 `public/fonts/noto-serif-sc/OFL.txt`；自托管的 `@font-face` 声明位于 `src/styles/fonts.css`。

精确子集由 `scripts/subset-serif-font.mjs` 在构建期通过 Google Fonts CSS2 `text=` 参数更新，浏览器运行时只访问本站。字符清单及当前文件名保存在 `scripts/noto-serif-sc-subset.json`；字符未变化时不发网络请求。字体文件名带内容哈希；子集变化时，脚本也会给后处理过的 Astro CSS 换上新的内容哈希并更新 HTML 引用，避免浏览器或 CDN 的旧缓存遮住新增字符。网络更新失败不会中断构建：脚本会保留上一版字体并醒目警告，此时新增字符会暂时回退到系统衬线体。

## 部署

站点托管在 Cloudflare Workers（Worker 名 `nekostar`），静态资源走 Workers Static Assets，
配置见 `wrangler.jsonc`。日常不需要手动部署：Workers Builds 监听 `main`，push 即构建上线。

构建设置（在 dashboard 的 Settings → Builds 里）：

| 项 | 值 |
| --- | --- |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy` |
| Git branch | `main` |
| Root directory | 留空 |

`wrangler.jsonc` 里两处不能省：`not_found_handling: "404-page"` 让 `src/pages/404.astro`
生效（Pages 会自动兜底，Workers 不会），`html_handling: "auto-trailing-slash"` 让目录索引
带尾斜杠，和站内链接、sitemap 的写法一致。Worker 名必须和 dashboard 里一致，否则构建失败。

需要绕过 CI 手动发一次时：

```bash
pnpm deploy    # pnpm build && wrangler deploy
```

手动部署需要环境变量：

```bash
export CLOUDFLARE_API_TOKEN=<有 Workers Scripts:Edit 权限的 token>
export CLOUDFLARE_ACCOUNT_ID=895d2b6d62a42bfd0289e9bf969f5942
```

域名：

- `nekostar.blog` → Worker 的自定义域名（Workers 只接受 NS 托管在 Cloudflare 的域名）
- `nekostar.<账号子域>.workers.dev` → 默认域名，可用来验证部署

> 迁移前站点跑在 Pages 项目 `nekostar` 上，走 Direct Upload。Pages 的 Direct Upload 项目
> 无法事后接 Git，所以换成了 Workers；旧 Pages 项目确认新站正常后删除。

`astro.config.mjs` 里 `vite.server/preview.allowedHosts` 是早期用 Cloudflare Tunnel 从本机对外服务时留下的，现在不需要了，但留着不影响本地调试。
