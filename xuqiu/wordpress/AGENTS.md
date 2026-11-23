# WordPress Development Rules

本文件约束 `xuqiu/wordpress/` 下的主题、内容包、MU Plugin、测试和部署脚本。
执行前仍须阅读根目录 `AGENTS.md`；页面、文章、SEO、CMS、模板或发布任务
还必须阅读根目录 `SITE_RELEASE.md`。

## Task Gate

- 页面、文章、SEO、CMS、模板或发布任务：按 `SITE_RELEASE.md` 判断 A–E 级。
- 修改 CSS、PHP、JavaScript 或模板：执行 A+C；正式发布再追加 E。
- 修改 Title、Meta、Canonical、Schema、Sitemap 或统计：执行 A+D。
- 只运行本地测试且不修改生产：不触发 E。
- 修改生产发布、Nginx、DNS、证书或重定向：必须获得用户明确确认。

视觉或 UI 工作还必须阅读根目录 `DESIGN.md` 和
`themes/mtm-b2b-masterbatch/assets/css/design-tokens.css`。

## Article Publishing

新增、修改或发布博客文章时，除 `SITE_RELEASE.md` 的 A/B/E 检查外，逐项执行
[ARTICLE_RELEASE_CHECKLIST.md](ARTICLE_RELEASE_CHECKLIST.md)；完整流程见
[ARTICLE_PLAYBOOK.md](ARTICLE_PLAYBOOK.md)。

- 数值范围统一用 `to`；`–` 和 `—` 由 `tests/articles.spec.js` 拒绝。
- 新文章必须同时更新 manifest、构建配置和测试断言。
- 已发布文章的 HTML 是正文事实来源，旧 Markdown 不得覆盖。
- 新文章必须有至少一个站内入口，避免孤儿页。
- Featured Image 必须 hero-safe；带文字封面只做正文内嵌图。
- 每篇新文章或大幅改写的文章必须完成 `humanizer` pass，再跑构建、测试和发布；
  如当前会话未加载该 skill，按 `~/.codex/skills/humanizer/SKILL.md` 执行同等流程
  并记录。润色不得改动事实、数字、牌号、测试条件、内链、SEO 字段或声明边界。

## Page-level Redesign Gate

以下页面必须先做静态设计预览、桌面/手机截图和当前/新版对照，获得用户
明确批准后才能修改生产模板：

1. About / Quality
2. Buyer FAQ
3. Black / Desiccant category pages
4. Resources / Technical Documents
5. RFQ form and all input controls
6. Privacy Policy and remaining content templates

设计预览不得直接改 WordPress 生产模板。实施时使用
`design-taste-frontend` 与 `frontend-design`，并保持 `DESIGN.md` 的字体、
颜色、间距、圆角和断点体系。

## Directory Map

```text
xuqiu/wordpress/
├── content/
│   ├── pages/       # 页面内容包和当前 Markdown 主源
│   ├── products/    # 产品详情内容包
│   ├── posts/       # 文章与 manifest
│   └── guides/      # 历史黑色母粒指南
├── mu-plugins/
│   ├── mb-content-importer.php
│   ├── mb-rfq-submissions.php
│   └── mb-seo-schema.php
├── themes/mtm-b2b-masterbatch/
│   ├── assets/css/
│   ├── assets/images/
│   ├── assets/js/
│   ├── parts/
│   └── templates/
├── tests/
│   ├── *.spec.js
│   ├── importer-syntax.js
│   └── *.php
├── bin/
└── package.json
```

## Current Content Model

- 当前公开产品线只有 Black Masterbatch 和 Desiccant Masterbatch。
- White Masterbatch 和 Color Masterbatch 已从公开产品线移除，不得重新增加
  入口、分类、表单选项或 Schema 描述，除非用户重新明确授权。
- 历史 White/Color 文件只能作为内部历史资料，不能出现在公开页面。
- `content/pages/*.md` 和 `content/products/*.md` 是内容和事实边界来源。
- `content/posts/manifest.json` 维护文章发布元数据。
- 页面正文一旦已发布，不能用旧 Markdown 覆盖，先比对线上正文并保留备份。

