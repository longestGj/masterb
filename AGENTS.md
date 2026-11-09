# AGENTS.md

## Design System

Read `DESIGN.md` before visual or UI work. It defines the fonts, colors,
spacing, components, breakpoints and migration rules. Ask the user before
departing from it. When reviewing or QA-ing UI, flag code that does not match
`DESIGN.md`. Global CSS tokens live in
`xuqiu/wordpress/themes/mtm-b2b-masterbatch/assets/css/design-tokens.css`.

### Page-level redesign gate

The following pages must be redesigned and reviewed before implementation:

1. About / Quality
2. Buyer FAQ
3. Black / White / Color Guides
4. Resources / Technical Documents
5. RFQ form and all input controls
6. Privacy Policy and remaining content templates

For each page, do not edit the production template or deploy until the user has
reviewed and approved a design preview. Required sequence:

1. Use the today-installed `design-taste-frontend` and `frontend-design`
   skills for the page review and design directions.
2. Treat `DESIGN.md` and `design-tokens.css` as the shared visual source of
   truth. Page designs may change composition and hierarchy, not invent new
   colors, fonts, spacing systems or radius families.
3. Audit the current page at desktop and mobile before proposing changes.
4. Build a static design preview without touching WordPress production
   templates.
5. Provide desktop and mobile screenshots plus a current-vs-proposed
   comparison.
6. Wait for explicit user approval of the design preview.
7. Only then refactor the template, CSS and tests.
8. Deploy through a new production release after all checks pass.

## 项目定位

本仓库是色母粒（masterbatch）B2B 外贸项目的资料、内容与有限 WordPress
实施工作区。项目已进入首版首页和单个黑色母粒指南的实现阶段，但仍未完成
完整网站 PRD、全部首版页面或完整站点上线。

主要工作可能包括：

- 编写、修订、核验色母粒知识库；
- 整理公司资料、产品 TDS、合规文件和媒体素材；
- 调研海外市场、关键词、竞争对手和客户开发方向；
- 编写黑、白、彩色母粒的 RFQ 页面、文档申请页面和表单文案；
- 在业务决策和证据齐备的范围内开展 WordPress 页面、主题和导入器开发。

`xuqiu/wordpress/` 当前包含 WordPress 内容包、MU Plugin、子主题、部署脚本说明、
Playwright 测试和 PHP 语法检查工具。其他产品页、应用页、表单页、隐私政策
和公司公开信息仍需继续建设，不能因为首页已经上线就推定整站完成。

## 开始任务前

按以下顺序阅读：

1. 本文件；
2. [色母粒知识库入口](色母粒知识库/README.md)；
3. [市场研究决策摘要](Cmp_Info/MASTERBATCH_RESEARCH_DECISION_SUMMARY.md)；
4. 与任务直接相关的有限 PRD、页面文案、表单说明或产品资料；
5. [待确认事项](色母粒知识库/待确认事项/待确认事项清单.md)和[来源索引](色母粒知识库/参考来源/来源索引.md)。

不要仅根据文件名或旧草稿判断项目已进入开发阶段。

## 目录说明

### `色母粒知识库/`

面向零基础读者的 12 课知识库，当前包含基础知识、生产与指标、应用与选型、质量问题、询盘与外贸、术语表、来源索引和待确认事项。

课程内容用于建立选型、核查和沟通框架，不是任何具体产品的性能、配方、价格、交期或合规承诺。

### `Cmp_Info/`

公司业务资料，主要包括：

- 黑色母粒 BK020、BK025、BK030、BK035、BK040、PT-300、PT-450P 的 TDS；
- 消泡母粒 DM2476G 的 TDS；
- 黑色母粒 MSDS/SDS；
- 白色母粒 FDA 样品报告和黑色母粒 RoHS 样品报告；
- GE CHEMICAL 公司简介；
- Wudi Longda 公开产品地图；
- 市场、关键词、竞争对手、页面机会和询盘表单研究；
- 黑、白、彩色母粒 RFQ 页面及文档申请页文案；
- Limited PRD 和研究决策文件。

### `Cmp_Info/PIC&Vedio/`

生产设备、包装、托盘、装柜和出口等图片与视频。用于公开网站前，应确认素材归属、人物肖像、水印和公开授权。

### `img/`

从 `Cmp_Info/PIC&Vedio/` 分类整理出的网站素材目录，包含 factory、product、
packaging、export-loading、customer-visit、exhibition 和 videos。用户已确认
`img/` 下的图片可用于网站；图片 Alt 仍必须描述实际画面，不能据此推断具体
牌号、性能、产能或合规结论。

### `xuqiu/wordpress/`

当前 WordPress 实施目录：

- `content/pages/home.md`：首页 Page 的可导入内容包；
- `content/guides/`：黑色、白色和彩色母粒指南内容包；
- `content/pages/`：首页、隐私政策、技术文件、资源索引和 RFQ 清单；
- `mu-plugins/mb-content-importer.php`：Markdown 和受控 Gutenberg 区块导入器；
- `themes/mtm-b2b-masterbatch/`：当前启用的子主题；
- `tests/homepage.spec.js`：首页 Playwright 测试；
- `tests/importer-syntax.js`：无 PHP CLI 时的导入器/主题 PHP 语法检查；
- `masterbatch-home-import.zip`：当前首页部署包。

## 当前状态

- 知识库 12 课标记为在当前范围内“已核验”，日期为 2026-08-04。
- 市场研究和页面规划文件日期主要为 2026-07-05 至 2026-07-06。
- 首页已于 2026-11-03 部署到 `https://gzh.hzscf.site/`，当前 Page ID 为 53，
  标题为 `Masterbatch Products`，状态为 `publish`。
- WordPress 当前设置为静态首页：`show_on_front=page`、
  `page_on_front=53`、`blog_public=1`，首页 noindex 已移除。
- 首页主关键词为 `masterbatch`，SEO 标题为
  `Masterbatch Products for Plastic Processing | GE CHEMICAL`。
- Rank Math SEO `1.0.281` 已安装并启用；Open Graph、Organization/WebSite
  Schema、页面 Title/Description/robots 和 Rank Math Sitemap 已接管输出。
- Google Search Console 数据连接仍需业务方使用 Google 账号完成 OAuth；
  当前无法在没有账号授权或 DNS/验证码的情况下自动验证属性。
- GA4 转化跟踪代码已接入，但在配置 `mb_ga4_measurement_id` 或
  `MASTERBATCH_GA4_MEASUREMENT_ID` 前保持停用；邮件失败事件还需要仅在
  环境变量中提供 `MASTERBATCH_GA4_API_SECRET`。
- 子主题版本为 `0.9.38`，Header 品牌为 `GE Chemical & Polymer Group`，
  完整公开主体名称仍保留在 Footer 和公司内容中。
- 首页、Products、Masterbatch Guides、Black/White/Color 产品页、Request a Quote、
  Technical Documents、Resources、RFQ Checklist、Buyer FAQ、
  About / Quality 和 Privacy Policy 均已发布。
- 新产品页树为 Page 113 `Products` →
  `/products/black-masterbatch/`、`/products/white-masterbatch/`、
  `/products/color-masterbatch/`；`/masterbatch-guides/` 保留为 Buyer
  Guides 入口，旧产品 URL 返回精确 301 并保留查询参数。
- Page 113 `/products/` 仅作为产品 URL 结构父页保留，已设为
  `noindex,nofollow`、从 Sitemap 和 Header/Footer 公开入口移除，直接访问
  通过 Nginx 精确 301 到首页；三个产品分类和 BK040 路由不受影响。
- Page 117 `BK040 - 40% Carbon Black Masterbatch` 已作为 Page 31 的子页
  发布到 `/products/black-masterbatch/bk040/`，使用
  `page-bk040-product` 模板。
- 首批四篇 Buyer Guides 文章已发布：
  `/blog/masterbatch-for-blown-film/`（Post 122）和
  `/blog/black-specks-in-masterbatch-film/`（Post 123）、
  `/blog/how-to-vet-a-masterbatch-supplier/`（Post 129）、
  `/blog/how-to-choose-carbon-black-content/`（Post 147）；Resources 页面
  `Buyer articles` 区块与 Header Blog 入口已接入。
- Page 132 `/blog/` 已设为 WordPress Posts Page：
  `page_for_posts=132`。Header Blog 指向 `/blog/`，文章仍使用根级 slug。
