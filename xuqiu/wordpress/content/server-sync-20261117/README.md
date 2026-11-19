# 2026-11-17 服务器内容同步快照

- 同步时间：2026-11-17 08:03–08:12（Asia/Shanghai）
- 来源：`ssh masterbatch` → `wp --path=/var/www/ashareai/current`
- 站点：`https://www.gemasterbatch.com`，WordPress 7.1.4
- 读取方式：只读导出（`wp post list` / `wp eval`），**未修改生产页面、模板或数据库**
- 范围：21 个 Page + 4 个 Post + 13 个媒体附件 + 主题文件哈希

## 快照内容

| 文件 | 内容 |
|---|---|
| `inventory.json` | 25 个 Page/Post 的完整导出：标题、slug、状态、模板、父级、永久链接、正文 Gutenberg HTML、全部 post meta |
| `meta.json` | 按 ID 整理的元数据视图（模板、SEO、robots、parent、permalink、meta） |
| `pages/*.gutenberg.html` | 服务器上有实质正文的页面（privacy、technical-documents、resources、rfq-checklist、about-quality） |
| `posts/*.gutenberg.html` | 4 篇文章的服务器正文版本 |

## 服务器基线

- 首页 Page ID 53，Blog 页 Page ID 132，`blog_public=1`
- 固定链接：`/blog/%postname%/`
- 页面 Sitemap 16 个 URL + Blog 5 个 URL（与本地记录一致）
- 13 个媒体附件；主题图片文件服务器 62 个、同步后本地 62 个
- `/masterbatch-guides/` 仍为已发布 Page（59），但路由 301 到 `/blog/`

## 已同步到本地（服务器领先或仅存于服务器）

| 本地路径 | 内容 | 说明 |
|---|---|---|
| `themes/.../templates/page-bk025-product.html` | BK025 产品页模板 | 本地原先完全没有 |
| `themes/.../templates/page-bk030-product.html` | BK030 产品页模板 | 本地原先完全没有 |
| `themes/.../templates/page-bk035-product.html` | BK035 产品页模板 | 本地原先完全没有 |
| `themes/.../assets/css/bk025-product.css` | BK025 页面样式 | 本地原先完全没有 |
| `themes/.../assets/css/bk030-product.css` | BK030 页面样式 | 本地原先完全没有 |
| `themes/.../assets/css/bk035-product.css` | BK035 页面样式 | 本地原先完全没有 |
| `themes/.../assets/images/bk02*.webp`、`bk03*.webp` | 15 张产品页图片 | 本地原先完全没有 |
| `themes/.../functions.php` | Meta Pixel + Conversions API（3,140 字符） | 服务器 11-16 新增；同步后与服务器字节一致 |
| `themes/.../templates/page-bk040-product.html` | BK035/BK030 内链改为独立页 | 服务器已修正，本地仍是 `#grades` 锚点 |
| `themes/.../assets/css/black-masterbatch-guide.css` | PT-300 / PT-450P callout 样式拆分为独立块 | 服务器版本更新 |
| `themes/.../assets/css/about-field-manual.css` | 仅新增一条注释 | 服务器版本 |
| `themes/.../assets/images/rfq-qr.png` | 新版二维码（2,327 字节） | 本地旧图仅 584 字节 |
| `content/pages/privacy-policy.md` | 新增 Meta Pixel / CAPI 数据处理段落 | 服务器 11-16 更新 |
| `content/pages/technical-documents.md` | Related pages 改为 Masterbatch guides + Black guide | 服务器已移除 Desiccant 链接 |
| `content/pages/masterbatch-guides.md` | 修正 `seo.redirect.target` 缩进 | 本地 YAML 原本无法解析 |

验证：

- `functions.php` 同步后与服务器文件 MD5 一致（`c5ae99ce…`）
- 主题图片 62/62 与服务器 MD5 一致
- `npm run test:importer-syntax`：10 个 PHP 文件全部通过
- `git diff --check`：通过

## 已补齐的本地内容包（2026-11-17）

以下 7 个内容包原先缺失，现已按服务器 Page 元数据补齐。页面可见正文仍由主题模板渲染；包内记录路由、SEO、hero、转化上下文和证据边界。状态统一为 `review`、`wp.status: draft`、`noindex: true`、`create_status: draft`（导入器安全默认），`approved_at: null`，导入前仍需本地审核。服务器上这些页面是 `publish` / `index,follow`，差异已写入各包的 `review.implementation_note`：

| 本地文件 | content_id | 来源 Page |
|---|---|---:|
| `content/pages/faq.md` | `faq` | 58 |
| `content/pages/about-quality.md` | `about.quality` | 66 |
| `content/pages/request-a-quote.md` | `quote.request` | 60 |
| `content/pages/blog.md` | `blog.index` | 132 |
| `content/products/bk025.md` | `product.black.bk025` | 143 |
| `content/products/bk030.md` | `product.black.bk030` | 144 |
| `content/products/bk035.md` | `product.black.bk035` | 145 |

