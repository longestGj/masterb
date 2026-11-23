# 生产发布与实施日志

本文件保存日期化的生产实施历史，追加维护。它不是稳定开发规则，也不能替代
当前线上检查、`SITE_RELEASE.md` 或 `xuqiu/wordpress/AGENTS.md`。

## 当前快照

- 最后核验：2026-11-18
- 正式域名：`https://www.gemasterbatch.com`
- 当前 release：`/var/www/ashareai/releases/20261123-pipe-profile-publish`
- 干净回滚 release：`/var/www/ashareai/releases/20261123-pipe-profile-preview`
- WordPress：`7.1.4`
- 子主题：`mtm-b2b-masterbatch 0.9.79`
- MU Plugin：`mb-seo-schema.php 1.1.2`；`mb-rfq-submissions.php 0.3.1`
- Rank Math SEO：`1.0.281`
- WP Mail SMTP：`4.10.3`
- 搜索引擎索引：`blog_public=1`
- 当前公开路由：18 个页面 Sitemap URL + 7 个 Blog/文章 URL；另有 noindex Thank You 页面，不进入 Sitemap
- 当前图片 Sitemap：31 个 `<image:image>` 节点
- Privacy Policy：`noindex,nofollow`
- 已知未完成：GA4 API Secret（服务端失败事件）、GSC Sitemap 提交确认、
  自动备份与恢复演练、Privacy 法务最终审核、RFQ/Documents 责任人与响应时限
- 已确认完成（2026-11-18）：GA4 Measurement ID `G-WQJTC92XE2`；SMTP
  `smtp.qiye.163.com:465 SSL`，询盘 197 `_mb_rfq_email_sent=1`；GSC
  验证文件 `googleaa2e91750b47f47a.html` 可访问

## 历史记录

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

- 首页以黑、白、彩三类母粒和一般应用背景为主要内容。
- 用户已于 2026-11-09 确认：公司资料中可见的业务事实可以直接用于公开内容，
  包括 `masterbatch manufacturer` 定位、12 条生产线、50,000 吨以上年产能、
  30 多个市场或国家、实验室能力及资料中明确列出的合作品牌。
- 具体产品参数、文件范围、固定 MOQ、价格、交期和法规结论仍必须按具体
  产品或牌号核对，不能由公司规模事实推导。
- 技术文件仍按牌号、应用、国家和用途人工审核，通过邮件回复；
  不提供公开文件下载。
- `img/` 图片已经可用于网站，但照片本身不能作为产品参数、工厂产能、
  客户背书或合规证据。
- `example/` 是首页视觉参考；公司资料中已经出现的生产线、产能、市场和
  品牌信息可用于公开页面，具体牌号与参数仍需对应产品资料。
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
  evidence boundary 和最终 RFQ 组织。该版本发布时未加入公司规模数据；
  2026-11-09 后业务方已授权使用公司资料中的产能、生产线、市场和实验室事实。
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

完整上线、内容、资料、运维和发布待办见
[网站总待办](xuqiu/WEBSITE_TODO.md)。

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
6. 公司资料中的定位、产能、生产线、市场覆盖和实验室事实已获业务方公开
   授权，可在后续首页和 About 版本中直接采用。
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

### 2026-11-09 Company Public Facts Authorization

- 用户确认：公司资料中可以看到的业务事实可以直接公开使用，不再要求另行
  提供“证明”后才可发布。
- 已授权范围包括 `masterbatch manufacturer` 定位、12 条生产线、50,000 吨
  以上年产能、30 多个市场或国家、实验室能力，以及公司资料中明确列出的
  合作品牌。
- 具体产品参数、TDS 数值、合规文件、固定 MOQ、价格、交期和全系列适用
  结论仍按对应产品、牌号、样品和文件范围审核，不能由公司规模事实推导。
- 已同步更新 `COMPANY_PUBLIC_INFORMATION_DRAFT.md`、
  `MASTERBATCH_WEBSITE_CONTENT_STRUCTURE.md`、
  `WORDPRESS_CONTENT_IMPLEMENTATION_SPEC.md` 和子主题 README，移除旧的
  “产能与实验室事实必须另行证明”发布限制。

### 2026-11-09 Homepage Company Facts And Grade Scope

- 首页工厂区新增公司事实条：12 条生产线、50,000+ 吨年产能、30+ 国家市场、
  in-house 实验室测试。
- 黑母粒卡改为五个炭黑含量梯度，并明确 BK035 和 BK040 覆盖高黑度端；
  分散性按具体牌号、当前 TDS 和应用试验审核，不再泛化为整条产品线。
- `tests/homepage.spec.js` 新增事实内容、产品证据边界和
  `1440 / 1024 / 768 / 390 / 320px` 横向溢出检查。本地专项测试为
  `18 passed / 2 skipped`。
- 生产 release 切换为 `/var/www/ashareai/releases/20261109-3`，主题版本为
  `0.9.41`；生产首页返回 200，HTML 已包含新增事实，并加载
  `home-refresh-v2.css?ver=0.9.41`。
- 生产截图和手机指标保存在
  `xuqiu/design-preview/production-home-facts-0.9.41/`；390px 和 320px
  均为两列事实布局，文档宽度与视口一致。

### 2026-11-09 PT-300 Product Detail Page

- 发布 Page 153 `PT-300 - 25% Carbon Black Masterbatch`，规范 URL 为
  `/products/black-masterbatch/pt-300/`，父页为 Page 31。
- 页面使用 `page-pt300-product` 模板和 `template-rendered-v1`，正文源为
  `design-preview/pt300-product-page-v1`，由
  `bin/build-pt300-product-page.js` 生成模板与 CSS。
- 页面围绕 PT-300 的 25% 炭黑、21% LLDPE + LDPE 载体、12% 分散剂和
  41.8% CaCO₃ 填料组织，重点解释它与同为 25% 的 BK025 的差异。
- 页面包含 10 个区块、13 行 PT-300 TDS 参数、3 个应用方向、8 条采购 FAQ、
  PT-300 专属报价/样品/TDS CTA，以及公司规模和实验室事实。
- Black Masterbatch 分类页新增 PT-300 filled series 入口。
- 新增 `content/products/pt300.md`、`tests/pt300-product-page.spec.js`；
  `site-closure-live.spec.js` 已加入 PT-300 与当前已发布 BK025/BK030/BK035
  路由。
- 生产 release 为 `/var/www/ashareai/releases/20261109-5`，主题版本为
  `0.9.43`；生产截图与响应式指标保存在
  `xuqiu/design-preview/production-pt300-v1/`。
- 生产页面为 200，Sitemap 已包含 PT-300；`blog_public=0` 与全局 noindex
  策略保持不变。
- 生产主题当前为 `0.9.43`，仓库主题头仍为 `0.9.38`；生产端
  BK030/BK035 等 `0.9.39` 至 `0.9.40` 更新尚未完整反向同步。后续不得直接
  上传整套本地主题覆盖生产，应先完成反向同步或继续使用生产差异补丁。

### 2026-11-09 PT-450P Product Detail Page

- 发布 Page 158 `PT-450P - 42% Carbon Black Masterbatch`，规范 URL 为
  `/products/black-masterbatch/pt-450p/`，父页为 Page 31。
- 页面使用 `page-pt450p-product` 模板和 `template-rendered-v1`，正文源为
  `design-preview/pt450p-product-page-v1`，由
  `bin/build-pt450p-product-page.js` 生成模板与 CSS。
- 页面按当前 TDS 呈现 42% P-type virgin carbon black、57.8% virgin LLDPE
  载体和 without filler，覆盖 film blowing 与 injection molding，并明确
  re-granulating 不在 PT-450P TDS 应用范围。