- Header、Footer、首页产品和 CTA 的主要目标均已闭环。Footer 的
  Applications 指向首页 `/#applications` 区，避免为尚未有独立证据的
  应用页创建空路由。
- 已发布内容页统一使用 `_mb_robots=index,follow`；Privacy Policy 使用
  `_mb_robots=noindex,nofollow`。`_mb_robots` 为实际 SEO 指令来源，
  `_mb_noindex` 仅作为旧数据回退。
- 多个文件明确标注 `Market Research Only`、`Not for PRD`、`Not for Dev` 或 `Do Not Use Yet`。
- 尚未完成完整网站 PRD、全部页面、邮件投递配置和业务负责人最终审批。

除非用户明确要求推进下一阶段，不要擅自把研究草稿改成最终 PRD、开发任务或已上线事实。

## 2026-11-03 首页实施记录

### 页面与 SEO

- 首页 8 个主内容区块：Hero、产品、应用、询盘审核流程、技术文件、
  About、Resources 与 FAQ、最终 CTA。
- 产品区使用 Black、White、Color 三张产品入口卡；原先重复的采购信息
  对比表已移除，避免同一信息在首页出现两次。
- Resources 区后包含 5 个可见 FAQ，并输出对应的 `FAQPage` 结构化数据。
- 首页 Hero 使用厂房主图和母粒产品内嵌图；About 区使用车间设备、
  包装和整托出货三张图。图片位于子主题 `assets/images/`，均有描述画面
  的 Alt 文本。
- 首页 HTML 只保留一个 H1；当前 H1 为
  `Masterbatch Products for Plastic Processing`。
- 首页 Meta Description 为：
  `Black, white and color masterbatch products for film, packaging,
  injection molding, extrusion and recycled plastics. Share your application
  requirements.`
- Header 导航按当前首版结构使用：
  `Home / Products / Resources / Documents / About`，Contact CTA 指向
  `/request-a-quote/`。

### 内容边界

- 首页目前只写黑、白、彩三类母粒方向和一般应用背景。
- 用户已于 2026-11-05 确认可以使用 `masterbatch supplier` 定位。
  首页 About 区可以使用该定位，但仍不扩展为 `manufacturer`、产能、
  生产线、客户数量、实验室能力、
  BK/PT 具体牌号、固定 MOQ、价格、交期或全系列合规承诺。
- 技术文件仍按牌号、应用、国家和用途人工审核，通过邮件回复；
  不提供公开文件下载。
- `img/` 图片已经可用于网站，但照片本身不能作为产品参数、工厂产能、
  客户背书或合规证据。
- `example/` 是首页视觉参考；其中生产线、产能、客户市场和具体牌号等
  内容仍需业务证据后才能使用。
- `https://deltatecnic.com/complete-guide-to-masterbatch/` 是同行知识型
  指南参考，不等于同行首页；可借鉴其长文结构，不直接复制其行业、
  产品系列或公司声明。

### 技术实现

- 首页正文保存在 `content/pages/home.md`，由 MU Plugin 导入为
  Page ID 53 的 Gutenberg 内容。
- 静态首页使用
  `themes/mtm-b2b-masterbatch/templates/front-page.html`；同名模板必须
  放在子主题 `templates/` 下，放在主题根目录不会被 WordPress 采用。
- `templates/page-home.html` 用于 Page 绑定和草稿预览。
- 当前 WordPress 版本中 `core/post-content` 没有在自定义 Page 模板中
  获得稳定的 `postId` 上下文，因此两个首页模板都通过
  `[mb_page_content]` 短代码渲染当前 Page 正文。
- 首页 SEO Title、Description 和 FAQ Schema 由子主题 `functions.php`
  输出；安装 Yoast 或 Rank Math 后代码会跳过 Description/FAQ 输出，
  避免重复。
- 手机端产品对比表通过 `data-label` 属性转换成分组卡片；修改表格时
  必须同步保留这些属性。
- 首页使用图片优先加载、About 图片懒加载；部署图片前应继续压缩。

### 验证命令

```bash
cd xuqiu/wordpress
npm run test:importer-syntax
npx playwright test
git diff --check
```

服务器部署后还应验证：

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://gzh.hzscf.site/
```

并在真实浏览器检查桌面和移动端无横向溢出、图片全部加载、H1 只有一个。

### 部署环境与 wpcli 调用

- 仓库内 `xuqiu/wordpress/bin/wpcli` 是面向本地 Docker 环境的包装脚本，
  默认容器为 `wpdev-wp-1`，默认导入目录为 `/root/wpdev/import`。
  当前开发主机没有 Docker，因此不能直接用该脚本操作线上 WordPress。
- 线上 WordPress 通过项目专用 SSH 部署账号访问；该账号需要具备 Docker
  权限，并拥有单独的可写导入目录（部署时使用
  `$HOME/wpdev/import`）。线上调用格式为：

  ```bash
  ssh "$SSH_ALIAS" \
    'MASTERBATCH_IMPORT_DIR="$HOME/wpdev/import" wpcli core version'
  ```

- 当前开发机已将 SSH alias 配置为 `masterbatch-vm`；配置保存在仓库外的
  `~/.ssh/config`。本次验证命令为：

  ```bash
  ssh -o BatchMode=yes masterbatch-vm \
    'MASTERBATCH_IMPORT_DIR="$HOME/wpdev/import" wpcli core version'
  ```

  当前返回 WordPress `7.1.4`。
- SSH 主机、用户名、端口、私钥路径和任何密码都是环境凭据，禁止写入
  `AGENTS.md`、代码、日志或提交记录。新会话如需访问服务器，应由用户
  在当前安全环境中提供 SSH alias 或身份文件路径。
- 新会话只读取仓库时，可以继续编辑内容和运行本地测试，但不能假定仍拥有
  远程写入权限。执行远程部署前，先用只读命令确认：

  ```bash
  ssh "$SSH_ALIAS" \
    'MASTERBATCH_IMPORT_DIR="$HOME/wpdev/import" wpcli core version'
  ```

- 已发布 Page 的正文更新不要依赖 `wpcli mb-content import --update`：
  当前导入器会拒绝覆盖 published 页面。应先校验内容包，再备份当前正文，
  通过受控的 WP-CLI eval/更新流程写入正文并验证，或先取得明确授权将页面
  临时改为 Draft 后执行标准导入。
- 导入文件在宿主机与容器中的路径不同：宿主机
  `$HOME/wpdev/import/home.md` 对应 wpcli 容器内的 `/import/home.md`。

### 2026-11-05 内容同步、隐私页与 RFQ 提交

- 线上 Page 53 的正文已同步回 `content/pages/home.md`，同时保留本地
  Front Matter。以后编辑首页前先确认线上与 Markdown 主源没有再次分叉。
- 首页主题文件和新增模板也已从线上同步回本地，避免部署旧主题覆盖线上。
- 新增 `content/pages/privacy-policy.md` 与
  `templates/page-privacy.html`，Privacy Policy 页面 ID 为 69。
  WordPress `wp_page_for_privacy_policy` 已指向 69。
- 当前 RFQ 表单由 `[mb_rfq_form]` 输出，并由
  `mu-plugins/mb-rfq-submissions.php` 接受到 `admin-post.php`。
- 提交处理包含 nonce、蜜罐、服务端必填、邮箱和产品校验、30 秒邮箱与
  IP 限流；成功后保存为私有 `mb_inquiry` 记录，后台菜单为 `Inquiries`。
- 处理成功后会尝试通过 `wp_mail` 通知
  `MASTERBATCH_RFQ_RECIPIENT`，未设置时回退 WordPress `admin_email`。
  邮件失败不会丢失询盘，记录会保存 `_mb_rfq_email_sent=0`。
- 当前 WordPress 容器没有可执行的 `/usr/sbin/sendmail`，也没有启用 SMTP
  插件，因此不能把邮件通知视为已投递。真实询盘仍可在后台 `Inquiries`
  查看；生产邮件投递必须另行配置并确认。
- Privacy Policy 已说明私有记录和条件式邮件通知，不再写 UI-only 状态；
  页面仍需业务和法务最终审核。
- `tests/rfq-runtime-smoke.php` 会拦截邮件、验证私有记录并删除测试记录；
  `tests/rfq-live.spec.js` 在提供 `MB_LIVE_BASE_URL` 时检查线上桌面和
  手机表单，不提交表单。
- 2026-11-05 已用真实页面 nonce 向线上 `admin-post.php` 提交两次隔离测试：
  服务端返回 302 到带 `rfq_status=success#request-form` 的表单页，记录为
  private 且 `_mb_rfq_email_sent=0`；两条测试记录均已删除。