`content/pages/masterbatch-guides.md` 原本已存在，本次只修正了 YAML 缩进。补包后，`content/pages` 与 `content/products` 下 20 个 Markdown 全部通过 YAML 解析；新增 7 个包通过当前导入器的字段校验（draft + noindex + SEO 长度 + 单一 H1）。

注意：既有 11 个包仍是 `publish` / `noindex: false`（如 bk020、bk040、resources、products），不符合当前 `mb-content-importer.php` 的“导入页面必须 draft + noindex”规则；这是本次之前就存在的状态，未擅自修改。

## 本地比服务器新，未覆盖

| 文件 | 差异 | 处理 |
|---|---|---|
| `content/pages/home.md` | 本地为 v2 草稿（H1 `Black Masterbatch Manufacturer & Supplier in China`，正文 36 KB）；服务器 H1 为 `Masterbatch Products for Plastic Processing` | 保留本地，未回退 |
| `content/posts/black-specks-in-masterbatch-film.wordpress.html` | 本地 20,900 字符，服务器 19,188 字符；正文 108 行完全相同，仅 HTML 标记不同 | 保留本地 |
| `themes/.../assets/css/bk040-product.css` | 本地多出 `body.mtm-bk040-page` 作用域的 box-sizing / row-gap 规则 | 保留本地，待确认是否应回传服务器 |

## 元数据差异（需业务确认，未自动合并）

| 页面 | 本地 Markdown | 服务器 | 风险 |
|---|---|---|---|
| home / technical-documents / black-masterbatch | `noindex: true`、`robots: noindex,nofollow` | `index,follow` | 这是导入器的草稿安全默认；**不能直接导入**，否则会把已发布页面设为 noindex |
| products | SEO description 与 hero summary 为较长版本 | `Structural product route for black and desiccant masterbatch pages.` | 需确认哪版为准 |
| desiccant-masterbatch | 缺 `hero.title` / `hero.summary` | 已有完整 hero | 本地内容包不完整 |
| bk020 / bk040 / pt-300 / pt-450p / dm2476g | `hero.eyebrow` 为空 | 服务器已填 BK020/BK040/PT-300/PT-450P/DM2476G | 本地内容包不完整 |
| guides/black-masterbatch.md | 仍是旧版 RFQ Guide 文案 | 服务器为新的 Black 分类页 | 本地 md 已过时；页面正文实际由模板提供 |
| masterbatch-guides.md | 已修正 YAML；`status: redirect` | 服务器 Page 59 仍发布，路由 301 → `/blog/` | 需确认是否保留该 Page |

## 文案对齐（2026-11-17）

本轮“以服务器为准”取自**线上实际渲染结果**：`<title>`、`<meta name="description">`、H1 和 H1 后的首段文案，而不是只取数据库 meta。原因是数据库 meta 与模板渲染存在偏差，例如首页 `_mb_hero_title` 仍是旧值，BK040 的 `_mb_hero_summary` 丢失了撇号。

已对齐的页面：home、faq、about-quality、request-a-quote、blog、technical-documents、masterbatch-rfq-checklist、black-masterbatch、desiccant-masterbatch、privacy-policy、bk020、bk025、bk030、bk035、bk040、pt-300、pt-450p、dm2476g。校验结果为 0 处 title/description/H1/hero summary 差异。

处理说明：

- 本地 `seo.robots` 与 `wp.noindex` 仍保持 `noindex` / `draft`，这是导入器的安全默认，与线上的 `index,follow` 不同，属于发布状态而不是文案。
- `content/pages/products.md` 与 `content/pages/masterbatch-guides.md` 没有对应的线上渲染页面（分别为 301 和重定向页），未改文案。
- home、products、desiccant、black 的 Markdown 正文不被模板渲染，保留为历史/来源资料；black 包正文顶部已加说明，避免被误认为当前页面文案。
- `wenzhang/*.md` 是发布前英文草稿，不属于 WordPress 线上内容；已发布的 `content/posts/*.wordpress.html` 与服务器一致，未重写草稿。

## 复跑命令

```bash
ssh masterbatch 'sudo -n -u www-data wp --path=/var/www/ashareai/current post list \
  --post_type=page,post --post_status=publish,draft,pending,private,future \
  --posts_per_page=-1 --fields=ID,post_type,post_status,post_name,post_title,post_modified_gmt,post_parent --format=json'
```

完整导出脚本与本次使用的 `wp eval` 代码见本次会话记录；导出结果已保存在本目录。

## 安全说明

- 本次只读生产，未写入数据库、未上传文件、未发布内容。
- 快照中没有 SMTP 密码、GA4 API Secret、Token 或客户个人信息。
- `functions.php` 中 Meta Pixel / CAPI 凭据通过环境变量读取，不写入仓库。