- Food Grade: Yes 只按 TDS 标签表达，不扩展为 FDA、EU 或目标市场全面合规。
- 页面包含 10 个区块、13 行 TDS 参数、3 个应用方向、8 条采购 FAQ、
  PT-450P 专属报价/样品/TDS CTA，以及 PT-300 与 BK040 的对比。
- Black Masterbatch 分类页新增 PT-450P no-filler series 入口。
- 新增 `content/products/pt450p.md`、`tests/pt450p-product-page.spec.js`；
  `site-closure-live.spec.js` 已加入 PT-450P 路由。
- 生产 release 为 `/var/www/ashareai/releases/20261109-6`，主题版本为
  `0.9.44`；生产页面返回 200，Sitemap 已包含页面。
- 生产截图与响应式指标保存在
  `xuqiu/design-preview/production-pt450p-v1/`。
- 生产主题当前为 `0.9.44`，仓库主题头仍为 `0.9.38`；继续禁止直接上传
  整套本地主题覆盖生产，必须先同步生产端 BK030/BK035 等文件。

### 2026-11-09 DM2476G Desiccant Masterbatch

- 新建 Desiccant Masterbatch 分类 Page 161
  `/products/desiccant-masterbatch/`，父页为 Page 113。
- 发布 DM2476G 产品 Page 162
  `/products/desiccant-masterbatch/dm2476g/`，父页为 Page 161。
- 产品页使用 `page-dm2476g-product` 和 `template-rendered-v1`；正文源为
  `design-preview/dm2476g-product-page-v1`，由
  `bin/build-dm2476g-product-page.js` 生成模板与 CSS。
- 页面按 TDS 呈现 75.9% grey CaO、24% recycled PE carrier、0% CaCO₃ filler、
  0.10% max moisture、1% recommended dosage 和真空 5 kg × 5 包装。
- 页面覆盖 injection molding、extrusion、film blowing，并明确 pre-drying
  仍优先、产品不是 color masterbatch 或 anti-foam chemistry。
- 页面包含 10 个区块、12 行 TDS 参数、8 条采购 FAQ、DM2476G 专属报价、
  样品和 TDS CTA。
- Header、Footer 和 Black Masterbatch 相关产品区均已加入 Desiccant 入口。
- 新增 `content/products/dm2476g.md`、`content/pages/desiccant-masterbatch.md`
  和 `tests/dm2476g-product-page.spec.js`；主路由测试已加入分类页与产品页。
- 首次发布为 `/var/www/ashareai/releases/20261109-9`、主题 `0.9.47`；
  当前版本见本文末尾的 2026-11-09 全站结构修复记录。
- 生产截图与响应式指标保存在
  `xuqiu/design-preview/production-dm2476g-v1/`。
- Desiccant Masterbatch 分类页新增面包屑
  `Products / Desiccant Masterbatch`，不显示 Home，也不把隐藏的结构页
  `/products/` 输出为链接。产品页保留三级层级
  `Products / Desiccant masterbatch / DM2476G`。
- 分类面包屑由 `[mb_product_breadcrumb]` 输出，样式隔离在
  `assets/css/product-category-breadcrumb.css`，仅对 `page-products`
  模板加载。Black Masterbatch 原有
  `Products / Black masterbatch` 面包屑保持不变。
- `0.9.47` 补齐桌面 Products 下拉和手机二级菜单中的
  `Desiccant masterbatch`，并在 Footer 的 Product Lines 加入对应入口。
  Header 的 Products 菜单和 Footer 现在与四个已发布产品分类一致。
- 模板 part 文件切换后，PHP-FPM 工作进程仍可能保留已解析的块模板缓存；
  发布后需平滑 `reload php8.3-fpm` 并重新验证实际 HTML。
- 本次补丁基于真实 `0.9.45` 生产文件最小修改，保留 BK025 等已有产品页
  CSS 与 body class；线上 DM2476G、分类页、Header/Footer 测试通过，
  BK025 与首页回归返回 200。
- 生产主题当前为 `0.9.47`，仓库主题头仍为 `0.9.38`；继续禁止直接上传
  整套本地主题覆盖生产，必须先同步生产端 BK030/BK035 等文件。

#### DM2476G source-content refresh (deployed 2026-11-09)

- 用户确认 `product/DM2476G-产品页.md` 是产品页内容主源。此前生产页只对齐了
  TDS 参数，没有完整实现原稿的营销文案方向和 49 个 FAQ 问题。
- 本地已将 H1 恢复为 `Desiccant Masterbatch DM2476G`，SEO Title 调整为
  `Desiccant Masterbatch DM2476G | 75.9% CaO`，并同步页面描述和数据文件的
  `hero`、`seo` 字段。
- 本地产品页保留现有 10 个主视觉区块、URL、面包屑和 5 张图片，正文已扩展
  到约 3,200 个英文单词；参数表拆为与 TDS 对应的 13 行。
- 原稿 49 个 FAQ 标题已逐字同步，按 Product and chemistry、Applications
  and trial、Packing and handling、Production practice、Supplier and
  documents、Purchasing and rollout 六组折叠输出，并增加组内导航。
- 原稿中的个人手机号、个人邮箱、详细地址和未确认的 COA/SDS 能力没有进入
  页面。产品事实继续限定在 DM2476G 当前 TDS 和已批准公司公开事实内。
- 修改源为 `xuqiu/design-preview/dm2476g-product-page-v1/`，通过
  `xuqiu/wordpress/bin/build-dm2476g-product-page.js` 生成主题模板和 CSS。
- 本地 Playwright 覆盖单一 H1、13 行参数、49 个 FAQ、6 个分组、所有原稿
  FAQ 标题、5 张图片、CTA 和 `1440 / 1024 / 768 / 390 / 320px` 横向溢出。
- 以上变化已随 release `20261109-11`、主题 `0.9.49` 上线；生产页为
  `Desiccant Masterbatch DM2476G`，49 个 FAQ 和 13 行 TDS 已生效。

#### PT-300 and PT-450P source-content refresh (deployed 2026-11-09)

- 用户确认 `product/PT-300-产品页.md` 和
  `product/PT-450P-产品页.md` 同样是产品页内容主源。此前两页只对齐了
  TDS 参数，实际各只实现 8 个 FAQ。
- PT-300 本地 H1 已恢复为 `Black Masterbatch PT-300`，SEO Title 为
  `Black Masterbatch PT-300 | 25% Carbon Black`；参数表扩为 15 行；
  原稿 45 个 FAQ 标题和答案全部进入页面，按 6 组折叠输出。
- PT-450P 本地 H1 已恢复为 `Black Masterbatch PT-450P`，SEO Title 为
  `Black Masterbatch PT-450P | 42% P-Type, No Filler`；参数表扩为 16 行；
  原稿 50 个 FAQ 标题和答案全部进入页面，按 6 组折叠输出。
- 两页均保留现有 URL、面包屑、10 个主视觉区块和 5 张产品图片，并增加
  FAQ 分组导航。原稿中继承的旧产品链接已改为当前 `/products/` 规范路由。
- PT-450P 原稿中的个人电话、详细地址以及无条件承诺 COA/SDS 的内容没有
  发布；Food Grade 仍只按当前 TDS 标签表达。PT-450P 内容元数据的错误
  来源 `product/x.md` 已改为 `product/PT-450P-产品页.md`。
- 修改源为 `xuqiu/design-preview/pt300-product-page-v1/` 和
  `xuqiu/design-preview/pt450p-product-page-v1/`，分别通过现有 build
  script 生成模板和 CSS。
- 本地 Playwright 直接比较原稿 FAQ 标题与页面标题，覆盖单一 H1、15/16 行
  参数、45/50 个 FAQ、6 个分组、CTA、敏感信息排除和
  `1440 / 1024 / 768 / 390 / 320px` 横向溢出；专项测试为
  `16 passed / 4 skipped`。
- 两页已随 release `20261109-11`、主题 `0.9.49` 上线，45/50 个 FAQ、
  15/16 行 TDS 和更新后的 H1/SEO 均已在生产生效。

