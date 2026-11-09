# MTM B2B Masterbatch 子主题

- 状态：Technical Field Manual 首页、About、Buyer FAQ、三类指南、
  Documents、Resources 与私有 RFQ 提交
- 父主题：`mtm-b2b`
- 子主题 slug：`mtm-b2b-masterbatch`
- 主要内容：替换 Header/Footer，并新增首页、产品指南、About、FAQ、
  Guides、Request a Quote 和 Privacy Policy 模板
- 当前主题版本：`0.9.38`

## 首页结构

首页正文存放在
[`content/pages/home.md`](../../content/pages/home.md)，通过
`mb-content` 导入器写入 WordPress Page。`templates/page-home.html` 用于
草稿预览和绑定该模板的静态首页；`front-page.html` 作为未绑定页面模板时的
静态首页兜底。两个模板只负责 Header、Footer 和受控
`[mb_page_content]` 正文容器，不复制页面正文。

> 自定义区块页面模板在当前 WordPress 版本中未能向 `core/post-content`
> 提供 `postId` 上下文，导致正文为空。主题改用短代码调用当前 Page 的
> `do_blocks()` 输出正文；内容仍由 `home.md` 导入并保持可编辑。

导入后的首页正文按首版设计组织为 8 个区块：

1. 首屏定位与 RFQ 主入口；
2. Black、White、Color 三类产品入口；
3. 薄膜与包装、注塑、挤出、再生塑料应用背景；
4. 四步询盘审核流程；
5. 按具体牌号审核技术文件；
6. About：masterbatch supplier 定位与车间、包装、整托出货图片；
7. Buyer Resources 入口；
8. 页尾 RFQ 与技术文件 CTA。

首页不展示未确认的产能、生产线、市场数量、客户名称、固定参数或全系列合规声明。
`masterbatch supplier` 定位已获业务确认；`manufacturer` 和规模数据仍需证据。

当前首页视觉为 Technical Field Manual：

- 暖纸色编辑式 Hero，衬线大标题，工厂建筑主图和黑色母粒样本叠图；
- 黑、白、彩三块连续产品版面，使用颗粒大图和规格标签；
- Applications 为暖色工艺索引，Process 为深墨审核序列；
- Documents 为暖纸登记表，About 使用车间全幅背景；
- 最终 CTA 使用黏土色和 Resin、Process、Target、Documents 四项提示；
- 视觉样式隔离在 `assets/css/material-field-manual.css`，仅静态首页加载。

## About / Buyer FAQ

About / Quality 和 Buyer FAQ 使用各自的页面模板和样式文件，不再共享旧的
通用 About / FAQ 版式。

| 页面 | Page ID | 模板 | 专属样式 |
|---|---:|---|---|
| About / Quality | 66 | `templates/page-about-quality.html` | `assets/css/about-field-manual.css` |
| Masterbatch Buyer FAQ | 58 | `templates/page-faq.html` | `assets/css/faq-field-manual.css` |

`functions.php` 通过页面绑定的模板判断当前页面，而不是依赖 slug 或 Page ID：

- `mb_is_about_field_page()` 匹配 `page-about-quality`；
- `mb_is_faq_field_page()` 匹配 `page-faq`；
- 两个判断分别加载对应 CSS，并添加 `mtm-about-field` 或
  `mtm-faq-field` body class。

About 页面当前为 `0.9.23` 的 11 区块询盘审核版：

1. Hero 与审核依据；
2. Company Facts；
3. Material Context；
4. Product Routes；
5. Applications；
6. Inquiry Process；
7. Document review；
8. Claim limits；
9. Buyer checks；
10. Next step；
11. Final CTA。

页面链接 Black / White / Color 三条真实产品路线，不增加页内 FAQ；完整
Buyer FAQ 继续使用 `/faq/`。专属 CSS 只使用全局 `--ge-*` tokens，并沿用
共享 Header / Footer。FAQ 页面覆盖产品范围、彩色定制、RFQ、样品、
TDS/SDS/COA、RoHS/FDA 边界、数据表阅读、应用与树脂，以及提交后的审核流程。

Contact / Request a Quote 当前为 4 区块 RFQ 工作台：

1. Hero 与 9 项核心询盘字段；
2. `After you send it.` 审核流程；
3. `Review scope.` 文件与商业声明边界；
4. `Product routes.` 三条产品路线和辅助入口。

当前牌号、数量、目的港和颜色参照类型位于默认关闭的
`Add technical details`。技术文件字段不放在 Contact 表单，统一进入
`/technical-documents/`。专属样式为 `assets/css/contact-v1.css`，只在
`page-request-a-quote` 模板加载。

## Black Masterbatch LandFAQ

Black Masterbatch 页面使用独立模板：

- `templates/page-black-masterbatch.html`
- `assets/css/black-masterbatch-guide.css`
- `bin/build-black-masterbatch-page.js`（从设计预览生成模板和 CSS）

页面按 10 个内容角度组织：

1. Hero 与内容目录；
2. 产品组成和产品范围；
3. 20%–40% BK 牌号选择与参数表；
4. 载体树脂与兼容关系；
5. 分散、水分与熔体流动；
6. 薄膜、包装袋、注塑、再生料与 HDPE 管材；
7. 实验室、批次测试与样品；
8. 采购、TDS/SDS/COA 与合规；
9. 生产线、产能、客户和相关产品；
10. A–F 六组共 36 条 FAQ 与最终报价。