- Footer 与 Quote 页面已增加 Privacy Policy 链接。

### 2026-11-05 SEO 状态与页面闭环

- 修正导入器 SEO 语义：`_mb_robots` 是实际 robots 指令来源；
  `noindex` 会输出 `noindex,nofollow`，`index,follow` 不额外输出限制。
  `_mb_noindex` 只在 `_mb_robots` 缺失时作为旧数据回退。
- 线上已发布内容页统一为 `index,follow`；Privacy Policy 保持
  `noindex,nofollow`。`noindex` 页面会同时从 WordPress 页面 Sitemap 排除。
- 主题保留无 SEO 插件时的回退：为每个 Page 输出对应的
  `_mb_seo_title` 和 `_mb_seo_description`。Rank Math 启用后该回退输出
  自动停用，由插件接管。
- 发布 Page 59 `Masterbatch Guides`、Page 58 `Masterbatch Buyer FAQ`，
  并将 Page 31 重新挂到 Page 59。
- 新增并发布：
  - Page 77 `White Masterbatch RFQ Guide`；
  - Page 78 `Color Masterbatch RFQ Guide`；
  - Page 79 `Request Masterbatch Technical Documents`；
  - Page 80 `Masterbatch Buyer Resources`；
  - Page 81 `Masterbatch RFQ Checklist`。
- 新增 `page-document-request` 和 `page-resources` 模板。Documents 表单使用
  `[mb_rfq_form context="documents"]`，服务端要求文件类型和用途。
- 主路由、单一 H1、桌面/手机横向溢出、robots 输出和 Documents 表单均有
  Playwright 线上覆盖。
- 安装 Rank Math SEO，配置公开语言为 `en-US`、公司知识图谱为
  `GE CHEMICAL & POLYMER GROUP CO., LTD`、Organization/WebSite Schema、
  默认 Open Graph 图片和 Twitter Card。
- `sitemap_index.xml` 与 `page-sitemap.xml` 已返回 200；noindex 的
  Privacy Policy 不在页面 Sitemap 中。

### 2026-11-05 Material Lab 首页重设计

- 首页从工业编辑布局升级为 `Material Lab` 方向：工业编辑质感与技术样本册
  信息密度结合。
- Hero H1 改为 `Masterbatch for the run, not the catalog.`，增加
  Materials、Process fit、Review basis 三条技术信息。
- 黑、白、彩三张产品卡改成连续产品章节，并使用对应颗粒图片、编号、
  规格标签和独立产品路线 CTA。
- 产品区内新增 Factory Context：单张大幅工厂建筑图、应用审核说明和
  Material context、Processing review、Packing & shipment 标签。
- 应用区改为编号工艺索引；审核流程改为四列连续技术栅格；Resources
  改为规格化条目。
- Documents 从高饱和黄铜色改为暖纸色技术文件台。最终 CTA 增加
  Resin、Process、Target、Documents 四个提交字段提示。
- PC 和手机均验证无横向溢出，保留单一 H1、8 个首页主区块、RFQ 和
  Documents 表单路由闭环。
- 下半页统一为暖纸色体系：Applications、Process、Documents、About、
  Resources 使用同一色系与细线分隔，Documents 不再切换为突兀的深色块。
- 手机端移除 Hero 叠图，产品改为图文横向编排，流程改为纵向时间线，
  About 图片改为横向 scroll-snap，CTA 字段压缩为两列。
- 手机 Header 收敛为 61px 单行，移除首页渲染壳和 section 的继承空隙；
  Documents、About、Resources 统一为连续暖纸色。移动端最终页面宽度
  保持 390px 无横向溢出。
- Header 改为与 Hero 连续的深墨色品牌栏，Logo 使用暖纸色小方底，
  导航文字使用浅色，CTA 保持黄铜色。下半页面统一为低饱和暖灰纸色：
  Applications/About `#efebe3`、Process/Resources/CTA outer `#e8e2d8`、
  Documents `#e1dbd1`。
- 桌面和手机均移除 WordPress 根布局继承的 24px 块间距。桌面 Header
  底边与 Hero 起点现均为 123px，手机分别为 63px，页面不显示白色空隙。
- Applications 标题区改为与产品区连续的深墨色全宽过渡带，底部使用
  3px 黄铜线切入暖纸色应用列表。PC 宽度 1440px、手机宽度 390px 时均
  从视口左边缘完整铺到右边缘，无横向溢出。
- 最终 CTA 面板改为下半部暖色体系：外层 `#e8e2d8`、内面板
  `#ded7cb`、深墨标题与主按钮、黄铜标签和深墨描边次按钮，不再切回
  整块黑色。

### 2026-11-05 Technical Field Manual 首页

- 首页视觉替换为完整的 `Technical Field Manual` 方向，并通过仅静态首页
  加载的 `assets/css/material-field-manual.css` 与 A 版样式隔离。
- Hero 改为暖纸色编辑部版式，衬线 H1 为
  `Masterbatch, tuned to the line.`，主图为工厂建筑，黑色母粒作为样本叠图。
- 黑、白、彩改为三块连续产品版面，分别使用深墨、暖白和黄铜背景；
  产品颗粒图占完整右侧版心。
- Applications 恢复暖色工艺索引；Process 使用深墨连续审核序列；
  Documents 使用暖纸登记表；About 使用车间全幅背景和工厂语境；
  Resources 扩为四项，最终 CTA 使用黏土色。
- 手机端采用独立纵向产品版面、审核时间线、About 横向图片带和两列 CTA
  字段；PC/手机均无横向溢出，H1 唯一。
- Header 导航严格对齐 D：Materials、Applications、Documents、About；
  Hero 后增加黑底材料彩条；Products 与 Applications 标题采用三列编辑网格。
- 桌面导航使用 12.48px、800 字重的深墨色文字和透明底边；手机菜单展开
  使用深墨背景、浅色链接和浅色关闭按钮，避免继承响应式容器造成低对比。
- 桌面导航进一步改为独立浅暖色导航条：`#fffaf1` 背景、
  `#b8ad9c` 描边、14.72px 字号、800 字重和纯黑文字。
- Documents 改为四行登记表；About 改为车间全幅图片与工厂语境叠层；
  Resources 为四项索引；FAQ 为双栏；最终 CTA 为左右分栏黏土色区域。

### 2026-11-06 About / Buyer FAQ Field Manuals

- 子主题版本从 `0.9.7` 升到 `0.9.9`；About / Quality 与 Buyer FAQ
  从通用区块模板升级为各自的完整 Technical Field Manual 页面。
- Page 66 `About / Quality` 绑定 `page-about-quality`，新增
  `templates/page-about-quality.html` 与 `assets/css/about-field-manual.css`。
  About 页面围绕 inquiry reviewer、run-based review、document handling、
  evidence boundary 和最终 RFQ 组织，不使用未确认的产能、生产线或客户背书。
- Page 58 `Masterbatch Buyer FAQ` 绑定 `page-faq`，新增
  `templates/page-faq.html` 与 `assets/css/faq-field-manual.css`。FAQ 覆盖
  产品范围、彩色定制、RFQ 输入、样品、TDS/SDS/COA、RoHS/FDA 边界、
  数据表阅读、应用与树脂，以及提交后的审核流程。
- `functions.php` 增加 `mb_is_about_field_page()` 和
  `mb_is_faq_field_page()`，按页面绑定的模板而不是 slug 或 ID 判断页面，
  分别加载对应 CSS，并添加 `mtm-about-field`、`mtm-faq-field` body class。
- `style.css` 不再保留旧 About / FAQ 通用样式；两个页面的视觉规则各自隔离，
  避免影响其他 Page。
- 2026-11-06 的线上变化只涉及主题模板、CSS、`functions.php` 和
  `style.css`；Page 66 与 Page 58 的数据库正文及修改时间没有在这一天变化。
- 服务器文件已同步回本地，并将 CRLF 统一为仓库使用的 LF。同步后的
  `style.css`、`functions.php`、两个模板和两个独立 CSS 与线上内容的
  标准化 SHA-256 完全一致。

### 下一步

1. 配置并验证生产邮件投递（SMTP 或事务邮件服务），确认 RFQ 收件人、
   回复负责人和数据保留期限；技术文件申请页可复用当前表单处理器。
