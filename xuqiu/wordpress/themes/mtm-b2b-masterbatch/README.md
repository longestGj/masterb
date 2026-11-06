# MTM B2B Masterbatch 子主题

- 状态：Technical Field Manual 首页、三类指南、Documents、Resources
  与私有 RFQ 提交
- 父主题：`mtm-b2b`
- 子主题 slug：`mtm-b2b-masterbatch`
- 主要内容：替换 Header/Footer，并新增首页、产品指南、About、FAQ、
  Guides、Request a Quote 和 Privacy Policy 模板

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
5. `/masterbatch-guides/black-masterbatch/` 使用 `page-product-guide` 模板。
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

## 尚未处理

- RFQ 私有存储已实现；生产邮件投递仍需配置 SMTP 或事务邮件服务。
- Rank Math SEO 已安装并接管 Open Graph、Organization/WebSite Schema、
  Title、Description、robots 和 Sitemap；Search Console OAuth 待业务方完成。
- Privacy Policy 需要业务和法务最终审核。