#### 2026-11-09 Site structure and content audit fixes (deployed)

- 纠正审计口径：只有 BK020 的原稿包含 40 个客户 FAQ；BK025、BK030、
  BK035、BK040 原稿实际各 8 个 FAQ，当前生产页已经完整。后续统计 FAQ
  时只计算 `## FAQ Guide` 到 `## 内部说明` 之间的标题。
- 本地 BK020 页面已同步生产模板基线，H1 改为 `Black Masterbatch BK020`，
  参数表扩为 15 行，并补齐原稿 40 个 FAQ，按 6 组折叠输出。原稿中的
  MOQ、交期、付款、OEM 和全系列合规承诺已改为报价或具体文件审核口径。
- White Masterbatch 和 Color Masterbatch 已从“RFQ Guide”改成产品分类页，
  H1、SEO、页面任务和正文入口改为产品定位；共享分类模板新增真实颗粒图，
  并接入 `Products / White masterbatch` 和
  `Products / Color masterbatch` 面包屑。
- Desiccant 分类页从 143 词扩展到约 770 词，增加应用、DM2476G 参数、
  询盘输入、试验流程、文件边界和 FAQ，并加入产品与工厂图片。
- `Resources / Masterbatch RFQ Checklist` 现在输出两级面包屑。
  Blog 归档和文章面包屑已移除 Home；文章为 `Blog / title`。
- `/masterbatch-guides/` 已停止作为独立内容中心，WordPress
  `template_redirect` 以 301 指向 `/resources/`。Header 的
  `Buyer Resources`、首页、About、FAQ、Quote 和相关内容中的入口全部
  改到 `/resources/`。
- Contact 页面的背景图路径从错误的
  `../../wordpress/themes/...` 改为 `../images/...`。
- Black 分类页新增 PT-450P 和 DM2476G 的直接入口，BK040 相关页新增
  PT-450P，改善两个产品页只有单一入站链接的问题。
- 本地新增 `tests/bk020-product-page.spec.js` 和
  `tests/content-structure.spec.js`，覆盖 FAQ 原稿一致性、产品分类定位、
  面包屑、Blog 无 Home、Resources 301、Contact 资源路径和交叉内链。
- 生产已切换为 release `20261109-11`、主题 `0.9.49`；
  `20261109-9` 及 `20261109-10` 保留回滚。
- 线上验收覆盖 White/Color/Checklist 面包屑、Blog 无 Home、
  `/masterbatch-guides/` 301 且保留查询参数、Contact 无 404、
  BK020 40 FAQ、DM2476G 49 FAQ、PT-300 45 FAQ、PT-450P 50 FAQ，
  以及桌面与手机主路由。专项线上测试 `36 passed`。
- Rank Math Sitemap 已重新生成：BK020 已进入，旧
  `/masterbatch-guides/` 已退出。

#### Desiccant category visual refresh (deployed)

- 用户确认 Desiccant 分类页需要从通用 `page-products` 正文模板改为 Black
  Masterbatch 风格的独立分类模板。
- 新增 `templates/page-desiccant-masterbatch.html`、
  `assets/css/desiccant-category.css` 和
  `bin/build-desiccant-category-page.js`。页面复用
  `black-masterbatch-guide.css` 的 Shared category system，并增加产品专属
  body class 与少量布局覆盖。
- 新页面包含 Hero、7 项分类导航、product role、selection inputs、
  DM2476G 参数、application routes、trial boundary、documents、factory、
  FAQ 和最终 inquiry，共 10 个主区块。
- 页面文案以 `product/DM2476G-产品页.md` 为主源，明确 75.9% grey CaO、
  24% recycled PE、0% CaCO3、0.10% max moisture、1% starting dosage、
  5 kg 真空袋包装、三类应用、预干燥边界和文件范围。
- 图片不使用产品详情页反复出现的母粒近景，改为 5 张独立站点素材：
  factory-building、packaging、palletized-shipment、workshop-equipment 和
  factory-exterior-01；生产压缩为 32–232 KB 的 WebP。
- Page 161 已绑定 `page-desiccant-masterbatch`，
  `_mb_body_format=template-rendered-v1`。
- 生产 release 为 `/var/www/ashareai/releases/20261109-12`，主题
  `0.9.50`；`20261109-11` 保留回滚。
- 线上桌面与手机专项测试 `20 passed`，覆盖 H1、10 个区块、7 项导航、
  7 行参数、8 个 FAQ、5 张图片、DM2476G 面包屑和横向溢出。

#### 2026-11-09 Full public SEO audit fixes (deployed)

- 审计覆盖 25 个公开页面和文章，并检查 `/masterbatch-guides/` 301。
  修复前的主要问题是：所有页面仍因 staging 策略输出 `noindex,nofollow`；
  Rank Math 把首页、分类页、产品页、FAQ、About 和 Contact 等非文章页面
  统一标为 `Article`；Color 分类页存在错误的
  `White masterbatch review inputs` H2；Resources 仍把产品分类称为
  `RFQ guide`。
- FAQ、About 和 Contact 的 H1 已分别改为
  `Masterbatch buyer FAQ for plastic processors.`、
  `About GE Chemical and masterbatch review.` 和
  `Request a masterbatch quote.`，使 H1 与页面角色、Title 和搜索意图一致。
- 新增 MU Plugin `mu-plugins/mb-seo-schema.php`。它在 Rank Math
  完成实体连接后按页面角色调整 JSON-LD：
  - 博客文章保留 `BlogPosting`，Blog 使用 `CollectionPage`；
  - 产品分类与 Resources 使用 `CollectionPage`；
  - 产品详情使用 `Product`；
  - Buyer FAQ 使用 `FAQPage`，包含页面上可见的 20 个问答；
  - 首页、About、Contact、Documents、RFQ Checklist 和 Privacy Policy
    不再错误输出 `Article`。
- White、Color 和 Carbon Black Content 文章的长 Title 已收紧；BK020、
  PT-300、DM2476G、Buyer FAQ 和 RFQ Checklist 的过短 Title 已补足页面
  类型或采购信息。Blog 和 Resources 的 Description 已回到约 120–155
  字符的摘要范围。
- 首页、Black、White、Color、Technical Documents 和 About 使用的 8 张
  JPG 内容图片已转为 WebP，并同步修正 HTML `width/height` 与实际像素
  尺寸；Footer 品牌图和无障碍读取的 Desiccant 图片尺寸也已校正。
- `bin/apply-seo-audit-fixes.php` 是可重复执行的数据库迁移源，负责
  Color H2、Resources 产品命名及上述 SEO 元数据。
- `tests/seo-audit.spec.js` 覆盖页面角色 Schema、Title/Description 长度、
  H1、Heading 层级、robots、内容图片格式，以及 25 个公开 URL 的逐页
  审计。
- 生产 release 已切换为 `/var/www/ashareai/releases/20261109-13`，
  主题版本 `0.9.51`；`20261109-12` 保留用于回滚。
- 生产完整 Playwright 为 `165 passed / 5 skipped`；新增全站逐页 SEO
  审计另为 `2 passed`。项目 PHP 语法门禁通过，`git diff --check`
  通过。
- `blog_public=0` 和 Nginx `X-Robots-Tag: noindex, nofollow` 继续保持。
  正式换域名并准备开放索引时，仍需统一处理：设置 `blog_public=1`、
  移除临时 Nginx noindex、重新生成 Sitemap，并验证每个公开 URL 的
  self-canonical、Sitemap 收录关系和 Search Console 属性。
- 生产 `functions.php` 仍包含仓库尚未完整反向同步的 BK025/BK030/BK035
  更新。本轮只对生产文件做字符串级最小补丁，继续禁止将本地整套主题
  直接覆盖生产。

#### 2026-11-09 Unused content cleanup