`functions.php` 通过 `mb_is_black_masterbatch_guide_page()` 检测
`page-black-masterbatch` 模板，加载专属 CSS，并添加
`mtm-black-guide-page` body class。

当前实现使用模板内受控 HTML，不依赖 Page 31 的旧 Markdown 正文。启用前需将
Page 31 的页面模板改为 `page-black-masterbatch`，并确认 SEO Title、
Description、canonical 和 robots 元数据。

`/products/black-masterbatch/bk040/` 使用 `page-bk040-product` 和
`assets/css/bk040-product.css`，模板由 `bin/build-bk040-product-page.js`
从已批准的 BK040 设计预览生成。`functions.php` 通过 `mb_is_bk040_page()`
只在该模板加载产品页样式并添加 `mtm-bk040-page` body class。

共享 Header 当前导航为
`Home / Products / Applications / Resources / About Us / Contact`。
Products 和 Resources 使用下拉菜单；Resources 包含 Buyer Guides、Blog、
Buyer FAQ 和 Technical Documents。Blog 指向 `/blog/`，该页通过
`page_for_posts` 使用 WordPress 文章归档和动态文章查询。文章固定链接为
`/blog/%postname%/`。

主题版本 `0.9.38` 已从线上服务器同步回仓库，并将 CRLF 统一为 LF。

## 0.9.38 技术文章手机布局

共享文章模板的手机端正文曾被表格的 `600px` 最小宽度撑开。修复包括：

- `.article-main` 使用 `min-width: 0`，避免正文网格被表格 min-content
  推到视口外。
- 面包屑在手机端保持 48px 单行，长文章标题省略。
- Hero 取消 430px 最小高度，H1、摘要和首段使用紧凑阅读字号。
- 表格单元格由 `build-article-posts.js` 输出 `data-label`，620px 以下
  转换为分组卡片，不再横向滚动。
- 正文字号在手机端不低于 16px。

生产 release 为 `/var/www/ashareai/releases/20261108-29`。

## 部署

先把目录上传到部署账号的临时目录，然后复制到 WordPress。以下路径以
项目当前部署账号的 `$HOME/wpdev/import/deploy/` 为例：

```bash
docker cp "$HOME/wpdev/import/deploy/" \
  wpdev-wp-1:/var/www/html/wp-content/themes/mtm-b2b-masterbatch

docker exec -u 0 wpdev-wp-1 chown -R 33:33 \
  /var/www/html/wp-content/themes/mtm-b2b-masterbatch

wpcli theme activate mtm-b2b-masterbatch
wpcli theme list --fields=name,status,version
```

## 验收

1. Header 不再显示 ISO、CE、RoHS、示例邮箱、电话或上海地址。
2. Footer 使用保守的色母粒询盘说明。
3. 只有主导航吸顶，不显示顶部说明条。
4. Footer 品牌名称不再产生额外 H3。
5. `/products/black-masterbatch/` 使用 `page-black-masterbatch`
   模板并加载 `black-masterbatch-guide.css`。
6. 页面只有一个 H1，Hero 摘要不重复正文。
7. 内容包重新导入时仍生成 Draft + noindex；正式发布时通过受控步骤将
   `_mb_robots` 改为 `index,follow`，避免把草稿策略和线上发布状态混为一谈。
8. Hero、正文、表格、CTA 和右侧询盘审核说明正常显示。
9. 移动端没有横向滚动或导航遮挡。
10. WordPress 已创建并指定静态首页，访问 `/` 时使用 `page-home`
    模板，缺失绑定时回退到 `front-page.html`。
11. 首页依次显示 8 个区块，且只有一个 H1。
12. 首页草稿使用 `page-home` 模板，Preview 中显示完整的 8 个区块。
13. `/privacy-policy/` 使用 `page-privacy` 模板，Footer 和 Quote 页面均可进入。
14. RFQ 与 Documents 表单通过 `admin-post.php` 提交到
    `mb-rfq-submissions` MU Plugin，
    包含 nonce、蜜罐、隐私同意、服务端验证和 `#request-form` 状态提示。
15. 提交成功后在后台 `Inquiries` 中生成私有 `mb_inquiry` 记录；邮件发送
    状态单独保存在 `_mb_rfq_email_sent`。
16. `/masterbatch-guides/`、三类指南、`/technical-documents/`、
    `/resources/`、`/resources/masterbatch-rfq-checklist/` 和 `/faq/`
    均已发布并返回 200。
17. Documents 表单要求 Document type 和 Document purpose，服务端重复校验。
18. Footer 的 Applications 指向首页 `/#applications`，不创建空页面。
19. `/about-quality/` 使用 `page-about-quality` 模板并加载
    `about-field-manual.css`。
20. `/faq/` 使用 `page-faq` 模板并加载 `faq-field-manual.css`。
21. About / FAQ 页面各自只有一个 H1，PC 和手机均无横向溢出。

## 尚未处理

- RFQ 私有存储已实现；生产邮件投递仍需配置 SMTP 或事务邮件服务。
- Rank Math SEO 已安装并接管 Open Graph、Organization/WebSite Schema、
  Title、Description、robots 和 Sitemap；Search Console OAuth 待业务方完成。
- Privacy Policy 需要业务和法务最终审核。