## Theme Architecture

- 子主题为 `mtm-b2b-masterbatch`，父主题为 `mtm-b2b`。
- 全局 Design Tokens 在
  `assets/css/design-tokens.css`，基础样式在 `style.css`。
- 共享 Header/Footer 在 `parts/header.html` 和 `parts/footer.html`。
- 共享站点框架样式为 `assets/css/site-chrome.css`，脚本为
  `assets/js/site-chrome.js`。
- 静态首页使用 `templates/front-page.html`；首页正文共享部件为
  `parts/home-refresh-content.html`。
- `templates/page-home.html` 供 Page 53 绑定和预览。
- 页面专属 CSS 必须由 `functions.php` 根据模板条件加载，并用 body class
  隔离选择器。
- 不要在页面 CSS 中重定义全局颜色、字体、间距或圆角 token。
- 不要在 `functions.php` 无条件加载仅用于单页的 CSS/JS。

## WordPress Content Rules

- Markdown 导入后的 Gutenberg 正文是 WordPress 页面正文来源。
- `[mb_page_content]` 用于无法稳定获得 `postId` 的自定义页面模板。
- 自定义模板内优先使用现有短代码渲染当前 Page 内容，避免正文双份维护。
- 任何新增短代码必须有明确用途、转义、空数据回退和静态测试。
- 页面 H1 只能有一个；模板和正文不能同时输出 H1。
- 修改页面结构时，保留正文、SEO 元数据、模板和路由的一致性。
- 发布已存在 Page 时，先备份当前正文；不要假定 `mb-content import
  --update` 可以覆盖 published 页面。
- 导入器中的 noindex 是草稿安全默认；正式发布状态必须单独确认。

## SEO and Structured Data

- Rank Math 接管 Title、Description、Canonical、robots、Open Graph、
  Schema 和 Sitemap。
- 已发布公开页面使用 `_mb_robots=index,follow`。
- Privacy Policy 使用 `_mb_robots=noindex,nofollow`。
- `_mb_noindex` 只作为旧数据回退，不是首选字段。
- noindex 页面不得出现在 XML Sitemap。
- `/production/` 和临时预发布逻辑不得重新把已公开页面设为 noindex。
- Product、CollectionPage、FAQPage、BlogPosting 和 WebPage Schema 必须与
  页面角色一致。
- 主题模板图片不属于媒体库附件时，通过
  `rank_math/sitemap/entry` 在 `mb-seo-schema.php` 显式补录图片。
- 图片 Sitemap URL 必须使用 HTTPS，并只登记高价值产品、工厂、包装和
  技术文件图片。

## Forms and Privacy

- RFQ 表单由 `[mb_rfq_form]` 输出，由
  `mu-plugins/mb-rfq-submissions.php` 处理。
- 必须保留 nonce、蜜罐、服务端必填校验、邮箱校验、限流和隐私同意。
- Documents 表单必须要求 Document type 和 Document purpose。
- 成功提交保存为私有 `mb_inquiry`，不得公开显示。
- 邮件失败时询盘记录仍必须保存，并记录 `_mb_rfq_email_sent=0`。
- SMTP 凭据只能通过 WP Mail SMTP 后台或安全环境配置提供。
- GA4 API Secret 和 SMTP 密码不得写入 Git、数据库 option、Markdown 或命令输出。
- 修改表单后同时检查 RFQ、Documents、隐私页和错误/成功状态。

## Analytics Hooks

客户端事件：

- `rfq_submit_success`
- `documents_submit_success`
- `rfq_submit_error`
- `documents_submit_error`

服务端事件需要 GA4 Measurement Protocol：

- `rfq_email_delivery_failed`
- `documents_email_delivery_failed`

事件参数不得包含姓名、公司、邮箱、消息正文或其他表单内容。

## Local Verification

在 `xuqiu/wordpress/` 执行：

```bash
npm run test:importer-syntax
npx playwright test
git diff --check
```