2. 完成 [Search Console 接入待办](xuqiu/SEARCH_CONSOLE_TODO.md)：使用
   Google 账号完成 Rank Math Analytics OAuth，验证 `gzh.hzscf.site`
   属性并提交 `https://gzh.hzscf.site/sitemap_index.xml`。
3. 建立应用页：Film & Packaging、Injection Molding、General Extrusion、
   Recycled PE/PP。
4. 完成 [GA4 转化统计接入待办](xuqiu/GA4_SETUP_TODO.md)：配置
   Measurement ID、API Secret，并将 RFQ/Documents 成功事件标记为 Key Event。
5. 建立 `Masterbatch Guide` 或 `Buyer’s Guide` 长文，承接知识型搜索并
   内链到三类产品页。
6. 完成公司事实、产能、生产线、市场覆盖和图片授权审核后，再决定是否
   采用 Example 或同行首页中的公司实力表达。
7. 在 SMTP 信息齐备后，按
   [生产部署计划](xuqiu/PRODUCTION_DEPLOYMENT_PLAN.md)
   在独立生产服务器执行原生 LEMP 部署；计划阶段不要覆盖现有
   `gzh.hzscf.site` 测试站。

### 2026-11-07 生产部署进度

- `ashareai.com` 与 `www.ashareai.com` 已解析到生产服务器
  `150.230.3.189`，该地址与 `ssh masterbatch` 一致。
- 生产服务器已完成 2GB Swap、Nginx、PHP 8.3-FPM、MariaDB 10.11、
  WP-CLI、Certbot、Fail2ban、UFW、WordPress `7.1.4` 和主题 `0.9.9`
  的安装。
- 现有站点数据库、主题、插件、MU Plugin 和上传文件已迁移到
  `/var/www/ashareai/releases/20261107-1`；旧域名替换 dry run 为 0。
- 生产库当前 `home` 和 `siteurl` 均为 `https://www.ashareai.com`，
  `blog_public=0`，Nginx 继续输出临时 `noindex`。
- WordPress 自动更新已关闭；WP Mail SMTP 已安装但等待真实 SMTP 凭据。
- Oracle Cloud 已放行 80/443。服务器上另有遗留 iptables `REJECT` 规则，
  已备份到 `/root/iptables-before-ashareai.v4` 并移除，公网访问恢复。
- Let's Encrypt 证书已签发，覆盖 `www.ashareai.com` 和 `ashareai.com`；
  HTTPS、HTTP 跳转和裸域跳转均已验证，证书续期 dry run 成功。
- 生产站已通过桌面与手机主路由、表单渲染、About、FAQ、Open Graph 和
  Organization Schema 测试；预发布 noindex 模式下 Playwright 为 14/14。
  RFQ 与 Documents 后端测试均成功保存并清理，当前不存在测试询盘。
- 由于尚未配置 SMTP，邮件投递仍失败并保存 `_mb_rfq_email_sent=0`；
  正式开放索引前仍需 SMTP、收件人和最终发布确认。
- 定时备份按用户要求延期；在备份和恢复流程启用前，不执行 WordPress
  核心、插件或主题更新。

### 2026-11-08 Shared Header / Footer 生产部署

- 已将确认版全站 Header / Footer 落到子主题，主题版本由 `0.9.9`
  升至 `0.9.10`。
- Header 使用 GE 横版 Logo、Products / Applications / Documents / About
  导航和 `Get a quote` CTA；手机端使用可关闭的全屏菜单。
- Footer 使用深绿品牌背景、整托出货图片与
  `Request a material review` CTA，并保留完整公开主体
  `GE CHEMICAL & POLYMER GROUP CO., LTD` 和 `Binzhou, Shandong, China`。
- 新增 `assets/css/site-chrome.css` 与 `assets/js/site-chrome.js`，由
  `functions.php` 在页面专属样式之后全站加载。Header / Footer 使用独立
  `site-chrome-*` 命名，避免继承首页、About 和 FAQ 的旧 Header 样式。
- 生产当前 release 已切换为
  `/var/www/ashareai/releases/20261108-1`；旧 release
  `/var/www/ashareai/releases/20261107-1` 保留用于回滚。
- 生产 `blog_public=0` 和 Nginx `X-Robots-Tag: noindex, nofollow`
  保持不变，未开放搜索引擎索引。
- 线上最终 Playwright 为 `16 passed`，覆盖 12 个主路由、RFQ /
  Documents、SEO 状态、新 Header / Footer、手机全屏菜单、单一 H1 和
  横向溢出。桌面宽度 `1440/1440`、手机宽度 `390/390`；Header 底边与
  正文起点分别为 `83px` 和 `70px`，没有白色空隙或错位。
- 该阶段生产截图已按用户要求清理。

### 2026-11-08 Titan-inspired Header / Footer

- 用户确认参考 `https://www.titantitanium.cn/` 的 Header / Footer 结构。
  子主题由 `0.9.10` 升至 `0.9.11`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-2`；`20261108-1` 保留回滚。
- Header 改为白色 80px 单层导航，包含
  `Home / Products / Applications / Documents / About Us / Contact`
  和右侧 `Get a quote`。Products 使用桌面下拉菜单，手机端使用紧凑下拉
  菜单和 Products 二级菜单，不再使用全屏菜单。
- Footer 改为参考站的五栏结构：品牌介绍、Quick Links、Product Lines、
  Contact Us 和二维码。底部使用居中版权栏，保留完整公开主体
  `GE CHEMICAL & POLYMER GROUP CO., LTD` 和
  `Binzhou, Shandong, China`。
- 二维码存储在
  `assets/images/rfq-qr.png`，编码目标为
  `https://www.ashareai.com/request-a-quote/`。未复制参考站的电话、邮箱、
  WhatsApp 或二维码。
- 生产 `blog_public=0` 与 `X-Robots-Tag: noindex, nofollow` 保持不变。
- 线上 Playwright 最终 `16 passed`。另以生产浏览器检查
  `1440 / 1024 / 390 / 320px`：文档宽度与视口一致，Header/Footer 无
  横向溢出；Header 底边与正文起点在桌面为 `81px`、手机为 `65px`。
- 该阶段生产截图已按用户要求清理。

### 2026-11-08 首页 Refresh v2 生产部署

- 用户确认采用优化后的英文 v2 首页设计。子主题由 `0.9.11` 升至
  `0.9.12`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-3`；`20261108-2` 保留回滚。
- 首页不再由 `[mb_page_content]` 渲染，改为共享模板部件
  `parts/home-refresh-content.html`。`templates/front-page.html` 与
  `templates/page-home.html` 均引用 `home-refresh-content`，保证静态首页
  与 Page 53 模板使用同一份内容。
- 新首页由 7 个区块组成：Hero 与审核依据、三产品卡、四应用卡、
  审核流程与技术文件、白底工厂区、Resources / FAQ、最终 CTA。
- 新样式只在前台首页加载：
  `assets/css/home-refresh-v2.css`。旧 `material-field-manual.css`
  不再由 WordPress 首页加载，但文件保留作历史参考。
- 产品卡分别使用深绿、纯白和浅绿表面，并链接到真实 Black / White /
  Color 指南；应用图标已复制到主题 `assets/icons/`。
- `content/pages/home.md` 仍保留为可导入内容包和历史主源，但当前前台
  首页不再读取它。后续修改首页应优先更新
  `parts/home-refresh-content.html` 与 `assets/css/home-refresh-v2.css`。
- 生产 `blog_public=0` 与 `X-Robots-Tag: noindex, nofollow` 保持不变。
- 线上 Playwright 为 `16 passed`。生产截图检查：
  桌面页面约 `5,002px`，手机约 `9,464px`；
  `1440 / 1024 / 390 / 320px` 无横向溢出，Header 与正文无空隙。
- 该阶段生产截图已按用户要求清理。

### 2026-11-08 首页预发布索引保护

- 子主题升至 `0.9.13`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-4`；`20261108-3` 保留回滚。
- 新增 Rank Math `rank_math/sitemap/entry` 过滤器：当
  `blog_public=0` 时，将静态首页从 `page-sitemap.xml` 排除；其他已发布
  页面继续保留。
- 首页继续同时输出 `<meta name="robots" content="noindex, nofollow">`
  和 Nginx `X-Robots-Tag: noindex, nofollow`。
- 已清除 Rank Math Sitemap 文件与 transient 缓存。线上
  `page-sitemap.xml` 不再包含 `https://www.ashareai.com/`，但仍包含
  `/technical-documents/` 等其他页面。