- 清理前已导出完整生产数据库备份：
  `/var/www/ashareai/backups/ashareai-db-pre-unused-cleanup-20261109.sql.gz`。
  文件权限为 `0600`，大小 `390,023` bytes，SHA-256 为
  `673ffac906225cfe44526e97f659a39812f730d5817ec01beb15b75697663725`。
- 新增 `bin/cleanup-unused-content.php`，默认 dry-run，只有设置
  `MB_CLEANUP_APPLY=1` 时才执行删除。清理规则为：
  - 强制删除 Page、Post 和旧 Product 类型回收站记录；
  - 删除 Page/Post 自动草稿；
  - 当前 23 个发布 Page 和 4 篇发布 Post 各保留最近 3 个修订；
  - 回收站或已不存在父记录下的修订全部删除。
- 实际清理 `61` 条记录：`40` 条旧修订、`16` 条回收站内容、
  `5` 条自动草稿。清理后 revision 从 `92` 降至 `52`，回收站和自动草稿
  均为 `0`。
- 23 个发布 Page、4 篇发布 Post、现有私有询盘记录均未删除。
  Page 59 `/masterbatch-guides/` 和 Page 113 `/products/` 继续保留，
  因为两者仍承担 301 和产品 URL 层级作用。
- 已执行 `wp db optimize` 和清理后 `wp db check`，数据库完整性检查通过；
  WP-CLI 报告的数据库大小从约 `6 MB` 降至约 `4 MB`。
- 清理后生产 `site-closure-live` 与 `seo-audit` 回归为 `26 passed`。

#### 2026-11-10 Remove White and Color Masterbatch product lines

- 业务方确认公司当前不再提供 White Masterbatch 和 Color Masterbatch。
  公开网站当前只保留 **Black Masterbatch** 和 **Desiccant Masterbatch**
  两条产品线。
- 删除 Page 77 `/products/white-masterbatch/` 和 Page 78
  `/products/color-masterbatch/`，生产发布 Page 从 23 个降为 21 个，Post
  保持 4 篇。
- 以下旧 URL 以精确 301 指向首页并保留查询参数：
  `/products/white-masterbatch`、`/products/white-masterbatch/`、
  `/products/color-masterbatch`、`/products/color-masterbatch/`、
  `/masterbatch-guides/white-masterbatch/`、
  `/masterbatch-guides/color-masterbatch/`。
- Header、Footer、首页、About、FAQ、Contact、Documents、Resources、RFQ
  Checklist 和全部产品详情页已移除 White/Color 产品入口与描述。首页产品区
  改为 Black / Desiccant 两张卡片。
- 表单产品选项改为 `Black masterbatch / Desiccant masterbatch / Not sure`；
  `target_color_function` 改为 `target_requirement`，并删除颜色参考类型字段。
- FAQ 从 20 题减为 19 题，删除颜色定制问题；FAQPage Schema 同步减少为
  19 个 Question。
- 已删除 `content/guides/white-masterbatch.md`、
  `content/guides/color-masterbatch.md` 和 `page-product-guide` 模板；
  对应未使用主题图片同步移除。
- How to Choose Masterbatch for Blown Film 与 Masterbatch Supplier Vet
  Checklist 已移除 White/Color 段落和链接。PT-300、PT-450P、DM2476G、
  Black 分类页与 Desiccant 分类页的关联产品内容只保留当前产品线。
- 清理前备份：
  `/var/www/ashareai/backups/ashareai-db-pre-remove-white-color-20261110.sql.gz`，
  `285,360` bytes，SHA-256
  `340c95d917000847a7953c34d37cdc2d96b0b17eeace052f91d55317ffa07b85`。
- 生产 release 已切换为 `/var/www/ashareai/releases/20261110-1`，主题版本
  `0.9.52`；`20261109-13` 保留回滚。
- 数据库中的 Page、Post、revision、post excerpt 和 `_mb_front_matter`
  已完成 White/Color 字符串扫描，公开数据库内容无残留。
- 生产服务器内部审计 23 个公开 URL：全部按预期为 `200`、单一 H1，
  White/Color 字符串命中为 `0`。核心线上 Playwright
  `content-structure / site-closure / SEO audit` 为 `6 passed`；
  Header/Footer、RFQ 和 About 组合回归为 `17 passed`，另有 1 项因本地到
  服务器公网连接被关闭而重试失败，服务器内部请求正常。
- 完整本地 Playwright 门禁为 `97 passed / 77 skipped`；移动端 Header /
  Footer 复测实际宽度为 `390/390`、无横向溢出，公网连接抖动已由单测重试
  排除，服务器内部请求正常。
- Rank Math Sitemap 缓存已失效并重建，`page-sitemap.xml` 不再包含
  White/Color 页面，当前包含 16 个页面 URL。
- 最终数据库数量为 21 个发布 Page、4 篇发布 Post、39 条 revision；
  Page、Post、revision、摘要和 postmeta 的 White/Color 字符串扫描均为零。
- `blog_public=0`、页面 robots 和 Nginx `X-Robots-Tag: noindex, nofollow`
  继续保持。

#### 2026-11-10 Homepage keyword alignment

- 首页 SEO 定位改为 Black Masterbatch 优先，Desiccant Masterbatch 作为第二
  产品线。
- Page 53 标题改为 `Black Masterbatch Manufacturer in China`。
- SEO Title 改为
  `Black Masterbatch Manufacturer in China | GE CHEMICAL`。
- Meta Description 为：
  `Black masterbatch manufacturer in China for 20 to 40 percent carbon black
  and CaO desiccant masterbatch. Share resin, process and application for
  review.`
- Description 不使用 `%–40%`，因为 Rank Math 会把两个 `%` 之间的内容当作
  变量并删除。
- H1 改为 `Black Masterbatch Manufacturer & Supplier in China`，首屏摘要覆盖
  manufacturer、black masterbatch 和 desiccant masterbatch。
- Hero 主 CTA 改为 `Explore black masterbatch`，次 CTA 改为 `Get a quote`。
- 首页 H1 字号单独收紧，桌面 `clamp(3.5rem, 5.4vw, 5.65rem)`，手机
  `clamp(3rem, 13vw, 4rem)`，避免长关键词标题破坏版式。
- 根目录 `首页-homepage.md` 已重写为当前 Black + Desiccant 首页方案，删除
  历史 White/Color 规划，并同步当前 `/products/` 路由、关键词落位、内链、
  图片和验收标准。
- 修改前数据库备份：
  `/var/www/ashareai/backups/ashareai-db-pre-home-keyword-20261110.sql.gz`，
  `97,939` bytes，SHA-256
  `8873bde778c7027f2a323c279203b8d043131caf1aca5aac158522efa44ccb9f`。
- 检测到并发部署后，本轮没有覆盖 `20261110-2`，而是在其基础上创建
  `/var/www/ashareai/releases/20261110-3`，主题版本 `0.9.54`。
- 生产验证：Title、H1 和 Description 均正确输出；首页包含
  `black masterbatch` 17 次、`desiccant masterbatch` 10 次、
  `manufacturer` 8 次。桌面和手机首页与 SEO 专项测试为 `8 passed`。
- `blog_public=0` 和 staging noindex 保持不变。

#### 2026-11-10 Header Applications hidden

- 桌面 Header 和手机 Header 均已隐藏 `Applications` 链接。
  Footer 的 Applications 入口继续保留。
- Resources 下拉仍保留 Buyer Resources、Blog、Buyer FAQ 和 Technical
  Documents，因为这些页面都有实际引用：
  - `/resources/`：主题与模板中 15 处，内容源中 6 处；
  - `/faq/`：主题与模板中 5 处，内容源中 4 处；
  - `/technical-documents/`：主题与模板中 29 处，内容源中 10 处；
  - `/resources/masterbatch-rfq-checklist/`：主题与模板中 3 处，
    内容源中 5 处。
