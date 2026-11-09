# Carbon Black Content Selection Guide Sketch

状态：静态信息型文章草图。正式文章已使用共享技术文章模板发布。

## 预览

```text
http://127.0.0.1:8766/xuqiu/design-preview/carbon-black-content-selection-v1/
```

正式 URL：

```text
https://www.ashareai.com/blog/how-to-choose-carbon-black-content/
```

## 页面定位

- 页面角色：信息型选型文章。
- 主要搜索意图：了解 20%、30%、35%–40% 炭黑含量的区别并做初步选型。
- 主关键词：`carbon black content in black masterbatch`。
- 下一步：查看 Black Masterbatch 支柱页、申请技术文件或提交选型询盘。

## 内容结构

1. Hero：直接回答“含量不是最终结果”，给出三类判断依据。
2. Carbon black content is not the final result：炭黑类型、载体和分散。
3. 20%–40% loading bands：成本型、均衡型和高品质路线。
4. Higher loading is not always cheaper：每吨成品成本公式。
5. Filler trade-off：BK020–BK040 的 CaCO₃ 梯度表。
6. Application selection：垃圾袋、吹膜、注塑和再生 PE。
7. Buyer checklist：下单前应确认的四类输入。
8. Next step：支柱页、技术文件和报价入口。

## SEO

- Title：`Carbon Black Content in Black Masterbatch: 20% vs 40%`，53 字符。
- Description：147 字符。
- H1：`How to Choose Carbon Black Content in Black Masterbatch`。
- 使用信息型文章的 H1 → H2 → H3 层级。
- 正文 HTML 可抓取，不使用 Canvas 或图片承载关键答案。
- 页面草稿保持 `noindex`。

## 内链边界

MD 中预留了 BK020、BK025、BK030、BK035、BK040 五个型号详情页链接，但这些页面当前尚未建立。因此草图只链接：

- 已上线的 Black Masterbatch 支柱页；
- Technical Documents；
- Request a Quote。

正式发布前应先创建型号页，或保持当前的真实链接，避免占位 URL 和死链接。

## 设计与验证

- 沿用 `DESIGN.md`、全站 Header/Footer 和 `--ge-*` tokens。
- 桌面采用文章目录与正文双栏，手机改为单列。
- 使用一张真实黑色母粒图片和 CSS 含量刻度，不添加装饰性配图。
- 已检查 `1440 / 768 / 390 / 320px`：单一 H1、5 个牌号、无横向溢出、无坏图。

## 正式发布

- 正文主源为 `wenzhang/How_to_Choose_Carbon_Black_Content.md`。
- WordPress Post 147 使用 `[mb_article_page]` 共享模板，封面附件为 146。
- BK020、BK025、BK030、BK035 的预留 URL 当前精确 301 到黑母粒分类页，
  BK040 返回 200。

- MD 中的添加比例、填料、牌号定位与应用判断仍需按当前 TDS 和实际产品范围复核。
- 生产首页仍处于 noindex 预发布策略。