- 线上 Playwright 再次为 `16 passed`。
- 正式开放索引时，将 `blog_public` 设为 `1` 并移除临时 Nginx noindex
  后，该过滤器会自动停止排除首页。

### 2026-11-08 Factory 图文对应修复

- 子主题升至 `0.9.14`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-5`；`20261108-4` 保留回滚。
- Factory 区保留标题 `The material has to work on the line.`，但四项说明
  改为与三张图片直接对应：生产设备背景、树脂与工艺核对、包装语境、
  托盘与出货语境。
- “按产品核对文件”不再在 Factory 区重复，文件范围继续由 Documents 区
  说明；“样品与试料讨论”仍由 Buyer FAQ 和审核流程承接。
- 中文审阅稿同步更新为相同信息结构。
- 线上 Playwright 再次为 `16 passed`；生产首页仍保持 noindex 和
  Sitemap 排除。
- 该阶段生产截图已按用户要求清理。

### 2026-11-08 手机端纵向节奏修复

- 子主题升至 `0.9.16`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-7`；`20261108-6` 保留回滚。
- `620px` 以下收紧连续白底区块的上下间距：
  Products → Applications、Applications → Review、Documents → Factory、
  Factory → Resources。
- 手机端 Factory 标题上方总间距控制在约 `48px`，其他主要区块过渡约
  `40–48px`；桌面布局不变。
- 中文审阅稿与英文 v2 同步更新。
- 线上 Playwright 再次为 `16 passed`；首页继续 noindex 且从 Sitemap
  排除。

### 2026-11-08 品牌 Site Icon

- 生产 WordPress 原 `site_icon` 指向旧附件 `18`，已替换为新品牌
  Site Icon 附件 `107`。
- 源文件保存在
  `themes/mtm-b2b-masterbatch/assets/images/ge-site-icon.png`，尺寸为
  `512×512` PNG。
- 生产 `<head>` 已输出新的 32px、192px favicon、
  apple-touch-icon 和 msapplication TileImage。
- 当前生成的站点图标文件：
  `ge-site-icon-150x150.png` 与 `ge-site-icon-300x300.png`。
- 浏览器可能缓存旧 favicon；重新打开首页或强制刷新后显示新图标。

### 2026-11-08 全局 Design Tokens 部署

- 新增根目录 `DESIGN.md`，并建立全局
  `assets/css/design-tokens.css`。
- 子主题升至 `0.9.17`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-8`；`20261108-7` 保留回滚。
- design tokens 在基础主题样式和页面专属样式之前全局加载，当前页面
  尚未强制改用新变量，因此本次部署不改变现有视觉。
- 部署前后生产桌面与手机整页截图逐字节一致。
- 线上 Playwright 为 `16 passed`；首页 noindex 与 Sitemap 排除保持有效。
- 后续页面统一按 `DESIGN.md` 的迁移顺序逐步替换硬编码颜色、字号和间距。

### 2026-11-08 Header / Footer Token 重构

- 子主题升至 `0.9.18`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-9`；`20261108-8` 保留回滚。
- Header / Footer 中旧的 `--chrome-*` 局部变量已全部移除，颜色、字体、
  容器、控件高度、圆角和阴影改用全局 `--ge-*` design tokens。
- Header / Footer 容器从旧 `1200px` 对齐到全站目标 `1240px`。
- 手机整页截图部署前后 SHA-256 完全一致；桌面仅出现预期的容器宽度
  对齐变化，没有其他布局或组件回归。
- 线上 Playwright 为 `16 passed`，Header / Footer 和首页均无横向溢出。
- 新增 `tests/design-system.spec.js`，检查 DESIGN.md、token 值、
  旧变量清除和样式加载顺序。

### 2026-11-08 首页 Token 迁移

