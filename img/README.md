# 图片与视频分类副本

- 状态：待审核素材
- 日期：2026-11-01
- 原始目录：`../Cmp_Info/PIC&Vedio/`
- 说明：本目录是拷贝，原始图片和视频未移动、未修改、未删除。

## 目录结构

```text
img/
├── factory/
│   └── 工厂、车间和设备图片
├── product/
│   └── 母粒产品展示图片
├── packaging/
│   └── 产品包装图片
├── export-loading/
│   └── 托盘、装柜和出口运输图片
├── customer-visit/
│   └── 客户到厂参观图片
├── exhibition/
│   └── 展会现场和参展图片
├── videos/
│   └── 已按网站用途命名的视频副本
└── uncertain/
    ├── photos/
    │   └── 从文件名无法确认具体用途的微信图片
    ├── screenshots/
    │   └── 手机截图类 PNG
    └── originals-before-watermark/
        └── 加水印前的原始照片版本
```

## 分类数量

| 目录 | 数量 | 计划用途 |
|---|---:|---|
| `factory/` | 5 | 首页、About / Quality |
| `product/` | 6 | 产品页、资源中心和产品展示 |
| `packaging/` | 1 | 产品页、包装说明 |
| `export-loading/` | 13 | About、包装和出口流程 |
| `customer-visit/` | 1 | 客户参观和合作信任内容 |
| `exhibition/` | 9 | 展会、行业活动和品牌展示 |
| `videos/` | 5 | 首页或 About 的工厂展示 |
| `uncertain/photos/` | 0 | 已全部完成用途确认 |
| `uncertain/screenshots/` | 0 | 已全部完成用途确认 |
| `uncertain/originals-before-watermark/` | 0 | 已全部完成用途确认 |
| 合计 | 40 | 所有非完全重复的媒体内容 |

原始目录共有 54 个媒体文件。分类时跳过 14 个完全重复文件：

- 5 个原版视频与 `ge-chemical-masterbatch-site-video-*.mp4` 完全一致；
- 9 张 `PIC2` JPG 与根目录微信图片完全一致。

这些重复文件仍保留在原始目录中，不在 `img/` 中重复复制。

## 当前可用方向

### 工厂与质量控制

`factory/ge-chemical-masterbatch-workshop-equipment.jpg`

`factory/ge-chemical-masterbatch-factory-building.jpg` 已确认是厂房图。

`factory/ge-chemical-masterbatch-factory-exterior-01.jpg` 和
`factory/ge-chemical-masterbatch-factory-exterior-02.jpg` 已确认是厂房外景。

`factory/ge-chemical-masterbatch-production-equipment-original.jpg` 已确认是色母粒生产设备原图。

可用于：

- 首页生产能力模块；
- About / Quality；
- 制造流程文章。

使用前需要确认拍摄地点、时间、素材归属和设备信息的公开范围。

### 包装

`packaging/ge-chemical-packaged-masterbatch-bags.jpg`

可用于：

- 产品页包装说明；
- RFQ 中的包装信息提示；
- 出口流程内容。

不能根据单张包装照片推断所有产品的包装规格。

### 产品展示

`product/` 中的 6 张图片已经确认是母粒产品图，文件名为：

- `ge-chemical-masterbatch-product-01.jpg`
- `ge-chemical-masterbatch-product-02.jpg`
- `ge-chemical-masterbatch-product-03.jpg`
- `ge-chemical-masterbatch-product-04.jpg`
- `ge-chemical-masterbatch-product-05.jpg`
- `ge-chemical-masterbatch-product-06.jpg`

可用于产品页、资源中心或产品展示模块。当前只能确认它们是产品图，不能仅根据图片推断具体牌号、颜色、颗粒参数或产品性能。上线前仍需补充图片标题、Alt 文本、对应产品范围和授权信息。

### 出口与装柜

`export-loading/` 中的 6 张图片可用于：

- 包装和装柜流程；
- About / Quality；
- 联系与询盘页面。

使用前需要检查：

- 集装箱号、车牌、地址和第三方标识；
- 客户名称或托盘标签；
- 图片是否包含人物；
- 图片是否反映当前实际出口流程。

另外 7 张已确认的装柜原始照片也已移入 `export-loading/`：

- `ge-chemical-masterbatch-container-loading-original-01.jpg`
- `ge-chemical-masterbatch-container-loading-original-02.jpg`
- `ge-chemical-masterbatch-container-loading-original-03.jpg`
- `ge-chemical-masterbatch-container-loading-original-04.jpg`
- `ge-chemical-masterbatch-container-loading-original-05.jpg`
- `ge-chemical-masterbatch-container-loading-original-06.jpg`
- `ge-chemical-masterbatch-container-loading-original-07.jpg`

这些文件是水印前版本，可用于后续重新裁剪和压缩。使用前仍需检查集装箱号、车牌、地址、客户标签和第三方标识。

### 视频

`videos/` 中的 5 个 MP4 是现有网站命名版本的副本，尚未进行网页压缩。

上线前需要：

- 逐段确认画面内容；
- 检查人物、声音、水印和第三方标识；
- 删除敏感信息；
- 生成网页视频和封面图；
- 控制首屏加载体积。

### 客户参观

`customer-visit/ge-chemical-masterbatch-customer-visit.jpg` 已确认是客户到厂参观图片。

在公开使用前必须确认：

- 图片中人物是否同意用于网站和营销；
- 是否带有客户名称、公司标识或可识别信息；
- 是否允许展示参观流程和现场环境；
- 图片说明是否会暗示未经授权的客户合作或背书。

### 展会

`exhibition/` 中的 9 张图片已确认是参加展会的照片，文件名为 `ge-chemical-masterbatch-exhibition-01.png` 至 `ge-chemical-masterbatch-exhibition-09.png`。

在公开使用前必须确认：

- 图片中人物是否同意用于网站和营销；
- 是否包含其他参展公司的名称、Logo 或展位信息；
- 展会时间、地点和活动名称是否可以公开；
- 拍摄图片是否已获得版权和发布授权；
- 图片说明是否会让读者误认为当前仍有相同的客户、产品合作或展会安排。

## 不确定素材

`uncertain/photos/` 当前为空，此前无法确认用途的图片已经全部完成人工确认和移动。

`uncertain/screenshots/` 当前为空。此前待确认的手机截图尺寸 PNG 已经确认是展会照片并移动到 `exhibition/`。如果后续新增截图，仍需检查其中是否包含：

- 产品资料；
- 聊天记录；
- 客户信息；
- 网站或平台页面；
- 内部文件。

在逐张人工审核前，不得用于公开网站。

`uncertain/originals-before-watermark/` 当前为空，其中原有照片已经全部确认用途并移动到对应分类。

## 使用边界

- 本目录只完成用途和来源分类，不代表已经取得公开授权。
- 素材不得用于证明具体产品参数、性能或合规性。
- 图片 Alt 文本必须描述实际画面，不能堆叠产品关键词。
- 上线版本应生成 WebP、AVIF 或压缩视频，不直接使用当前原图。
- 无法确认内容的素材继续保持 `uncertain` 状态，不根据猜测移动到其他目录。
| 分类 | 数量 |
|---|---:|
| factory | 5 |
| product | 6 |
| packaging | 1 |
| export-loading | 13 |
| customer-visit | 1 |
| exhibition | 9 |
| videos | 5 |
| uncertain/photos | 0 |
| uncertain/screenshots | 0 |
| uncertain/originals-before-watermark | 0 |
| 合计 | 40 |
