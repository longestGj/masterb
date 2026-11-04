# MTM B2B Masterbatch 子主题

- 状态：首版首页与产品指南模板
- 父主题：`mtm-b2b`
- 子主题 slug：`mtm-b2b-masterbatch`
- 主要内容：替换 Header/Footer，并新增 `front-page`、`page-home` 和
  `page-product-guide` 模板

## 首页结构

首页正文存放在
[`content/pages/home.md`](../../content/pages/home.md)，通过
`mb-content` 导入器写入 WordPress Page。`templates/page-home.html` 用于
草稿预览，`templates/front-page.html` 用于静态首页。两个模板只负责
Header、Footer 和受控
`[mb_page_content]` 正文容器，不复制页面正文。

> 自定义区块页面模板在当前 WordPress 版本中未能向 `core/post-content`
> 提供 `postId` 上下文，导致正文为空。主题改用短代码调用当前 Page 的
> `do_blocks()` 输出正文；内容仍由 `home.md` 导入并保持可编辑。

首页 HTML 标题读取 Page 38 的 `_mb_seo_title`，输出
`Masterbatch Products for Plastic Processing | GE CHEMICAL`。没有 SEO
插件时，主题同时输出 Page 的 `_mb_seo_description`，并避免在安装
Yoast 或 Rank Math 后重复输出。该逻辑不修改站点名称或
Header/Footer 品牌文本。

首页使用的公开素材：

- `assets/images/home-masterbatch-product.jpg`：Hero 产品图；
- `assets/images/home-factory-building.jpg`：厂房；
- `assets/images/home-workshop-equipment.jpg`：车间设备；
- `assets/images/home-masterbatch-packaging.jpg`：包装。

图片只描述实际画面，不用于证明具体牌号、性能、产能或合规结论。

产品区包含 Black、White、Color 三类产品的采购信息对比表。应用区之后
提供 5 个可见 FAQ，用于覆盖 RFQ、产品选择和文件审核问题；FAQ 不使用
自动生成的价格、MOQ、交期或合规承诺。没有 SEO 插件时，主题输出与可见
FAQ 一致的 FAQPage 结构化数据。

首版主导航按内容结构第 7 节执行：

```text
Home
Products
Resources
Documents
About
Contact
```

当前 `Products` 指向 `/masterbatch-guides/`，`Contact` 指向
`/request-a-quote/`；这些目标页面全部可用后才视为导航验收完成。

导入后的首页正文按首版设计组织为 8 个区块：

1. 首屏定位与 RFQ 主入口；
2. Black、White、Color 三类指南入口；
3. 薄膜与包装、注塑、挤出、再生塑料应用背景；
4. 四步询盘审核流程；
5. 按具体牌号审核技术文件；
6. About / Quality 摘要；
7. Buyer Resources 入口；
8. 页尾 RFQ 与技术文件 CTA。

首页不展示未确认的产能、生产线、市场数量、客户名称、固定参数或全系列合规声明。

## 部署

先把目录上传到服务器的 `/root/wpdev/`，然后复制到 WordPress：

```bash
docker cp /root/wpdev/mtm-b2b-masterbatch \
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
7. 页面、正文预览和 Markdown Front Matter 状态一致。
8. Hero、正文、表格、CTA 和右侧询盘审核说明正常显示。
9. 移动端没有横向滚动或导航遮挡。
10. WordPress 已创建并指定静态首页，访问 `/` 时使用
    `templates/front-page.html`。
11. 首页依次显示 8 个区块，且只有一个 H1。
12. 首页草稿使用 `page-home` 模板，Preview 中显示完整的 8 个区块。

## 尚未处理

- 导航目标页面尚未创建。
- RFQ 和文档申请表单尚未实现。
- SEO 插件尚未安装。
- 黑色母粒和首页页面内容需要在 staging 重新导入。
- 首页公司事实、品牌素材和最终英文文案仍需业务审核。