- 子主题升至 `0.9.19`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-10`；`20261108-9` 保留回滚。
- `home-refresh-v2.css` 的局部 `:root` 变量已移除。颜色、字体、容器、
  控件高度、圆角、阴影和 section spacing 改用全局 `--ge-*` tokens。
- 为保持语义完整，design tokens 新增
  `surface-hover`、`product-color` 和 `accent-hover`。
- 页面内容、区块顺序、响应式断点和组件尺寸未改变。
- 线上 Playwright 为 `16 passed`；Header / Footer 和首页均无横向溢出。
- `tests/design-system.spec.js` 新增首页局部根变量和硬编码 token 检查。

### 2026-11-08 About / Quality v2 生产部署

- 用户确认 About v2 后，子主题由 `0.9.19` 升至 `0.9.20`，生产 release
  切换为 `/var/www/ashareai/releases/20261108-11`；标题精简后升至
  `0.9.21`，当前 release 为 `20261108-12`，`20261108-11` 保留回滚。
- `templates/page-about-quality.html` 从旧 Technical Field Manual 结构重写
  为 11 个区块：Hero、Company Facts、Material Context、Product Routes、
  Applications、Inquiry Process、Document review、Claim limits、
  Buyer checks、Next step 和 Final CTA。
- Company Facts 只使用已确认的公开主体、供应商角色、山东滨州所在地、
  黑/白/彩产品路线、四类应用方向和树脂/工艺/最终制品/具体牌号审核依据。
- 三条产品路线链接真实 Black / White / Color 指南；四类应用分别整理
  薄膜与包装、注塑、通用挤出和再生 PE-PP 的询盘输入。
- About 页面不增加页内 FAQ；Buyer FAQ 继续走 `/faq/`。
- `assets/css/about-field-manual.css` 改为使用全局 `--ge-*` tokens 的
  白底、深绿结构带和 lime 信号系统，删除了旧暖纸、陶土色和旧 Header
  覆盖。
- `Document review.`、`Claim limits.`、`Buyer checks.` 在
  `1440 / 1024 / 768 / 390px` 下保持单行；`320px` 仅
  `Document review.` 换成两行。
- 下一步区块标题由 `Choose the next step for your grade review.` 简化为
  `Choose your next step.`，避免桌面端不必要的两行标题。
- 新增 `tests/about-quality.spec.js` 与 `tests/about-quality-live.spec.js`；
  `tests/design-system.spec.js` 增加 About 无局部根变量、无旧 `--field-*`
  变量和 token 使用检查。
- 本地全量 Playwright 为 `24 passed / 22 skipped`；生产线上专项加全站
  Playwright 为 `20 passed`。生产 `1440 / 1024 / 768 / 390 / 320px`
  均无横向溢出、图片加载失败或多个 H1。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。
- 该阶段生产截图和几何审计已按用户要求清理。

### 2026-11-08 Contact / Request a Quote v1 生产部署

- 用户确认 Contact / RFQ 设计稿后，子主题由 `0.9.21` 升至
  `0.9.22`，并在可选字段默认隐藏问题修复后升至 `0.9.23`。当前生产
  release 为 `/var/www/ashareai/releases/20261108-14`，
  `20261108-13` 保留回滚。
- `templates/page-request-a-quote.html` 重写为 4 个区块：Hero 与 RFQ、
  `After you send it.`、`Review scope.`、`Product routes.`。Contact 继续
  使用 `/request-a-quote/`，没有新增重复的 `/contact/` 路由。
- RFQ 表单默认只显示 9 个核心字段：姓名、公司、邮箱、国家或地区、产品
  意向、基体树脂、应用或最终制品、加工方式、目标或当前问题。
- 当前牌号、数量、目的港和颜色参照类型收进默认关闭的
  `Add technical details`；技术文件字段不再出现在 Contact 表单，改为跳转
  `/technical-documents/`。
- Documents 表单继续保留完整文件字段和必填规则。服务端新增 RFQ 的
  `target_color_function` 必填校验，同时继续对 Documents 强制校验文件
  类型和用途。
- 新增 `assets/css/contact-v1.css`，只在使用
  `page-request-a-quote` 模板时加载，并添加 `mtm-contact-v1` body class。
- 新增 `tests/contact-page.spec.js`，更新 `tests/rfq-live.spec.js`、
  `tests/rfq-runtime-smoke.php` 和设计系统检查。
- 本地全量 Playwright 为 `28 passed / 22 skipped`，生产 Contact/RFQ、
  Documents、主路由、Header/Footer 与 About 为 `20 passed`。
- 生产 `1440 / 1024 / 768 / 390 / 320px` 均为单一 H1、4 个区块、
  9 个默认可见字段、3 条产品路线、3 个辅助入口，无横向溢出或图片失败。
- 该阶段生产截图与几何审计已按用户要求清理。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。

### 2026-11-08 Header Resources 导航

- 用户确认主导航缺少 `Resources` 属于结构遗漏。子主题升至 `0.9.24`，
  当前生产 release 为 `/var/www/ashareai/releases/20261108-15`。
- 桌面与手机 Header 均在 Applications 和 Documents 之间增加
  `Resources`，链接到 `/resources/`。
- `site-chrome.js` 将 `/resources` 加入当前导航映射，`/resources/` 及其
  子路径会正确设置 `aria-current="page"`。
- 本地 Playwright 验证 `981px` 和 `1024px` 的桌面导航没有横向溢出；
  生产 Header/Footer 测试为 `5 passed / 1 skipped`，包括 Resources
  当前页状态。
- 继续执行服务器版本保留策略：当前 release 15 保留在
  `/var/www/ashareai/releases/`，上一版 release 14 保留在
  `/var/backups/ashareai/releases/`；更早版本已清理。

### 2026-11-08 Header 导航分组与 Home 恢复

- Header 最终导航为
  `Home / Products / Applications / Resources / About Us / Contact`。
- `Resources` 改为下拉菜单，内容包括 Buyer Guides、Blog、Buyer FAQ 和
  Technical Documents。
- Buyer Guides 指向 `/masterbatch-guides/`；Blog 暂指向 `/resources/`，
  避免在尚未建立文章索引时产生死链接；Buyer FAQ 和 Technical Documents
  分别指向现有独立页面。
- 桌面与手机菜单均支持 Products 和 Resources 两个下拉；打开其中一个时
  会关闭另一个，Escape 可关闭。
- Home 恢复为导航首项并指向 `/`；`/` 进入当前页高亮状态。
- 本地与生产 `981px`、`1024px`、`1440px` 和手机导航无横向溢出。
- 生产 Header/Footer 测试为 `7 passed / 1 skipped`。
- 子主题当前为 `0.9.26`，生产 release 为
  `/var/www/ashareai/releases/20261108-17`；上一版 release 16 位于
  `/var/backups/ashareai/releases/20261108-16`。

### 2026-11-08 Black Masterbatch 10 角度 LandFAQ 生产部署

- 用户确认重新组织黑母粒页面。最终结构为 10 个区块：Hero、产品基础、
  牌号选择、载体与树脂、性能与质量、应用、质量与验证、采购、公司与供应、
  FAQ 与询价。
- `product/black-masterbatch-支柱页.md` 的 8 段正文、5 个牌号和 A–F 六组
  36 条 FAQ 全部保留；FAQ 具体问答集中在最后第 10 章。
- 新增 `themes/mtm-b2b-masterbatch/templates/page-black-masterbatch.html`
  和 `assets/css/black-masterbatch-guide.css`，主题版本升至 `0.9.27`。
- `functions.php` 新增 `mb_is_black_masterbatch_guide_page()`，仅在绑定
  `page-black-masterbatch` 模板的页面加载专属 CSS，并添加
  `mtm-black-guide-page` body class。
- 新增生成脚本 `bin/build-black-masterbatch-page.js` 和 Playwright 测试
  `tests/black-masterbatch-guide.spec.js`。
- Page 31 已改为 `page-black-masterbatch` 模板，题名改为
  `Black Masterbatch`；SEO Title 为
  `Black Masterbatch Manufacturer: BK020–BK040 Grades`，Description
  已同步 Rank Math 和主题元数据。
- 生产 `current` 已切换到
  `/var/www/ashareai/releases/20261108-18`，主题版本为 `0.9.27`；
  release 17 保留。
- 部署前数据库备份：
  `/var/backups/ashareai/database/pre-black-guide-20261108T091006Z.sql`；
  旧主题文件备份：
  `/var/backups/ashareai/files/theme-backup-20261108T091006Z.tar.gz`。
- 生产桌面、平板、390px 和 320px 检查均为 200、单一 H1、10 个区块、
  5 个牌号、36 条 FAQ、无横向溢出和坏图。该阶段截图已按用户要求清理。
- `blog_public=0`、页面 meta robots 和 Nginx 临时 noindex 继续有效；
  页面 canonical 将在正式开放索引时复核。
- PHP 语法检查和本地专项测试通过；生产路由、黑母粒、Chrome、About、
  RFQ 和 Documents 的分组验证通过。

### 2026-11-08 Product URL Architecture Migration

- 新增 Page 113 `Masterbatch Products`，slug 为 `products`，绑定
  `page-products`；它是黑色、白色和彩色产品页的新父页。
- Page 31 Black、Page 77 White、Page 78 Color 已迁到 Page 113：
  `/products/black-masterbatch/`、`/products/white-masterbatch/`、
  `/products/color-masterbatch/`。
- Page 59 `/masterbatch-guides/` 继续作为 Buyer Guides / Resources 入口，
  不再作为产品页父级。
- Header、Footer、首页产品卡、About、Buyer FAQ、RFQ、Technical Documents、
  Resources、Markdown 主源及 Playwright 硬编码链接已统一到新路径。
- 父主题原先把 `product` 自定义文章类型的 rewrite 注册为
  `products/...`，会抢占 Page 产品树。子主题新增
  `register_post_type_args` 过滤器，将该类型的 rewrite 改为
  `product-catalog/...`；当前没有已发布商品依赖旧路径。
- Nginx 为三条旧产品 URL 增加精确 301，`$is_args$args` 保留查询参数。
  可重复执行的配置脚本位于
  `xuqiu/wordpress/bin/apply-product-redirects.py`。
- 子主题升至 `0.9.29`，生产 release 为
  `/var/www/ashareai/releases/20261108-20`；部署后必须同时刷新 rewrite
  并 reload `php8.3-fpm`，避免 PHP realpath 缓存继续读取旧 release。
- 生产 HTTPS 验证：`/products/` 和三张产品页均为 200；三条旧路径均为
  301。完整 Playwright 为 `62 passed / 4 skipped`。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。

### 2026-11-08 BK040 Product Detail Page

- Page 117 `BK040 - 40% Carbon Black Masterbatch` 已发布为 Page 31 的
  子页，规范 URL 为 `/products/black-masterbatch/bk040/`。
- 页面按已批准的 10 区块设计实现：Hero、BK 梯度、配方差异、应用、
  13 项 TDS 参数、测试与样品、8 条 FAQ、制造能力、相邻牌号和最终 CTA。
- 新增 `templates/page-bk040-product.html` 与
  `assets/css/bk040-product.css`。模板由
  `bin/build-bk040-product-page.js` 从
  `xuqiu/design-preview/bk040-product-page-v1` 生成。
- 新增 `content/products/bk040.md` 作为页面路由、SEO、父级、CTA 和证据
  范围主源。
- 从 `img/` 选择 5 张实拍图并转为 `1200×1600`、`810×1080`、
  `1400×1050` 和 `1400×788` 的 WebP，单页图片总量约 856KB。
- 子主题由 `0.9.29` 升至 `0.9.30`，生产 release 为
  `/var/www/ashareai/releases/20261108-21`。
- Products Page 113 和 Black Masterbatch Page 31 均已加入 BK040 入口。
- 黑母粒页 `Five carbon black loadings` 面板中的 BK040 已改为可点击卡片，
  指向 `/products/black-masterbatch/bk040/`；主题升至 `0.9.31`，当前
  release 为 `/var/www/ashareai/releases/20261108-22`。
- BK040 `Where BK040 is used` 三行已收紧为桌面 `112px` 最小高度、手机
  取消固定最小高度；`Request BK040 TDS` 与包装图片之间增加 `24px`。
  主题升至 `0.9.32`，当前 release 为
  `/var/www/ashareai/releases/20261108-23`。
- 面包屑规则为“最多 3 层”，不要求每页正好 3 层。黑母粒分类页使用
  `Products / Black masterbatch`；BK040 使用
  `Products / Black masterbatch / BK040`。主题升至 `0.9.33`，当前
  release 为 `/var/www/ashareai/releases/20261108-24`。
- 生产 URL 返回 200，Sitemap 包含新页面；BK040 SEO Title 为
  `40% Carbon Black Masterbatch (BK040) | Film & Molding`。
- 生产完整 Playwright 为 `68 passed / 4 skipped`。生产视觉审计覆盖
  `1440 / 768 / 390 / 320px`，均无横向溢出、坏图、重复 H1 或参数/FAQ
  数量错误；截图与 JSON 位于
  `xuqiu/design-preview/production-bk040-v1/`。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。

### 2026-11-08 Design Preview Cleanup

- 按用户要求删除不再回看的历史设计稿、旧截图、对比页和 capture 生成物。
- `xuqiu/design-preview/` 从约 `280MB` 缩减到约 `7.1MB`。
- 保留三套生产构建源：`home-refresh-sketch-v2`（仅保留
  `index.html/styles.css/script.js`）、`black-masterbatch-refresh-v1`
  （`black-main.html/black.css`）和 `bk040-product-page-v1`
  （`bk040-main.html/bk040.css`）。
- 另保留 About、Contact、Carbon Black 文章的当前内容/样式源，以及最新
  `production-bk040-v1` 验收截图。
- 清理后三个生产构建脚本均已重新运行，生成的主题文件与生产 release 24
  的 SHA-256 完全一致。

### 2026-11-08 First Buyer Guide Articles

- Post 122 已由 `Masterbatch for Film and Blown Film: A Selection Guide`
  更名为 `How to Choose Masterbatch for Blown Film`，发布到
  `/blog/masterbatch-for-blown-film/`，主关键词
  `masterbatch for blown film`。
- Post 123 `Poor Dispersion and Black Specks in Masterbatch Film: A
  Diagnostic Guide` 发布到 `/black-specks-in-masterbatch-film/`，主关键词
  `poor dispersion masterbatch`。
- 两篇文章均归入 `Masterbatch Guides` 分类，使用现有单篇模板；新增
  `assets/css/article.css` 只对 `single-post` 加载，复用全局 design
  tokens。
- Resources Page 80 新增 `Buyer articles` 区块并链接两篇文章；Header
  Blog 指向 `/resources/#articles`。文章页会将 Resources 标记为当前导航项。