- 首页生产 HTML 中，Header Applications 为 `0`，Footer 仍为 `1`。
- 生产 release 切换为 `/var/www/ashareai/releases/20261110-4`，主题
  `0.9.55`；`20261110-3` 保留回滚。
- Header/Footer 桌面与手机线上测试为 `4 passed`；桌面宽度 `1440/1440`，
  手机宽度 `390/390`，无横向溢出。

### 2026-11-10 全站字体系统

- 子主题版本升至 `0.9.56`。全站标题改用自托管 Archivo 600，正文、导航、
  按钮、表格和表单改用自托管 Inter 400-700。
- 字体文件位于
  `themes/mtm-b2b-masterbatch/assets/fonts/archivo/` 和
  `assets/fonts/inter/`，每份文件均由 Google Fonts 取得的拉丁字符
  WOFF2 子集，并保留对应 `OFL.txt`。
- `design-tokens.css` 定义 `@font-face`、字体家族和跨平台回退；
  `functions.php` 在 `wp_head` 预加载两份字体；`style.css` 负责全局正文、
  表单继承和标题 600 字重。
- Georgia 与 Avenir Next 已从活动主题样式中移除。Avenir Next 在
  Windows/Android 不存在，旧方案会按客户端回退到不同字体。
- 已用线上页面注入方式比较桌面和手机首页、Resources、BK040、文章和
  RFQ 表单；计算样式在 5 个代表性路由均为 Archivo + Inter。
- 字体对照材料保存在
  `xuqiu/design-preview/font-system-v1/`。本地 Playwright 全量回归为
  `99 passed / 77 skipped`，字体专项测试在桌面和手机均为 `2 passed`。
- 已发布到生产 release `/var/www/ashareai/releases/20261110-5`；
  `20261110-4` 保留回滚。
- 部署使用生产主题最小补丁脚本
  `xuqiu/wordpress/bin/apply-font-system.php`，未上传本地整套主题，
  生产已有的 BK025/BK030/BK035 页面文件保持不变。
- 生产 8 个代表路由均返回 200；两份字体均返回
  `200 font/woff2`，首页输出 2 个字体预加载标签。
- 生产字体专项 Playwright 在桌面和手机为 `2 passed`；Header/Footer、
  主路由、表单和预发布 noindex 策略复跑为 `27 passed / 1 skipped`。

### 2026-11-10 域名迁移与正式开放索引

- 生产正式域名已迁移为
  `https://www.gemasterbatch.com`。`ashareai.com` 和
  `www.ashareai.com` 已由业务方确认永久废弃，不恢复 DNS，不做 301。
- WordPress `home` 和 `siteurl` 均为
  `https://www.gemasterbatch.com`；全库旧域名搜索替换 dry run 为 0。
  首页、询盘页、隐私政策、robots.txt 和全部 Sitemap 均不再输出旧域名。
- 域名迁移使用 release `/var/www/ashareai/releases/20261110-3`，
  主题仍为 `0.9.56`。与字体发布 release `20261110-5` 相比，主题内容只有
  指向新域名的 `rfq-qr.png` 不同。
- 业务方已确认正式开放搜索收录。生产已切换为 `blog_public=1`，
  Nginx 临时 `X-Robots-Tag: noindex` 已删除，首页输出
  `index, follow` 和 self-canonical。
- Rank Math Sitemap 已重新生成；首页重新进入 `page-sitemap.xml`，
  Privacy Policy 继续排除。三个子 Sitemap 中旧域名引用均为 0。
- Nginx 修改前配置备份位于
  `/var/backups/ashareai/nginx/gemasterbatch.com.conf.pre-index-20261110T095058Z`。
- 旧域名 Nginx server block、`/etc/nginx` 下旧配置文件和旧
  `www.ashareai.com` Certbot 证书已清理。可恢复备份位于
  `/var/backups/ashareai/retired-ashareai-20261110T100853Z/`。
- 当前 `nginx -T` 只包含 `gemasterbatch.com` 和
  `www.gemasterbatch.com`；Certbot 只管理 `gemasterbatch.com`。
- 仍待业务方使用 Google 账号验证
  `www.gemasterbatch.com` Search Console 属性并提交
  `https://www.gemasterbatch.com/sitemap_index.xml`。
- About / Quality Hero 在桌面端原使用底对齐，1440px 时右侧机构说明被向下
  压低约 `150px`。0.9.57 将该断点的内容改为顶部对齐并增加 `12px` 文本
  内距；手机和平板单列布局不变。
- About 修复的生产 release 为
  `/var/www/ashareai/releases/20261110-6`，上一版
  `/var/www/ashareai/releases/20261110-3` 保留回滚。
- Buyer FAQ Hero 在 1440px 时原从 `x=57.6px` 开始，未对齐全站标准容器。
  0.9.58 将 `faq-open` 改为 1240px 容器的水平对齐公式，标题移到
  `x=100px`，并在标题上方加入 `Resources / Masterbatch Buyer FAQ`
  面包屑。
- FAQ 修复的生产 release 为
  `/var/www/ashareai/releases/20261110-7`，上一版
  `/var/www/ashareai/releases/20261110-6` 保留回滚。
- FAQ 面包屑与 `Masterbatch Buyer FAQ` 标签在首次发布时实际间距为
  `0px`。0.9.59 改为 `var(--ge-space-lg)`，桌面和手机计算值均为 `24px`。
- 面包屑间距修复的生产 release 为
  `/var/www/ashareai/releases/20261110-8`，上一版
  `/var/www/ashareai/releases/20261110-7` 保留回滚。
- Technical Documents 已从旧通用模板升级为 `mtm-docs-v2`，新增
  `Resources / Request Masterbatch Technical Documents` 面包屑、1240px
  Hero、请求准备清单、人工审核流程、合规边界和专属 Documents 表单样式。
- Technical Documents v2 的模板内容逐条来自
  `content/pages/technical-documents.md`；`tests/document-request-page.spec.js`
  会校验 Markdown 全部正文都进入页面，防止设计与文案源分叉。
- Technical Documents v2 的生产 release 为
  `/var/www/ashareai/releases/20261110-9`，上一版
  `/var/www/ashareai/releases/20261110-8` 保留回滚。
- Resources 已改为与 Products 一致的纯导航分类。Header 下拉包含 Blog、
  Buyer FAQ、Technical Documents 和 RFQ Checklist，不再出现独立的
  Buyer Resources 入口。
- `/resources/` 保留为 RFQ Checklist 的结构父页，但通过 Nginx 精确 301
  到 `/blog/`，并设置为 noindex、从 Sitemap 排除。旧
  `/masterbatch-guides/` 同样直接 301 到 `/blog/`。
- 首页、About、RFQ、FAQ、Blog 和面包屑中的泛化 Resources 链接已改为
  具体目标页面。
- Resources 导航修复的生产 release 为
  `/var/www/ashareai/releases/20261110-10`，上一版
  `/var/www/ashareai/releases/20261110-9` 保留回滚。
- BK025、BK030、BK035 的专属 CSS 原本存在，但 `functions.php` 未按模板
  加载，也未添加对应 body class；手机端原始大图因此把文档宽度撑到约
  `1400px`。
- 0.9.62 补齐 BK025/BK030/BK035 的样式条件加载、辅助判断函数和
  `mtm-bk025-page` / `mtm-bk030-page` / `mtm-bk035-page` body class。
  三页在 390px 下文档宽度均恢复为 `390px`。
- BK 手机修复的生产 release 为
  `/var/www/ashareai/releases/20261110-11`，上一版
  `/var/www/ashareai/releases/20261110-10` 保留回滚。
- RFQ Checklist 已从通用 `page-resources` 模板迁移到
  `page-rfq-checklist`。新页面使用五个章节、18 个可勾选条目、Breadcrumb、
  文件边界和真实 RFQ / Documents CTA，并加载专属
  `rfq-checklist-v2.css`。