修改前端页面时至少运行相关专项 Playwright。新增页面、表单、路由或模板时
必须补充最小 Playwright 用例。

生产验证使用：

```bash
MB_LIVE_BASE_URL=https://www.gemasterbatch.com \
  npx playwright test tests/<relevant-spec>.spec.js
```

生产测试依赖真实账号、DNS、OAuth 或外部服务时，必须区分：

1. 代码已加载
2. 事件已触发
3. 数据已进入对应账号
4. 页面已被搜索引擎收录

## PHP and Syntax Checks

- 修改 PHP 后至少运行 `npm run test:importer-syntax`。
- 服务器上修改 PHP 后运行对应文件的 `php -l`。
- 不把扩展名伪装成 PHP；macOS 的 `._*.php` 元数据文件会被 WordPress
  误加载，必须阻止其进入 MU Plugin 目录。
- 使用 macOS 生成 tar 包时使用：

```bash
COPYFILE_DISABLE=1 tar --no-xattrs -czf <archive>.tar.gz <paths>
```

## WP-CLI

本地 Docker 环境可使用仓库包装脚本：

```bash
bin/wpcli core version
bin/wpcli plugin list
```

生产环境使用服务器 `wp`，不要假定生产存在本地 `wpcli` wrapper：

```bash
sudo -u www-data wp --path=/var/www/ashareai/current core version
sudo -u www-data wp --path=/var/www/ashareai/current theme list
sudo -u www-data wp --path=/var/www/ashareai/current post list
```

已发布页面正文更新前：

1. 导出当前 `post_content`。
2. 对比 Markdown 主源和线上正文。
3. 备份或记录可恢复点。
4. 使用受控的更新流程，不要直接用旧内容包覆盖。

## Production Deployment

正式部署还必须满足根目录 `SITE_RELEASE.md` 的全部适用级别，并更新根目录
`xuqiu/DEPLOYMENT_LOG.md`。

最小发布流程：

1. 确认当前 release 和待修改文件。
2. 从当前干净 release 复制新的时间戳 release。
3. 只上传本次修改文件，不整套覆盖生产主题。
4. 运行 `php -l`、相关 Playwright 和 `git diff --check`。
5. 校验文件 owner 为 `www-data:www-data`。
6. 使用临时 symlink + `mv -Tf` 原子切换 `current`。
7. 重载 PHP-FPM，避免 realpath/opcache 继续使用旧 release。
8. 清理 WordPress cache；更新 SEO 时重新生成 Rank Math Sitemap。
9. 验证正式域名、主要路由、表单、SEO、Sitemap、robots 和手机布局。
10. 保留上一个干净 release，记录回滚点。

常用生产命令：

```bash
sudo systemctl reload php8.3-fpm
sudo -u www-data wp --path=/var/www/ashareai/current cache flush
sudo -u www-data wp --path=/var/www/ashareai/current rankmath sitemap generate
```

Nginx、DNS、证书、数据库迁移、批量清理和删除生产内容必须先获得明确确认。

## Common Failure Modes

- 切换 release 后没有重载 PHP-FPM，页面继续显示旧模板。
- Tar 包带入 macOS `._*` 文件，污染 WordPress 输出。
- 页面专属 CSS 没有条件加载，导致手机端宽度被原图撑破。
- 导入器覆盖 published 页面，丢失手工发布后的正文。
- JSON-LD、Canonical 或 Open Graph 指向旧域名。
- 公开页面被误设 noindex，或 Privacy Policy 被误设 index。
- Rank Math 缓存未清理，Sitemap 继续显示旧 URL 或旧图片列表。
- 主题模板图片没有进入媒体库，因此默认为 `Images 0`。
- 测试只检查 HTML，不验证正式域名的资源、图片和重定向。

## Delivery

交付时说明：

- 修改了哪些文件或 CMS 对象；
- 变更级别以及是否执行生产修改；
- 执行了哪些命令和浏览器检查；
- 实际证据和仍待确认事项；
- 当前 release、回滚 release 和是否需要更新部署日志。