- 正文主源保留在 `wenzhang/`；`bin/build-article-posts.js` 生成
  Gutenberg 区块包、Resources 更新包和 manifest。
- 两篇文章已进入 `post-sitemap.xml`，Open Graph 图片和
  `article:section` 分类元数据正常。
- 子主题升至 `0.9.34`，生产 release 为
  `/var/www/ashareai/releases/20261108-25`。
- 生产完整 Playwright 为 `72 passed / 4 skipped`；两篇文章在桌面和手机
  均为单一 H1、无横向溢出、封面和正文图片正常。
- Post 129 `How to Vet a Masterbatch Supplier: A Practical Buyer
  Checklist` 已作为第三篇文章发布，使用同一分类、文章模板和 Resources
  入口。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。

### 2026-11-08 Hidden Products Parent Page

- `/products/` 不再作为公开产品总览页。Page 113 仍保留，用于维持
  `/products/black-masterbatch/`、`/products/white-masterbatch/`、
  `/products/color-masterbatch/` 和 BK040 的层级 URL。
- Header 产品下拉只保留三个产品分类；Footer 移除 Product Portfolio 和
  View All Products；Masterbatch Guides 改为直接链接三个产品分类。
- 黑母粒和 BK040 面包屑中的 `Products` 改为不可点击的分组文字，避免跳到
  已隐藏的父页。
- Nginx 对 `/products` 和 `/products/` 返回精确 301 到首页并保留查询参数。
  Page 113 使用 `noindex,nofollow`，已从页面 Sitemap 移除。
- 子主题升至 `0.9.35`，生产 release 为
  `/var/www/ashareai/releases/20261108-26`。
- 生产专项 Playwright 为 `47 passed / 3 skipped`。

### 2026-11-08 Blog Archive Production

- 新增 Page 132 `Blog`，slug 为 `blog`，并设置
  `page_for_posts=132`；静态首页 `show_on_front=page` 和
  `page_on_front=53` 保持不变。
- 新增子主题 `templates/home.html`、`assets/css/blog-archive.css` 和
  `assets/images/blog-hero-factory.webp`。Blog 样式由
  `bin/build-blog-archive.js` 从已批准的 `blog-refresh-v1` 预览生成。
- `functions.php` 新增 `[mb_blog_archive]`：查询最新 3 篇已发布 Post，
  自动生成 Hero 索引、1 篇主文章和 2 篇次级文章。以后新增 Post 会自动进入
  Blog。
- Header Blog 改为 `/blog/`；Resources 页的文章列表改为单一 Blog 入口。
  文章页和 Blog 页会同时将 Resources/Blog 导航标记为当前项。
- Blog Hero 的 `Browse the guides` 使用黄绿色背景和深绿色文字，修复了
  通用链接样式导致白字配浅绿背景的问题。
- Blog Hero 和文章特色图使用本批新选素材：厂房外景、两张母粒产品特写和
  车间设备图；Post 122/123/129 的 `_thumbnail_id` 已分别更新为附件
  135/136/137。
- 子主题升至 `0.9.36`，生产 release 为
  `/var/www/ashareai/releases/20261108-27`。
- `/blog/` 已进入 `post-sitemap.xml`；生产完整 Playwright 为
  `78 passed / 4 skipped`。
- WordPress `permalink_structure` 后续已调整为 `/blog/%postname%/`。
  三篇文章从根级 slug 迁到 `/blog/.../`，旧地址通过 Nginx 精确 301
  到新地址并保留查询参数；文章交叉内链、Blog 动态链接、Canonical 和
  `post-sitemap.xml` 已同步。迁移后专项路由、Blog 和内链测试为
  `12 passed`。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。

### 2026-11-08 Technical Article Template

- 新增子主题 `templates/single.html` 和动态短代码 `[mb_article_page]`，
  三篇文章共用技术诊断报告式模板。
- Hero 使用文章特色图作为整幅背景，并叠加深绿色遮罩；面包屑保持紧凑。
- 正文自动提取 H2 生成桌面固定目录；平板和手机使用折叠
  `On this page` 目录。
- 文章正文使用 760px 阅读栏，技术表格、列表、引用和链接统一样式；文末
  自动显示另外两篇文章和相关询盘 CTA。
- 三篇文章设置 `_mb_article_hero_title`，页面 H1 使用批准后的短标题，SEO
  Title 保持不变。
- `bin/build-article-page.js` 从批准的 `article-refresh-v1` 预览生成
  `assets/css/article.css` 和 `templates/single.html`。
- 子主题升至 `0.9.37`，生产 release 为
  `/var/www/ashareai/releases/20261108-28`。
- 生产完整 Playwright 为 `82 passed / 4 skipped`，三篇文章桌面与手机均
  通过目录、H1、背景图、相关文章和横向溢出检查。
- `blog_public=0`、页面 meta robots 和 Nginx `X-Robots-Tag` 继续为
  `noindex, nofollow`，未开放搜索引擎索引。

### 2026-11-08 BK Grade URL Placeholders

- 为尚未完成的黑色母粒型号页创建 WordPress 草稿，父页均为 Page 31
  `Black Masterbatch`：
  - Page 142 `BK020`：`/products/black-masterbatch/bk020/`
  - Page 143 `BK025`：`/products/black-masterbatch/bk025/`
  - Page 144 `BK030`：`/products/black-masterbatch/bk030/`
  - Page 145 `BK035`：`/products/black-masterbatch/bk035/`
- 这些 Page 保持 Draft 和 `noindex,nofollow`，用于锁定未来 slug；
  `_mb_placeholder=1` 标记其占位状态。
- Nginx 对四个占位 URL 返回精确 301 到
  `/products/black-masterbatch/`，并保留查询参数。BK040 页面保持 200。
- `product/如何选择炭黑含量-选型文章.md` 的五档产品内链已改为真实预留
  路径。
- 后续发布对应型号页时，必须先从
  `bin/apply-product-redirects.py` 删除该型号的临时跳转，重新运行脚本并
  执行 `nginx -t`，否则已发布页面仍会被 301 到分类页。

### 2026-11-08 Carbon Black Content Buyer Guide

- 完成并发布 Post 147
  `How to Choose Carbon Black Content in Black Masterbatch`，规范 URL 为
  `/blog/how-to-choose-carbon-black-content/`，分类为
  `Masterbatch Guides`，主关键词为
  `carbon black content in black masterbatch`。
- 文章正文主源为
  `wenzhang/How_to_Choose_Carbon_Black_Content.md`；
  `product/如何选择炭黑含量-选型文章.md` 保持同步并继续只读。
- 正文约 1,900 词，包含 10 个 H2、BK020 到 BK040 的 TDS 示例对比、
  填料与载体说明、成本换算、应用方向、文件边界、询盘清单和试验方法。