- RFQ Checklist 的模板内容逐条来自
  `content/pages/masterbatch-rfq-checklist.md`；专项测试校验 Markdown
  全部正文均进入页面。
- 生产 release 为 `/var/www/ashareai/releases/20261110-12`，上一版
  `/var/www/ashareai/releases/20261110-11` 保留回滚。
- RFQ Checklist 的 18 个复选框现在有明确用途：页面注明勾选只在本地
  自检、不提交或保存；同时显示实时计数、进度线，并提供
  `Clear checklist` 按钮。交互脚本只在该模板按需加载。
- RFQ Checklist 本地进度修复的 release 为
  `/var/www/ashareai/releases/20261110-13`，上一版
  `/var/www/ashareai/releases/20261110-12` 保留回滚。
- RFQ Checklist 的 Hero 上间距、面包屑下间距和清单区上间距已收紧。
  1440px 下三层间距约为 `58 / 48 / 49px`；390px 下为
  `29 / 48 / 49px`。
- 间距修复的生产 release 为
  `/var/www/ashareai/releases/20261110-14`，上一版
  `/var/www/ashareai/releases/20261110-13` 保留回滚。
- Privacy Policy 已从通用 1120px 示例模板升级为独立法律阅读页：
  深绿封面、桌面固定目录、移动端可展开目录、760px 窄正文阅读栏，
  正文继续直接来自 Page 69，不在模板中复制法务内容。
- `[mb_privacy_policy_body]` 会从当前 Page 的 Gutenberg 正文生成章节
  wrapper 和锚点，`[mb_privacy_policy_toc]` 由同一份正文生成目录，
  避免数据库正文与模板目录分叉。
- Privacy Policy 继续输出 `noindex,nofollow`；公开页面继续输出
  `index,follow`。SEO 审计测试已按这一正式发布策略同步。
- Privacy Policy v2 的生产 release 为
  `/var/www/ashareai/releases/20261110-15`，主题 `0.9.66`；上一版
  `/var/www/ashareai/releases/20261110-14` 保留回滚。
- 生产专项测试 `4 / 4` 通过；跨页面导航、主路由、RFQ 与站点闭环为
  `47 passed / 1 skipped`，SEO 专项复跑 `10 / 10`。生产
  `1440 / 1024 / 768 / 390 / 320px` 均无横向溢出，Header 与 Hero
  无缝衔接，12 个章节和目录锚点完整。
- Rank Math 已启用图片 Sitemap，但 `img/` 与主题模板图片不属于媒体库
  附件，插件默认无法自动发现。MU Plugin `mb-seo-schema.php` `1.1.0`
  现按页面 slug 显式补录主题图片，并强制输出 HTTPS 图片 URL。
- `page-sitemap.xml` 当前包含 29 个 `<image:image>` 节点，覆盖首页、
  Black / Desiccant 分类页、全部当前产品详情页、About 和
  Technical Documents。服务端逐一验证 29 个 URL 均返回
  `200 image/webp`。
- 图片 Sitemap 的生产 release 为
  `/var/www/ashareai/releases/20261110-17`；干净回滚版本
  `/var/www/ashareai/releases/20261110-15` 保留。失败的中间 release 16
  已移至 `/var/backups/ashareai/releases/20261110-16-failed-image-sitemap`。

## 2026-11-17 文章草稿导入（未发布）

- 对象：Post 211 `black-masterbatch-for-injection-molding`，状态 `draft`，
  分类 `Masterbatch Guides`（term 7）。
- 媒体：Attachment 210 `black-masterbatch-injection-molding.webp`
  （1600×1200 WebP，45,204 字节），已设为 `_thumbnail_id`；Alt 为注塑机
  示意图描述。图片 URL 返回 `200 image/webp`。
- 正文：与本地
  `content/posts/black-masterbatch-for-injection-molding.wordpress.html`
  的 MD5 一致（`ff84edefdedb01b54988c0026a1cec02`），15,079 字符。
- SEO meta：Title `Black Masterbatch for Injection Molding: Buyer Guide`；
  Description 132 字符；Focus keyword `black masterbatch for injection
  molding`。
- 索引状态：`_mb_robots=noindex,nofollow`、`_mb_noindex=1`、
  `rank_math_robots` 为 noindex/nofollow；草稿公开访问 `?p=211` 返回
  `404`，未进入 `post-sitemap.xml`。
- 生产 release 未切换：`/var/www/ashareai/releases/20261110-17`，
  主题 `mtm-b2b-masterbatch 0.9.66`。
- 回滚：确认没有其他引用后，`wp post delete 211 --force`，再
  `wp post delete 210 --force`。
- 未执行：正式发布、Rank Math 切换 index、Sitemap 重新生成、发布后的
  桌面/手机/Canonical/Schema/OG 验证。
- 入站链接（本地已准备，未部署）：Black 分类页 Applications 文案链接、
  Carbon Black Content 文章末段链接；Blog 归档在发布后自动展示。三项必须
  与 Post 211 同一次发布，避免链接指向草稿 404。


## 2026-11-18 发布：Injection Molding 文章与入站链接

- 发布对象：Post 211 `black-masterbatch-for-injection-molding`，状态
  `publish`，URL
  `https://www.gemasterbatch.com/blog/black-masterbatch-for-injection-molding/`。
- 主题 release：`/var/www/ashareai/releases/20261118-injection-1`，基于
  `20261116-meta`；子主题 `mtm-b2b-masterbatch 0.9.67`。
- 模板：`page-black-masterbatch.html` 的 Applications 文案加入
  Injection Molding 入站链接。
- 文章：Post 147 `how-to-choose-carbon-black-content` 更新，加入指向新文章
  的 related link；正文与本地 HTML 的 MD5 一致。
- 媒体：Attachment 215 为无文字注塑机示意图（1600×900，WebP），用于
  Featured Image 和 OG；Attachment 210 为带文字封面，保留但当前未使用。
  首次发布后检查发现文字封面作为 Hero 背景会与 H1 叠字，因此改用无文字
  版本后重新验证。
- SEO：Title 52 字符；Description 132 字符；Canonical
  `https://www.gemasterbatch.com/blog/black-masterbatch-for-injection-molding/`；
  `index,follow`；输出 `BlogPosting`、`WebPage`、`Organization`、`WebSite`、
  `Person`、`ImageObject`。文章页未输出 `BreadcrumbList`，为全站既有行为，
  不是本次新增问题。
- Sitemap：`post-sitemap.xml` 已包含新 URL；Rank Math 重新生成 4 个缓存。
- 验证：
  - `tests/articles.spec.js`：2 passed
  - `tests/seo-audit.spec.js`（title、page basics、JSON-LD 分组）：各 2 passed
  - `tests/blog-archive.spec.js`：4 passed
  - 桌面 1440px、手机 390px 无横向溢出；截图在
    `xuqiu/design-preview/production-injection-article-20261118/`
  - Black 分类页、Carbon 文章、Blog 归档均能访问到新文章链接
- 回滚：
  - 主题：原子切回 `/var/www/ashareai/releases/20261116-meta`。
  - Post 147：用
    `/var/www/ashareai/backups/post-147-pre-injection-link-20261118.html`
    恢复正文。
  - Post 211：改回 `draft` 或删除；如删除，同时处理 Attachment 210/215。
  - 数据库备份：
    `/var/www/ashareai/backups/ashareai-db-pre-injection-article-20261118.sql.gz`。
- 备注：`/products/black-masterbatch/` 和 `/about-quality/` 在缓存清空后的
  首次请求偶发 6–21 秒，后续请求恢复正常；本次未发现 5xx 或 PHP 错误。

## 2026-11-18 待办状态核对

