# Black Masterbatch LandFAQ 设计稿

状态：静态设计审阅，未修改生产模板，未部署。

## 预览

- `index.html`：当前设计稿。
- `zh.html`：与英文稿同结构的中文完整审阅稿。
- `compare.html`：当前生产页面与设计稿的桌面、手机整页对照。
- `visual-compare.html`：英文与中文桌面、手机效果图对照。
- `output/en-zh-desktop-compare.png`：桌面中英并排 PNG。
- `output/en-zh-mobile-compare.png`：手机中英并排 PNG。
- `generate-landfaq.js`：从 MD 直接解析八段内容、牌号表和 36 条 FAQ。

本地地址：

```text
http://127.0.0.1:8766/xuqiu/design-preview/black-masterbatch-refresh-v1/
```

## 三层依据

### 1. MD 提供内容

内容来源：

```text
product/black-masterbatch-支柱页.md
```

使用的信息包括：

- 五个 BK 牌号与 20%–40% 炭黑含量；
- 载体、填料、分散、水分、MFI 和添加比例；
- 吹膜、注塑、再生 PE/PP 和 HDPE 管材相关问答；
- 12 条生产线、50,000 吨以上年产能、30 多个出口国家；
- Total、Tosaf、内部实验室和免费样品；
- A–F 六组共 36 条 FAQ；
- TDS、SDS、COA、RoHS、REACH 和食品接触相关表述。

### 2. SEO 知识库提供规则

重点应用：

- `02搜索意图.md`：商业调查与交易意图。
- `07-如何布局关键词.md`：主关键词进入 Title、H1、首段和少量标题。
- `08-如何优化网页元元素和H元素.md`：Title、Description 和连续 H 层级。
- `09-page SEO 优化.md`：搜索意图、CTA、图片、内链和页面体验。
- `14-如何整理文章大纲.md`：先回答用户问题，再映射 H1/H2/H3。
- `22-网页内容的类型.md`：产品分类与教育内容组合成 LandFAQ。

当前 SEO 决策：

- 页面角色：Black Masterbatch LandFAQ。
- 主要意图：商业调查，下一步为报价和免费样品。
- 主关键词：`black masterbatch`。
- H1：`Black Masterbatch & Carbon Black Masterbatch`。
- Title：`Black Masterbatch Manufacturer: 20%–40% BK Grades`，49 字符。
- Description：138 字符。
- 页面结构：10 个内容区块，H1 + 9 个 H2；36 条 FAQ 集中在最后一章。
- URL 保持：

```text
/masterbatch-guides/black-masterbatch/
```

面包屑使用真实的上级路径：

```text
Home / Masterbatch guides / Black masterbatch
```

### 3. Skills 提供方式

- `frontend-design`：以产品实物、参数表和选型路径作为页面视觉主体。
- `design-taste-frontend`：使用真实图片、非卡片瀑布结构、克制的 hover 和清晰的响应式断点。
- `humanizer`：用于审阅新增的结构标题和 CTA；MD 原文内容保持不变。

## 页面顺序

1. Hero：产品定位和内容目录。
2. 产品基础：MD ② 原文与五个牌号范围。
3. 牌号选择：完整参数表。
4. 载体与树脂：PE、PP、LDPE、LLDPE 与兼容关系。
5. 性能与质量：MD ③ 原文。
6. 应用：MD ④ 原文。
7. 质量与验证：MD ⑤ 原文。
8. 采购：报价、TDS、SDS、COA 和合规文件。
9. 公司与供应：MD ⑥、⑦ 原文。
10. FAQ 与询价：A–F 六组 36 条 FAQ 和 MD ⑧ 原文。

## 验证

- `1440 / 768 / 390 / 320px` 均无横向溢出。
- 英文与中文共 8 个 viewport 检查全部通过。
- 单一 H1，标题层级连续。
- 5 个牌号与 36 条 FAQ 全部进入可抓取 HTML。
- 八段 MD 营销内容全部进入页面。
- 图片全部加载，Alt 存在。
- FAQ、手机菜单和 Products 下拉可操作。
- Title 49 字符，Description 138 字符。

`design-taste-frontend` 的本机安装缺少它引用的 `references/` 和 `scripts/`，因此视觉原则按其主说明执行，页面门禁使用项目内 Playwright 审计脚本完成。

## 发布前

本次按用户要求使用 MD 内容，因此保留了产能、客户名称、完整参数、免费样品及合规相关声明。生产发布前仍需业务方确认这些内容的公开授权、文件版本和证据范围。