- 文章使用共享技术文章模板；SEO Title 为
  `Carbon Black Content in Black Masterbatch Guide | GE CHEMICAL`，
  Description 为 135 字符，封面附件为 146。
- `bin/build-article-posts.js` 和 manifest 已扩展到四篇文章；Blog 自动将
  最新文章放入首篇主卡。旧根级 URL 迁移测试只覆盖迁移前的三篇文章。
- 生产 `blog_public=0` 与 noindex 策略保持不变。完整生产 Playwright 为
  `84 passed / 4 skipped`。

### 2026-11-08 Technical Article Mobile Layout Fix

- 修复共享技术文章模板在手机端被对比表 `min-width: 600px` 撑宽的根因：
  `.article-main` 增加 `min-width: 0`，正文不再被网格的 min-content
  推出视口。修复前 390px 下正文实际宽 `602px`、左边缘为 `-106px`。
- 手机端面包屑改为 48px 单行并在长标题处省略；Hero 取消 `430px`
  最小高度，H1 使用更紧凑的响应式字号，首段和正文阅读字号同步收紧为
  不低于 16px。
- 生成器为表格单元格输出 `data-label`；620px 以下将 BK020 到 BK040
  对比表转换为分组卡片。修复后 390px 正文宽 `358px`、320px 为 `288px`，
  表格无横向滚动。
- 新增 `tests/article-mobile.spec.js`，在 390px 和 320px 检查正文边界、
  Hero 高度、16px 正文字号、表格卡片和横向溢出。
- 子主题升至 `0.9.38`，生产 release 切换为
  `/var/www/ashareai/releases/20261108-29`；release 28 保留回滚。
- 修复前后截图和指标保存在
  `xuqiu/design-preview/article-mobile-fix-0.9.38/`。
- 完整生产 Playwright 为 `85 passed / 5 skipped`。`blog_public=0` 与
  noindex 策略保持不变。

## 事实与证据规则

### 信息优先级

表达具体产品事实时，按以下优先级使用证据：

1. 对应产品、版本和批次的当前 TDS、COA、SDS/MSDS、检测报告或供应商书面确认；
2. 当前来源索引中明确记录适用范围和证据强度的资料；
3. 公司官网或公开产品地图中的产品类别和型号线索；
4. 知识库中的通用教学框架。

知识库可以帮助组织问题，但不能替代具体产品文件、试样或供应商确认。

### 产品与认证边界

- 不把单个牌号、样品或批次的文件扩展为整条产品线。
- 白色母粒 FDA 证据仅对应 `MB Blanco PE` 测试样品，不能写成所有白色母粒均 FDA 合规或适合食品接触。
- 黑色母粒 RoHS 报告对应所测试的黑色样品，不能写成全系列 RoHS 合规。
- TDS 中的建议添加比例、MFI、炭黑含量、填料含量等必须注明对应牌号和文件来源。
- 典型值、规格值和客户验收值必须区分。
- 缺少当前证据时，明确写“待确认”，不要补写通用温度、配方、添加比例、MOQ、价格、交期或法规结论。
- 颜色名称、照片、树脂缩写、加工方式和目标市场都不能单独证明产品适配或合规。
- 质量现象不能仅凭客户文字、照片或单一指标归因给母粒；优先使用“现象—可能原因—核查信息—下一步验证”框架。

### 主体与公开信息规则

现有资料涉及多个主体：

- GE CHEMICAL & POLYMER GROUP CO., LTD；
- Wudi Longda；
- BINZHOU LEACHY NEW MATERIAL CO., LTD；
- SHANDONG BEIHONG NEW MATERIAL TECHNOLOGY CO., LTD。

这些主体之间的关系、文件归属和公开授权尚未完全澄清。

面向网站的公开内容按 Limited PRD 的规则处理：

- 公开主体只写 GE CHEMICAL & POLYMER GROUP CO., LTD；
- 非 GE 文件仅作内部供应参考，不得在公开页面、元数据、FAQ、下载说明或表单文案中暴露主体名称；
- 公开文件是否存在必须按具体牌号、用途和审核结果确认；
- 网站采用“文档申请 + 人工审核 + 邮件回复”流程，不提供无需审核的公开技术文件下载。

### 文件和命名注意

- `TDS--PT-400.doc` 的文件名是 PT-400，但文档正文型号为 `PT-450P`；引用前确认正确牌号。
- `TDS--BK040.doc` 和 `TDS--PT-400.doc` 中出现 `Food Grade`，但没有找到对应黑色产品的完整 FDA 文件，不能直接扩展为食品接触合规。
- 公司简介、FDA 报告和 MSDS 中的地址、主体或文件范围存在差异，使用前须由业务方确认。
- 文档中的个人电话和邮箱未经明确授权不要发布到公开页面。

## 产品证据概况

| 产品线 | 当前资料 | 使用结论 |
|---|---|---|
| 黑色母粒 | 多个 TDS、黑色母粒 MSDS、黑色样品 RoHS 报告 | 当前证据相对最完整，仍须按牌号和主体核验 |
| 白色母粒 | 一个 `MB Blanco PE` FDA 样品报告 | 只能支持样品级结论，缺少白色 TDS 和 SDS/MSDS |
| 彩色母粒 | 公开产品地图和型号线索 | 可做 RFQ 引导，不应编造颜色、色差、MOQ 或牌号承诺 |
| 填充母粒 | 市场搜索需求较强 | 缺少独立填充母粒 TDS、SDS/MSDS、COA |
| 消泡母粒 | DM2476G TDS | 文件主体与公开主体不一致，进入公开或 P0 前须澄清 |
| PPA、开口爽滑、抗老化等功能母粒 | 公开产品地图 | 缺少技术文件，不可承诺具体性能或参数 |

## 内容编辑规范

- 默认使用中文；面向海外网站的页面文案可以使用英文，但应与现有页面文案保持一致。
- 使用专业、保守、证据优先的 B2B 表达。
- 修改带状态字段的文件时，保留并同步更新状态、日期和适用范围。
- 新增或更新事实时，记录来源链接或本地文件、查阅日期和适用边界。
- 不删除来源、待确认项或反证来让结论显得更确定。
- 不把“可能”“通常”“待确认”机械改成确定性承诺。
- 修改知识库课程时，检查术语表、来源索引、待确认事项和交叉链接是否需要同步更新。
- 修改页面文案时，检查 RFQ 字段、文档申请规则、证据边界和禁止声明是否仍一致。
- 修改市场研究时，保留数据日期、国家/地区和关键词口径；搜索量、竞争度等数据只代表采集时点。
- 除非任务明确要求，不覆盖原始 TDS、MSDS、检测报告和公司资料。

## Skills

- `humanizer` v3.1.0 已从 `https://github.com/blader/humanizer` 安装到
  `~/.codex/skills/humanizer/`。新会话中可以用 `$humanizer` 显式调用。
- 适用于英文官网页面、资源文章、FAQ、销售邮件和对外公司文案的自然化改写；
  它用于去除明显的模板化、空泛和 AI 写作痕迹。
- 改写时必须保留具体事实、数字、日期、产品牌号、测试条件、引用、SEO 字段、
  CTA 目标和证据边界。不得为了“更像人写的”而删除“按具体牌号审核”
  “文件可能不适用”“待确认”等必要限制。
- 不用于改写原始 TDS、MSDS、检测报告、法规原文、来源索引或待确认事项；
  这些文件优先保证技术含义和证据准确性。
- Humanizer 的选择性规则不能覆盖本项目已有的非 GE 主体、合规文件、
  公司事实和产品参数边界。

## 修改与验证

- 编辑文件优先使用 `apply_patch`。
- 修改前查看 `git status --short`，保留用户已有改动。
- 完成后至少运行 `git diff --check`。
- 检查 Markdown 相对链接、文件路径和事实状态是否一致。
- 当前没有代码测试；如果新增前端页面，必须按全局约定配置并使用 Playwright 验证。
- 不执行 `rm -rf`、强制推送、硬重置、`DROP TABLE` 或 `TRUNCATE`。
- 密钥、Token、Cookie 和客户敏感资料不得写入仓库、文案或提交记录。

## 交付时说明

交付结果时说明：

- 修改了哪些文件；
- 是知识、研究、PRD、文案还是代码变更；
- 哪些结论已有文件支持，哪些仍待确认；
- 执行了哪些验证；
- 是否改变了项目阶段或公开声明边界。