- GA4 Measurement ID 已配置并在首页加载（`G-WQJTC92XE2`）。
- SMTP 已配置为 `smtp.qiye.163.com:465 SSL`；询盘 197 的
  `_mb_rfq_email_sent=1`，说明邮件投递链路已走通。仍需业务方确认
  RFQ/Documents 收件人和响应时限。
- GSC 站点验证文件 `googleaa2e91750b47f47a.html` 可公开访问；Search
  Console 属性和 Sitemap 提交状态无法仅从服务器确认，仍需账号侧核对。
- `MASTERBATCH_GA4_API_SECRET` 未在 WordPress option 或 FPM 环境变量中
  发现；服务端 GA4 邮件失败事件当前不会发送。
- 未发现 WordPress 自动备份 cron；`/var/www/ashareai/backups/` 只有手动
  数据库备份（最近一次 2026-11-18）。自动备份、异地副本和恢复演练仍待做。
- Privacy Policy 仍为 `noindex,nofollow`，法务最终审核仍待业务确认。
- 文章页全站未输出 `BreadcrumbList` Schema；post sitemap 未包含文章
  featured image 的图片节点。两项均为既有缺口，不影响本次发布。
- 历史记录中 BK025/BK030/BK035 反向同步问题已在 2026-11-17 的同步中补齐
  模板、CSS 和图片；该条不再作为当前缺口。


## 2026-11-18 Film & Packaging 页面草稿预览

- 主题 release：`/var/www/ashareai/releases/20261118-film-1`，基于
  `20261118-injection-1`；子主题 `mtm-b2b-masterbatch 0.9.68`，
  `mb-seo-schema.php 1.1.1`。
- 新增页面模板 `page-film-packaging.html`、`assets/css/film-packaging.css`、
  `assets/images/film-packaging-hero.webp`，并在 `functions.php` 按模板
  条件加载 CSS、添加 `mtm-film-packaging-page` body class。
- 新增 Page 217 `Black Masterbatch for Film and Packaging`：`draft`，父级
  Page 31，模板 `page-film-packaging`，缩略图 Attachment 216，
  `_mb_robots=noindex,nofollow`，公开访问 `?page_id=217` 返回 404。
- 新增页面测试 `tests/film-packaging.spec.js`；`seo-audit.spec.js` 已加入
  页面路由，但 Page 217 尚未发布，线上检查尚未执行。
- 为防 404，以下入站链接仍只在本地、未部署：
  Black 分类页的 Film & Packaging 链接、吹膜文章的页面链接和 H2 调整。
- 验证：`film-packaging.spec.js` 静态 2 passed、线上 2 skipped；
  `articles.spec.js` 静态 2 passed；`npm run test:importer-syntax` 通过；
  `git diff --check` 通过。
- 回滚：主题切回 `/var/www/ashareai/releases/20261118-injection-1`；
  如撤销页面，删除 Page 217 和 Attachment 216；数据库备份
  `/var/www/ashareai/backups/ashareai-db-pre-film-page-20261118.sql.gz`。
- 未执行：页面正式发布、入站链接上线、Sitemap 重新生成、发布后的
  Canonical/Schema/OG/桌面/手机验证。


## 2026-11-18 Film & Packaging 页面发布

- 发布 Page 217 `Black Masterbatch for Film and Packaging`：
  `/products/black-masterbatch/film-packaging/`，父级 Page 31，模板
  `page-film-packaging`，Attachment 216，状态 `publish`，`index,follow`。
- 主题 release：`/var/www/ashareai/releases/20261118-film-publish-2`，子主题
  `mtm-b2b-masterbatch 0.9.70`；在 `film-publish-1` 基础上修正 Hero CTA
  对比度（青柠底、深绿字）。MU Plugin `mb-seo-schema.php 1.1.1`。
- 入站链接：Black 分类页 Applications 文案已链接到新页面；Post 122
  `masterbatch-for-blown-film` 的 H2 改为 `Select the grade by film criteria`
  并加入新页面链接。文章更新前已备份
  `/var/www/ashareai/backups/post-122-pre-film-page-20261118.html`。
- Sitemap：`page-sitemap.xml` 17 个 URL、30 个图片节点；新页面和
  `film-packaging-hero.webp` 已包含。`post-sitemap.xml` 仍为 6 个 URL。
- 验证：页面 200；Title、Description、Canonical、`index,follow` 正确；
  `FAQPage` + `WebPage` Schema；OG 图为 Attachment 216；Black 分类页和
  吹膜文章入站链接可用；桌面 1440 / 手机 390 无横向溢出。
- 测试：`film-packaging.spec.js` 4 passed；`articles.spec.js` 8 passed；
  `seo-audit` page basics 2 passed。测试期间服务器偶发
  `ERR_CONNECTION_CLOSED` 或冷缓存慢响应，重试后通过，未发现 5xx。
- 回滚：主题切回 `/var/www/ashareai/releases/20261118-film-publish-1`；
  Page 217 改回 draft 或删除；Post 122 用上述备份恢复；数据库备份
  `/var/www/ashareai/backups/ashareai-db-pre-film-publish-20261118.sql.gz`。
- 已知缺口：文章页仍未输出 `BreadcrumbList`；页面 FAQPage 已由模板输出。


### 2026-11-18 Film & Packaging Schema 补充

- Release `20261118-film-publish-3`，主题 `0.9.71`：页面模板补充
  `WebPage` 和 `BreadcrumbList` JSON-LD，保留已有的 `FAQPage`。
- 线上页面 Schema 类型：`WebPage`、`BreadcrumbList`、`FAQPage`；
  Canonical 和 `index,follow` 不变。
- 测试：`film-packaging.spec.js` 4 passed；`seo-audit` page basics
  2 passed；`articles.spec.js` 曾在更新后 8 passed，但后续全量复跑受服务器
  偶发 `ERR_CONNECTION_CLOSED` / 冷缓存慢响应影响，出现非内容断言的失败。
- 该问题不影响页面发布状态；发布前/后的页面级检查已通过，服务器稳定性
  仍需单独排查。


## 2026-11-20 Thank You + 自定义 404 发布

- 主题 release：`/var/www/ashareai/releases/20261120-thankyou-404-2`，基于
  `20261118-film-publish-3`；子主题 `mtm-b2b-masterbatch 0.9.74`，
  MU Plugin `mb-rfq-submissions.php 0.3.1`。
- 新增 Thank You Page 222：`/thank-you/`，模板 `page-thank-you`，
  `publish` + `noindex,nofollow`，不进入 Sitemap；公开页面 200。
- RFQ/Documents 成功提交现在跳转 `/thank-you/`，保留
  `rfq_status / rfq_context / rfq_product / rfq_source / mb_eid`；
  错误仍回原表单 `#request-form`。若 Thank You 页面未发布，handler
  回退旧行为，避免 404。
- 新增子主题 `templates/404.html` 和 `assets/css/404-page.css`，替换父主题
  中文 404。访问不存在的 URL 时 URL 不变、HTTP 状态保持 404，渲染英文
  自定义 404；没有做 301/302 跳转。
- 修复发布过程中发现的 `rank_math_robots` 双重序列化：Thank You 页面
  曾短暂输出 `index, follow`，已用 `update_post_meta(..., array(...))`
  修正为 `noindex,nofollow`，并复查通过。
- 修复 404 页面 skip link 可见的问题：`404-page.css` 增加 `.bm-skip`
  样式，skip link 默认在视口外，仅聚焦时出现。
- 验证：`tests/thank-you.spec.js` + `tests/404-page.spec.js`
  线上 **8 passed**；Thank You 200 + noindex；404 返回 404 + 自定义 H1；
  蜜罐 POST 返回 `/thank-you/?rfq_status=success`，不创建询盘、不发邮件；
  `page-sitemap.xml` 17 个 URL，不含 `/thank-you/`；桌面 1440 / 手机 390
  无横向溢出。
- 数据库备份：
  `/var/www/ashareai/backups/ashareai-db-pre-thankyou-404-20261120.sql.gz`。
