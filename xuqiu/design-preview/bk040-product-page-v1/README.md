# BK040 Product Page Design Draft

状态：静态产品详情页草图，未修改 WordPress 或生产页面。

## 预览

```text
http://127.0.0.1:8766/xuqiu/design-preview/bk040-product-page-v1/
```

- 英文页：`index.html`
- 中文审阅页：`zh.html`
- 中英效果图：`visual-compare.html`
- 桌面并排 PNG：`output/en-zh-desktop-compare.png`
- 手机并排 PNG：`output/en-zh-mobile-compare.png`

建议正式 URL：

```text
/products/black-masterbatch/bk040/
```

面包屑保持 3 层，不再重复 Home：

```text
Products / Black masterbatch / BK040
```

当前生产站的黑母粒支柱页仍在
`/products/black-masterbatch/`。本设计按产品详情页语义采用未来的
`/products/black-masterbatch/` 结构；正式实施前需要先决定是否迁移产品
目录，并为旧地址设置 301。不能只修改面包屑而不调整 URL。

## 页面定位

- 页面角色：单一型号产品详情页。
- 主要搜索意图：商业调查和采购。
- 主关键词：`40% carbon black masterbatch`。
- 主要行动：请求 BK040 报价和免费样品。
- 与支柱页分工：本页只说明 BK040 的参数、差异、应用和试用流程；品类问题继续交给 Black Masterbatch 支柱页。

## 页面结构

1. Hero：BK040 定位、40% 炭黑、5.8% 填料和两个 CTA。
2. 产品梯度：BK020–BK040 五档位置，明确 BK040 是当前高黑度端点。
3. 核心差异：40% 炭黑、低填料、黑度、表面、添加量和加工表现。
4. 应用：吹膜、注塑和再生造粒。
5. TDS 参数表：13 项当前数据。
6. 质量与样品：批次检测、免费样品和树脂审核。
7. BK040 FAQ：8 条型号级问题。
8. 制造能力：12 条生产线、50,000+ 吨年产能和 30+ 出口市场。
9. 相邻型号：BK035、BK030 和 Black Masterbatch 支柱页。
10. 最终 CTA：报价与样品。

## SEO

- Title：`40% Carbon Black Masterbatch (BK040) | Film & Molding`，53 字符。
- Meta Description：141 字符。
- H1：`40% Carbon Black Masterbatch — BK040`。
- H1 → H2 → H3 层级连续。
- 页面草稿保持 `noindex`，避免与设计目录一起被索引。

## 证据范围

页面参数主要来自：

```text
Cmp_Info/TDS--BK040.doc
```

已使用：

- 40% virgin carbon black
- LLDPE + LDPE carrier 40%
- PE wax + stearic acid 14%
- CaCO₃ filler 5.8%
- moisture 0.2% max
- MFI 3–50 g/10min at 190°C, 21.6kg
- 2%–5% recommended addition ratio
- 25kg packaging
- film blowing、injection molding、re-granulating

未使用 TDS 中的个人电话和邮箱；TDS 标注的 `Food Grade` 也没有转成公开食品接触声明，因为当前证据范围仍需单独确认。

## 内链边界

BK020、BK025、BK030、BK035 的独立详情页尚未建立，因此当前只链接到：

- Black Masterbatch 支柱页的产品梯度；
- Technical Documents；
- Request a Quote。

建立相邻型号页后再替换为真实详情页 URL。

## 图片选择

本次不再复用主题首页的四张旧图片，改为从用户确认可用的 `img/` 素材库选择：

- Hero：`img/product/ge-chemical-masterbatch-product-01.jpg`
- 产品差异：`img/product/ge-chemical-masterbatch-product-03.jpg`
- TDS 与包装：`img/packaging/ge-chemical-packaged-masterbatch-bags.jpg`
- 质量与样品：`img/factory/ge-chemical-masterbatch-production-equipment-original.jpg`
- 制造能力：`img/factory/ge-chemical-masterbatch-factory-exterior-02.jpg`

当前草图直接引用原图，正式实现时应在复制到主题后生成适合页面显示尺寸的
WebP/AVIF 和小尺寸响应式版本，避免直接上线数 MB 的原图。

## 验证

- `1440 / 768 / 390 / 320px` 无横向溢出。
- 单一 H1，桌面 H2 均为单行。
- 13 项 TDS 参数、8 条 FAQ 和 5 张真实图片正常输出。
- 所有可见链接高度不少于 44px。
- 所有 margin、padding 和 gap 使用全局 `--ge-space-*`、`--ge-card-padding`
  或 `--ge-section-space*` tokens，不使用局部硬编码间距。
