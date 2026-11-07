# AGENTS.md

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
- 子主题版本为 `0.9.9`，Header 品牌为 `GE Chemical & Polymer Group`，
  完整公开主体名称仍保留在 Footer 和公司内容中。
- 首页、Masterbatch Guides、Black/White/Color 指南、Request a Quote、
  Technical Documents、Resources、RFQ Checklist、Buyer FAQ、
  About / Quality 和 Privacy Policy 均已发布。
- 黑色母粒 Page 31 已从回收站父页迁到 Page 59；规范 URL
  `/masterbatch-guides/black-masterbatch/` 直接返回 200。
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