- 回滚：主题切回 `/var/www/ashareai/releases/20261118-film-publish-3`；
  Page 222 改回 draft 或删除；handler 随旧 release 恢复 0.3.0；数据库用
  上述备份恢复。
- 已知：服务器仍有偶发慢响应/连接中断；线上测试重试后通过。


## 2026-11-20 Request a Quote 版面修复

- Release `20261120-quote-fix-1`，主题 `0.9.75`；只修改
  `contact-v1.css`，不改模板、表单字段或提交逻辑。
- 左侧 Hero 两栏比例从 `0.72 / 1.28` 改为 `0.9 / 1.1`，H1 改为
  `clamp(3.2rem, 5.1vw, 4.5rem)` 且 `max-width: 100%`，修复大标题
  侵入右侧表单栏。
- 必填星号：label 从继承的 `display:grid` 改为 `display:block`，
  `.mtm-rfq-form__req` 改为 `display:inline`，星号回到标题同一行右侧。
- 验证宽度：390 / 768 / 960 / 1100 / 1405 / 1440 / 1920；H1 无内部
  溢出，1405px 下 H1 右边缘约 615px、表单左边缘约 671px，保留间距。
- 测试：新增 `tests/quote-layout.spec.js`，线上 2 passed；
  `contact-page.spec.js` 静态 4 passed。
- 回滚：主题切回 `/var/www/ashareai/releases/20261120-thankyou-404-2`。


## 2026-11-20 旧 Contact / About 短链接修复

- Release `20261120-contact-redirect-1`，主题 `0.9.76`；修正 Thank You
  和 404 模板中指向 `/contact/` 的站内断链，改为 `/request-a-quote/`。
- 新增 301：`/contact`、`/contact/` → `/request-a-quote/`；
  `/about`、`/about/` → `/about-quality/`。
- 重定向只在 `is_404()` 时执行，未来若创建真实 Contact/About 页面不会被
  旧 map 覆盖。
- 验证：四个旧 URL 均 301 到正确目标且目标 200；Thank You/404 中
  `/contact/` 链接数为 0；`legacy-redirects`、`thank-you`、`404-page`
  线上测试 **12 passed**。
- 未处理：`/products/slip-masterbatch`、旧 shipping-terms FAQ、`/author/`
  和 `/&` 保持 404；它们没有当前对应内容，不做误导性跳转。
- 回滚：主题切回 `/var/www/ashareai/releases/20261120-quote-fix-1`。


## 2026-11-20 旧 /rfq 表单地址重定向

- Release `20261120-rfq-redirect-1`，主题 `0.9.77`；在旧 URL map 中加入
  `/rfq` 和 `/rfq/` → `/request-a-quote/`。
- 带 `preselect_product` / `preselect_need_documents` 的旧参数 URL 会
  301 到干净的表单 URL，不保留 white/color 等历史参数。
- 当前 robots.txt 只 Disallow `/wp-admin/`；GSC 的
  “Blocked by robots.txt” 是旧抓取时留下的历史状态，Google 重爬后会
  看到 301 并归并。
- 验证：`/rfq`、`/rfq/`、带参数 `/rfq?...` 均 301 到
  `/request-a-quote/`；`/contact`、`/about` 继续正常；目标页 200。
  `legacy-redirects` 测试 3 passed；一次 mobile 全量复跑受服务器慢响应
  影响失败，定向复跑通过，curl 结果稳定。
- 回滚：主题切回 `/var/www/ashareai/releases/20261120-contact-redirect-1`。


## 2026-11-21 Black Masterbatch Let-Down Ratio 文章发布

- 新增 Post 225：`/blog/black-masterbatch-let-down-ratio/`，标题
  `Black Masterbatch Let-Down Ratio: How to Calculate It`，分类
  Masterbatch Guides，Featured Image Attachment 224。
- 内容约 1,956 词，8 个 H2、5 个 H3；包含计算公式、20%/30%/40%
  示例、kg/h 喂料换算、试机检查、同炭黑目标成本比较和 RFQ 信息。
- SEO：Title `Black Masterbatch Let-Down Ratio: Calculation Guide`，
  Description 147 字符；Canonical、`index,follow`、BlogPosting Schema
  正常；文章已进入 `post-sitemap.xml`。
- 内链：carbon black content、blown film、injection molding、BK020、
  BK030、BK040、technical documents、RFQ 等 10 个链接均 200。
- 测试：`articles.spec.js` + `blog-archive.spec.js` 线上 12 passed；
  `seo-audit` schema 和 page basics 4 passed；桌面/手机无横向溢出。
- 发布前数据库备份：
  `/var/www/ashareai/backups/ashareai-db-pre-letdown-article-20261121.sql.gz`；
  文章原草稿备份
  `/var/www/ashareai/backups/post-225-pre-publish-20261121.html`。
- 回滚：Post 225 改回 draft 或删除；如需恢复草稿，用上述 225 备份；
  本次无需切换主题 release。


## 2026-11-23 Pipe & Profile 页面草稿预览

- 主题 release：`/var/www/ashareai/releases/20261123-pipe-profile-preview`，子主题
  `mtm-b2b-masterbatch 0.9.78`，`mb-seo-schema.php 1.1.2`。
- 新增 Page 228 `Black Masterbatch for Pipe and Profile Extrusion`：`draft`，
  父级 Page 31，模板 `page-pipe-profile`，缩略图 Attachment 227，
  `_mb_robots=noindex,nofollow`，公开访问 404。
- 新增 `templates/page-pipe-profile.html`、`assets/css/pipe-profile.css`、
  `assets/images/pipe-profile-hero.webp`；Hero 为自定义矢量图，无外部版权素材。
- `functions.php` 仅按模板条件加载页面 CSS 和 body class；未发布页面。
- Black 分类页的 Pipe 入站链接仍只在本地，尚未部署，避免草稿 404。
- 验证：`pipe-profile.spec.js` 静态 2 passed、线上 2 skipped；PHP 语法和
  `git diff --check` 通过。
- 回滚：主题切回 `/var/www/ashareai/releases/20261120-rfq-redirect-1`；
  Page 228 删除或保持 draft；Attachment 227 可保留。
- 未执行：页面正式发布、Black 分类页入站链接、Sitemap 页面/图片更新。


## 2026-11-23 Pipe & Profile 页面发布

- 发布 Page 228：`/products/black-masterbatch/pipe-profile/`，父级 Page 31，
  模板 `page-pipe-profile`，状态 publish，`index,follow`，缩略图 Attachment 227。
- 主题 release：`/var/www/ashareai/releases/20261123-pipe-profile-publish`，
  子主题 `0.9.79`；新增页面模板、CSS、Hero 图和 Black 分类页 Pipe 入站链接。
- Hero 图是自定义矢量插画（管端、型材、母粒），已转 1600×1200 WebP；
  未使用外部版权素材。
- 内容边界：引用当前 BK TDS 的 20% to 40%、载体、CaCO3 和 2% to 5%
  起始建议；不承诺 WRAS/NSF、压力管适用、户外寿命或“最佳 UV 保护”。
- 验证：`pipe-profile.spec.js` 4 passed；`seo-audit` schema + page basics
  4 passed；`sitemap-images` 7 passed（1 skipped mobile）；页面 200，
  Canonical、Title、Description、FAQPage/WebPage/BreadcrumbList Schema 正常；
  Black 分类页入站链接存在；`page-sitemap.xml` 18 个 URL、31 个图片节点，
  Pipe 页面和 Hero 图已包含；桌面/手机无横向溢出。
- 回滚：主题切回 `/var/www/ashareai/releases/20261123-pipe-profile-preview`；
  Page 228 改回 draft 或删除；数据库备份
  `/var/www/ashareai/backups/ashareai-db-pre-pipe-page-20261123.sql.gz`。
