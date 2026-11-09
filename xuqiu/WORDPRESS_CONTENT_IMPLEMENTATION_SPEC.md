# 色母粒独立站 WordPress 内容实施规格

- 状态：WordPress 内容实施规格草案
- 日期：2026-11-02
- 公开主体：GE CHEMICAL & POLYMER GROUP CO., LTD
- 适用范围：WordPress 内容建模、Markdown 导入、页面模板、表单、SEO 和发布审核
- 上游文档：[网站内容结构草案](MASTERBATCH_WEBSITE_CONTENT_STRUCTURE.md)
- 产品与证据限制：[Limited PRD](../Cmp_Info/LIMITED_PRD_BLACK_WHITE_COLOR_RFQ_CONTENT_GE_ONLY_DOCUMENT_REQUEST.md)
- SEO 参考：本地笔记 `/Users/ssl/soft/note/ssl/SEO知识库`，重点采用搜索意图、页面关键词、标题层级、URL、内链、Canonical、Sitemap、图片和 B2B 博客规划规则

## 1. 文档结论

现有 Markdown 内容适合继续作为独立站内容的编辑主源，但不应由 WordPress 前台直接读取和即时解析 Markdown。推荐采用以下链路：

```text
Markdown 主源
→ 格式与证据校验
→ 标准化为内容对象
→ WordPress 导入器
→ WordPress 草稿或指定状态
→ 页面/SEO/表单检查
→ 人工批准后发布
```

核心分工：

| 层级 | 负责内容 |
| --- | --- |
| Markdown | 页面正文、结构化章节、SEO 文案、CTA、关联页面、证据引用和审核状态 |
| 页面注册表 | 稳定内容 ID、页面类型、路由键、唯一主关键词、搜索意图和发布状态 |
| WordPress | 发布镜像、页面渲染、表单收集、媒体管理、插件 SEO 和运行日志 |
| 主题模板 | 版式、共享组件、响应式布局、可访问性和 Schema 输出 |
| 导入器 | 字段映射、幂等更新、Markdown 到区块转换、校验和失败回滚 |

这一设计让内容团队继续维护可审阅的文本，同时让 WordPress 获得稳定的结构化字段，不依赖标题中的随机文字识别页面内容。

本文可以用于确定 WordPress 内容模型和导入器契约，但不会把现状自动升级为“完整 PRD”“最终路由”或“可以公开上线”。首页已有可导入草稿包和页面模板，但公司事实、FAQ、隐私政策和部分技术内容仍未完成正式审核。

## 2. 采用的 SEO 原则

根据 `/Users/ssl/soft/note/ssl/SEO知识库`，实施时需要固定以下规则：

1. 先确定搜索意图和页面类型，再确定标题、关键词和 CTA。
2. 一个页面只有一个主要搜索意图和一个主关键词。
3. 主关键词在页面注册表中只能分配给一个主要承接页面。
4. Title Tag 与 H1 围绕同一主题，但不必逐字相同；页面只保留一个主 H1。
5. H2/H3 按用户问题组织，层级连续，不把每个标题都塞入主关键词。
6. 首段尽快说明页面主题、适用对象、核心价值和下文内容。
7. 不设置固定关键词密度目标，不生成关键词清单式正文。
8. URL 使用小写英文、连字符和稳定目录结构，已发布 URL 变更使用 301。
9. 正文内链从 2～5 个真正相关的链接开始，锚文本说明目标页面，不使用统一的“click here”。
10. 文章应与产品指南、RFQ 或文档审核入口形成主题集群，避免孤岛页面。
11. Title 可参考 50～60 个英文字符，Meta Description 可参考 120～155 个英文字符，最终以搜索结果预览为准。
12. 内容图片使用描述性文件名、准确 Alt、明确的宽高；照片优先 WebP/AVIF，首屏主图不使用懒加载。
13. Canonical 使用完整、可访问、自引用的规范 URL；Canonical、内链和 Sitemap 应指向同一版本。
14. Sitemap 只列出允许索引、返回正常状态且有实质内容的重要页面。
15. 发布不等于完成；上线后通过 Search Console 检查索引、展示、点击和询盘路径。

## 3. 当前内容与目标 WordPress 实体

| 当前文件 | 目标内容对象 | WordPress 类型 | 建议模板 | 当前状态 |
| --- | --- | --- | --- | --- |
| [内容结构草案](MASTERBATCH_WEBSITE_CONTENT_STRUCTURE.md) | 站点规划 | 不导入正文 | 无 | 内容结构草案 |
| [公司公开信息整理草案](COMPANY_PUBLIC_INFORMATION_DRAFT.md) | 首页、About / Quality、Footer | Page | `page-about-quality` / `front-page` | 内部审核稿，不得直接发布 |
| [黑色母粒页面文案](../Cmp_Info/PAGE_COPY_BLACK_MASTERBATCH_RFQ.md) | `guide.black` | Page | `page-product-guide` | Page Copy Draft |
| [白色母粒页面文案](../Cmp_Info/PAGE_COPY_WHITE_MASTERBATCH_RFQ.md) | `guide.white` | Page | `page-product-guide` | Page Copy Draft |
| [彩色母粒页面文案](../Cmp_Info/PAGE_COPY_COLOR_MASTERBATCH_RFQ_GUIDE.md) | `guide.color` | Page | `page-product-guide` | Page Copy Draft |
| [文档申请页面文案](../Cmp_Info/PAGE_COPY_DOCUMENT_REQUEST.md) | `documents.request` | Page | `page-document-request` | Page Copy Draft |
| [表单文案](../Cmp_Info/FORM_COPY_RFQ_DOCUMENT_REQUEST.md) | 共享表单字段与提示 | 表单配置 | `form-rfq-document` | Form Copy Draft |
| [表单说明](../Cmp_Info/DOCUMENT_REQUEST_FORM_BRIEF.md) | 表单业务逻辑 | 表单配置 | 无 | Form Brief Draft |
| 色母粒知识库课程 | 英文资源文章 | Post | `single` | 需要重新改写，不能逐字导入 |
| 首页 | `home` | Page | `page-home` / `front-page` | 可导入草稿，待业务审核 |
| FAQ | `faq` | Page 或资源文章 | `page-faq` | 待整理 |
| 隐私政策 | `privacy` | Page | `page-privacy` | 待编写 |

## 4. 建议的 Markdown 内容目录

建议在进入 WordPress 实施时建立以下内容包，而不是把规划文档、表单说明、研究记录和正文全部导入 WordPress：

```text
xuqiu/
├── wordpress/
│   ├── site.yml
│   ├── routes.yml
│   ├── taxonomies.yml
│   ├── cta.yml
│   ├── redirects.csv
│   ├── schemas/
│   │   └── content.schema.json
│   ├── forms/
│   │   └── rfq-document-request.yml
│   └── content/
│       ├── pages/
│       │   ├── home.md
│       │   ├── about-quality.md
│       │   ├── resources.md
│       │   ├── document-request.md
│       │   ├── request-a-quote.md
│       │   └── privacy-policy.md
│       ├── guides/
│       │   ├── black-masterbatch.md
│       │   ├── white-masterbatch.md
│       │   └── color-masterbatch.md
│       └── resources/
│           ├── what-is-masterbatch.md
│           ├── how-to-choose-masterbatch.md
│           └── masterbatch-rfq-checklist.md
```

目录建议：

- `site.yml`：全站公开主体、默认语言、默认 CTA、默认关联组件和全局限制。
- `routes.yml`：路由键到 URL 路径的映射，避免在正文中写死最终 URL。
- `taxonomies.yml`：资源主题、产品线、应用场景等受控词表。
- `cta.yml`：CTA 的名称、目标路由键、表单上下文和允许的页面来源。
- `forms/`：字段名、选项、条件逻辑和通知信息，不存放收件邮箱或其他密钥。
- `content/pages/home.md`：首页正文包，使用受控 Gutenberg 区块保存 8 个首版区块。
- `content/guides/`：三个 RFQ 指南，不把研究决策文件混入正文。
- `content/resources/`：面向搜索的英文文章，每篇对应一个主要搜索意图。
- `redirects.csv`：已发布 URL 的迁移记录，导入 WordPress 前完成冲突校验。

## 5. 内容身份与页面注册表

### 5.1 稳定内容 ID

每个页面必须有一个稳定的 `content_id`，导入、更新和关联都使用该 ID：

```text
home
about.quality
guide.black
guide.white
guide.color
documents.request
quote.request
resources.index
resource.what-is-masterbatch
resource.rfq-checklist
privacy.policy
```

禁止使用以下内容作为更新依据：

- WordPress 自动生成的 post ID；
- 页面标题；
- 当前 H1；
- 可变 slug；
- 中文文件名；
- 表单插件内部编号。

### 5.2 页面注册表最低字段

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `content_id` | 稳定 ID | `guide.black` |
| `content_type` | 内容类型 | `product_guide` |
| `route_key` | 路由键 | `guides.black` |
| `locale` | 页面语言 | `en-US` |
| `status` | 编辑和发布状态 | `review` |
| `search_intent` | 主要搜索意图 | `commercial_investigation` |
| `primary_keyword` | 唯一主关键词 | `black masterbatch` |
| `page_job` | 一句话说明页面为谁解决什么问题 | `Help B2B buyers prepare a complete black masterbatch RFQ` |
| `primary_conversion` | 主要转化 | `quote.request` |
| `secondary_conversion` | 次要转化 | `documents.request` |
| `evidence_ids` | 使用的证据范围 | `EV-BLACK-OVERVIEW` |
| `review_owner` | 内容审核人 | `待指定` |
| `evidence_owner` | 证据审核人 | `待指定` |

### 5.3 关键词唯一性

`primary_keyword` 在已批准页面中必须唯一。若出现以下情况，先重新判断页面意图，不直接创建第二篇近似页面：

- 两个页面的主关键词相同；
- 两个页面的 `page_job` 可以用同一句话描述；
- 两个页面只有标题差异，正文和答案范围高度重复；
- 一个页面同时承担“基础知识”“产品选型”和“文件合规”三个差异很大的意图。

相关词和长尾问题可以用于 H2/H3，但不应被同时登记为多个页面的主关键词。

## 6. Markdown 文件格式

### 6.1 Front Matter

每个可导入页面使用 YAML Front Matter。正文本身不写 WordPress post ID、插件短代码或最终域名。

黑色母粒指南示例：

```yaml
---
content_id: guide.black
content_type: product_guide
schema_version: 1
locale: en-US
route_key: guides.black
status: review
title: Black Masterbatch RFQ Guide
primary_keyword: black masterbatch
search_intent: commercial_investigation
page_job: Help B2B plastic buyers prepare a complete black masterbatch RFQ.
product_family: black

seo:
  title: Black Masterbatch RFQ Guide | GE CHEMICAL
  description: Prepare a black masterbatch RFQ with resin, application, blackness target, dispersion needs, quantity and document request details for manual review.
  robots: noindex,nofollow
  canonical_route_key: guides.black

hero:
  eyebrow: Black Masterbatch
  title: Black Masterbatch RFQ Guide for B2B Plastic Buyers
  summary: Prepare a clearer black masterbatch inquiry by sharing your resin, application, processing method, blackness target, dispersion requirement, current issue and document needs.
  image_id: null

conversion:
  primary_cta_id: cta.black.rfq
  secondary_cta_id: cta.black.documents
  form_key: rfq_document_request

relations:
  parent_id: null
  related_content_ids:
    - resource.rfq-checklist
    - guide.white
    - guide.color
    - documents.request

evidence:
  ids:
    - EV-BLACK-OVERVIEW
    - EV-BLACK-COMPLIANCE-SCOPE
  public_entity: ge-chemical

review:
  content_owner: unassigned
  seo_owner: unassigned
  evidence_owner: unassigned
  approved_at: null
  reviewed_at: 2026-11-02
  next_review_at: null
---
```

说明：

- `status: review` 导入 WordPress 后只能进入草稿、待审或私有状态。
- `robots` 在正式发布前保持 `noindex,nofollow`，即使页面在 staging 可访问。
- `reviewed_at` 是最新人工查看日期，不等同于 `approved_at`。
- `related_content_ids` 使用内容 ID，导入器再解析为当前规范 URL。
- `image_id` 引用媒体注册表，不在正文中写死媒体 URL。
- Front Matter 不允许包含收件邮箱、API Key、表单 Token 或客户个人信息。

### 6.2 正文区块

正文只允许一组可校验的区块类型，导入器不解析任意 HTML：

```text
:::section{id="buyer-problems"}
## What black masterbatch buyers usually need to clarify

正文、列表和受控表格。
:::

:::rfq-checklist
items:
  - Base resin
  - Processing method
:::

:::evidence-notice
notice_id: black-scope
:::

:::faq
faq_id: black.faq
:::

:::cta-group
primary_cta_id: cta.black.rfq
secondary_cta_id: cta.black.documents
:::
```

允许的正文区块：

| 区块 | 用途 |
| --- | --- |
| `section` | 普通正文、H2/H3、段落、列表和受控表格 |
| `rfq-checklist` | 结构化询盘准备项 |
| `comparison-table` | 具有明确列和字段定义的对比或核对表 |
| `evidence-notice` | 可复用证据边界说明 |
| `document-review-notice` | 可复用文件人工审核说明 |
| `faq` | 结构化可见 FAQ |
| `cta-group` | 主次 CTA |
| `related-content` | 按内容 ID 生成相关链接 |
| `image` | 图片、Alt、Caption 和版位 |

正文约束：

- 普通指南的 H1 只来自 `hero.title`，Markdown 正文从 H2 开始。
- 首页是唯一例外：使用 `body_format: gutenberg-blocks-v1`，正文包含且只包含一个 H1，并由 `page-home` 模板渲染 `post-content`。
- Gutenberg 首页正文只允许 `group`、`columns`、`column`、`paragraph`、`heading`、`buttons`、`button`、`list`、`list-item` 和 `table` 区块；禁止脚本、iframe、表单标签和事件处理属性。
- H2/H3 层级连续，不使用 H4～H6 代替版式。
- 表格不用于堆关键词，列名必须回答真实比较问题。
- `faq` 内容必须在页面上实际可见，不能只输出 Schema。
- CTA 不写在普通段落中，使用结构化 CTA ID。
- 文件下载词、固定 MOQ、固定交期和全系列合规用语由校验器拦截。
- 不把“Primary CTA:”这类编辑提示直接发布成正文。

## 7. WordPress 内容模型

### 7.1 页面类型

首版建议使用原生 WordPress 页面承载营销和产品指南，使用文章承载资源内容：

| 内容类型 | WordPress 实体 | 原因 |
| --- | --- | --- |
| `home` | Page，设为首页 | 固定单页 |
| `product_guide` | Page，父页面可为 Products | 产品询盘页不是博客，也不是电商商品 |
| `document_request` | Page | 固定转化页 |
| `quote_page` | Page | 固定表单页 |
| `about_quality` | Page | 固定信任页 |
| `privacy_policy` | Page | 固定法律页 |
| `resource_article` | Post | 便于按主题、日期和作者组织 |
| `resource_index` | Page | 首版不创建空分类归档 |
| `product_grade` | 第二阶段再决定 Page 或 `mb_product` CPT | 当前牌号证据和公开授权不足 |

首版不需要为三个指南创建公开的 `mb_guide` 自定义文章类型。使用同名页面模板和受控字段即可完成内容结构化。

### 7.2 分类法

| 分类法 | 公开 | 用途 |
| --- | --- | --- |
| `resource_topic` | 是 | 基础知识、选型、技术文件、加工应用、质量问题、询盘流程 |
| `product_family` | 是 | Black、White、Color，仅供卡片和关联筛选 |
| `application_context` | 首版暂不公开归档 | Film、Injection、Packaging、Recycled Plastic 等 |
| `evidence_type` | 否 | TDS、SDS、COA、RoHS、FDA、公司事实等内部分类 |

不要在只有一个页面时建立公开空分类。需要筛选或已有多篇内容时再开放归档。

### 7.3 字段存储原则

- 标量字段通过 WordPress 注册 post meta 或字段插件存储。
- FAQ、可重复 CTA、媒体和证据关联使用结构化字段，不用逗号分隔字符串。
- 页面正文存储为 WordPress 区块内容，但 H1、SEO、CTA、FAQ 和证据说明以独立字段为主。
- 同一事实只存一份。页面显示和结构化数据应从同一字段生成，避免正文与 Schema 不一致。
- 不创建可填写公开文件 URL 的 `document_file` 字段。文档申请只收集审核请求。

建议使用自定义区块主题配合字段插件。推荐字段方案：

| 需求 | 建议 |
| --- | --- |
| 普通文本、URL、选择项 | WordPress 原生注册 Meta |
| FAQ、证据关联、重复 CTA | ACF Pro 或 Meta Box 等字段插件 |
| 页面版式 | Block Theme templates、template parts 和 patterns |
| SEO 字段 | Rank Math 或 Yoast SEO，二选一 |
| 表单 | Gravity Forms、Fluent Forms Pro 或 WS Form，三选一 |
| SMTP | 独立 SMTP 插件，密钥和密码从环境变量或安全配置读取 |

最终插件组合应在 staging 验证，不把某个插件的内部 post meta key 写进 Markdown。

## 8. 主题模板与页面组成

### 8.1 模板映射

| 模板 | 主要内容 | 必备 CTA |
| --- | --- | --- |
| `front-page` | 定位、三类母粒、询盘流程、信任内容 | Request a Quote |
| `page-product-guide` | Hero、买方问题、准备信息、应用背景、RFQ 清单、文件审核、FAQ、相关资源 | 产品 RFQ + 技术文件 |
| `page-document-request` | 申请范围、准备信息、审核流程、边界、FAQ、表单 | Submit Document Request |
| `page-request-a-quote` | 简短说明、共享表单、成功和错误状态 | 提交 RFQ |
| `page-about-quality` | 已批准公司信息、询盘流程、质量说明 | Contact / RFQ |
| `page-resources` | 首批文章和主题入口 | 相关产品指南 |
| `single` | 文章 H1、摘要、正文、来源/日期、作者或审核人、相关内容、上下文 CTA | 相关产品 RFQ |
| `archive-resource_topic` | 有至少 2 篇内容后再启用 | 产品指南 |
| `search` | 搜索结果 | 继续筛选 |
| `404` | 搜索、热门资源和产品入口 | 返回首页或资源中心 |

### 8.2 产品指南页面组成

1. Breadcrumb。
2. Hero：H1、简短摘要、主次 CTA。
3. 买方常见问题和需要澄清的变量。
4. 提交 RFQ 前需要准备的资料。
5. 树脂、加工方式和最终应用的背景说明。
6. 结构化 RFQ 清单。
7. 产品参数说明；只有具体牌号和批准证据存在时启用。
8. 技术文件人工审核说明。
9. 证据边界和合规限制。
10. 可见 FAQ。
11. 相关文章、另外两个产品指南和 RFQ 入口。
12. 页尾 CTA。

### 8.3 资源文章页面组成

1. Breadcrumb 和主题分类。
2. 一个 H1，直接回答主要搜索问题。
3. 首段答案摘要，说明适用对象。
4. H2/H3 正文。
5. 可复用证据说明和来源边界。
6. 与上下文相关的 2～5 个内链。
7. 一个明确的下一步 CTA。
8. 更新日期、审核状态和关联产品指南。

资源文章不强制加入询盘表单。认知阶段文章优先引导阅读，比较或采购阶段再引导产品页或 RFQ。

## 9. 路由与 URL

### 9.1 路由键

正文和 CTA 只引用 `route_key`，不写最终 URL：

```yaml
home: /
guides.black: /products/black-masterbatch/
guides.white: /products/white-masterbatch/
guides.color: /products/color-masterbatch/
documents.request: /technical-documents/
quote.request: /request-a-quote/
resources.index: /resources/
about.quality: /about-quality/
privacy.policy: /privacy-policy/
```

以上路径是实施建议，不是最终业务审批结果。最终域名和路径一旦确认，再写入 `routes.yml`。

### 9.2 URL 规则

- 英文小写，使用连字符。
- 最多保持约三层可理解目录。
- 不把每篇内容平铺到根目录，也不制造只有单页的空目录。
- 已发布 URL 保持稳定；必须改变时在 `redirects.csv` 记录 301。
- 查询参数只用于表单预填、来源或 UTM，不产生独立可索引页面。
- 表单来源参数不得包含姓名、邮箱、公司名或其他个人信息。

### 9.3 Canonical

- 每个正式页面使用自引用 Canonical。
- 带 UTM、表单 `intent` 或 `source` 的 URL，规范到干净页面 URL。
- Canonical 使用完整绝对 URL，指向返回 200、允许索引且没有重定向链的最终地址。
- 内部链接和 Sitemap 与 Canonical 指向同一路径。
- 旧页面永久迁移优先使用 301，不只依赖 Canonical。

## 10. 共享 CTA 契约

| CTA ID | Label | 目标 | 用途 |
| --- | --- | --- | --- |
| `cta.black.rfq` | Submit Black Masterbatch RFQ | `quote.request` + `intent=black-masterbatch` | 黑色指南主 CTA |
| `cta.white.rfq` | Submit White Masterbatch RFQ | `quote.request` + `intent=white-masterbatch` | 白色指南主 CTA |
| `cta.color.rfq` | Submit Color Masterbatch RFQ | `quote.request` + `intent=color-masterbatch` | 彩色指南主 CTA |
| `cta.black.documents` | Request Technical Documents | `documents.request` + `intent=black-masterbatch#request-form` | 黑色指南次 CTA |
| `cta.white.documents` | Request Technical Documents | `documents.request` + `intent=white-masterbatch#request-form` | 白色指南次 CTA |
| `cta.color.documents` | Request Technical Documents | `documents.request` + `intent=color-masterbatch#request-form` | 彩色指南次 CTA |
| `cta.general.rfq` | Request a Quote | `quote.request` | 首页和 About |
| `cta.general.contact` | Contact Our Team | `quote.request` | About 和资源页 |

CTA 规则：

- 每个页面定义一个主要 CTA。
- 主 CTA 在首屏和页尾出现，正文关键决策点可再出现，但不遮挡移动端正文。
- 次 CTA 必须与当前内容上下文一致。
- 生产页面不出现空链接、`#` 占位或尚未创建的表单目标。
- CTA 预填参数只包含受控枚举值和页面标识。
- CTA 点击后必须到达可用表单或明确的服务邮箱回退说明。

## 11. 表单实施契约

### 11.1 表单页面

建议使用一个共享表单组件：

```text
form_key: rfq_document_request
form_context: rfq | document_request
```

放置位置：

- `quote.request`：默认 `rfq` 上下文。
- `documents.request`：默认 `document_request` 上下文。
- 产品指南通过 CTA 进入上述页面并预填 `product_interest`。

### 11.2 字段注册表

| 字段名 | 类型 | 必填条件 | 选项或校验 |
| --- | --- | --- | --- |
| `contact_name` | text | 总是 | 1～100 字符 |
| `company` | text | 总是 | 1～150 字符 |
| `email` | email | 总是 | 有效邮箱；用于回复 |
| `whatsapp` | tel | 否 | 最大 40 字符 |
| `country_region` | select | 总是 | 受控国家列表 + Other |
| `product_interest` | select | 总是 | Black / White / Color / Not sure |
| `application` | select | 总是 | Film / Bag / Injection / Recycled Plastic / Extrusion / Distributor / Other |
| `base_resin` | select | RFQ 推荐 | PE / PP / LDPE / LLDPE / HDPE / ABS / PET / PVC / Other / Not sure |
| `processing_method` | select | RFQ 推荐 | Film Blowing / Injection Molding / Extrusion / Re-granulating / Other / Not sure |
| `target_color_function` | textarea | 彩色询盘必填 | 黑度、遮盖、颜色目标或功能要求 |
| `color_reference_type` | select | 彩色询盘推荐 | Physical Sample / Pantone / RAL / Photo / Existing Product / Previous Supplier Grade / Customer Standard / Not sure |
| `product_grade_model` | text | 否 | 当前牌号、替换目标或已知 GE 牌号 |
| `current_problem` | select | 否 | Dispersion / Blackness / Opacity / Color Matching / Document Request / Processing Issue / Other |
| `current_grade_supplier` | text | 否 | 帮助替换评估 |
| `addition_ratio` | text | 否 | 客户现有使用信息，不作为 GE 推荐 |
| `trial_quantity` | text | 否 | 不自动产生 MOQ 或交期承诺 |
| `monthly_quantity` | text | 否 | 不自动产生价格承诺 |
| `destination_port` | text | 否 | 最大 100 字符 |
| `documents_requested` | multi-select | 文档意图时必填 | TDS / SDS/MSDS / COA / RoHS-related / FDA-related / Food-contact-related / Other |
| `document_purpose` | select | 选择文件后必填 | Internal Evaluation / Customer Approval / Import Clearance / Compliance Review / Sample Testing / Other |
| `message` | textarea | 否 | 最大 3000 字符 |
| `privacy_consent` | checkbox | 总是 | 指向有效隐私政策 |
| `source_page` | hidden | 自动 | 只保存内容 ID 或路由键 |
| `form_context` | hidden | 自动 | `rfq` 或 `document_request` |
| `landing_page` | hidden | 自动 | 白名单页面路径，不含个人信息 |
| `utm_source` | hidden | 自动 | 仅保存必要营销归因 |
| `utm_medium` | hidden | 自动 | 仅保存必要营销归因 |
| `utm_campaign` | hidden | 自动 | 仅保存必要营销归因 |

### 11.3 条件逻辑

- 从 `documents.request` 进入时显示文件类型、用途和产品上下文。
- 选择任一 `documents_requested` 后，`document_purpose` 变为必填。
- 选择 Color 后，`target_color_function` 和 `color_reference_type` 显示并变为推荐或必填。
- 选择 Other 时显示补充文本框。
- 未选择颜色或资料意图时，不显示无关的深度字段，减少表单负担。
- 表单不得上传 TDS、SDS、COA 或其他公共文件作为交付物。

### 11.4 提交行为

- 通知发送给业务确认的 RFQ/文件审核邮箱。
- 收件邮箱、SMTP 密码、验证码 Secret 和 API Token 从安全配置或环境变量读取。
- 通知包含 `source_page`、`form_context`、提交时间和所有有效字段。
- 使用 nonce、速率限制、蜜罐或验证码控制垃圾提交。
- 如果启用了提交保存，隐私政策必须说明保存目的、保存位置、访问权限和保留期限。
- 默认不自动附带任何技术或合规文件。
- 成功消息使用已批准文案：

```text
Your request has been received. Our team will review the product grade, application and document scope, then reply by email.
```

- 错误消息只提示重试或邮件联系，不暗示文件已经存在。
- 表单不可用时，显示真实企业邮箱回退；正式邮箱确认前保留发布门禁。

## 12. SEO 元数据和结构化数据

### 12.1 每页必须输出

| 项目 | 规则 |
| --- | --- |
| Title Tag | 唯一，主关键词靠前，与 H1 和正文主题一致 |
| Meta Description | 唯一，包含页面主题、用户收益和自然下一步 |
| H1 | 每页一个，来自 `hero.title` 或文章标题 |
| Canonical | 完整、可访问、自引用或指向批准的规范目标 |
| Robots | 正式可索引页面允许索引；草稿和 staging 禁止索引 |
| Open Graph | 页面标题、描述和批准的主图 |
| Breadcrumb | 反映真实页面层级 |
| Sitemap | 只包含批准发布的规范 URL |

### 12.2 Schema

建议输出：

- 全站：`Organization`、`WebSite`。
- 页面层级：`BreadcrumbList`。
- 资源文章：`Article` 或 `BlogPosting`，包含发布日期和更新日期。
- 有真实可见 FAQ 的页面：从同一 FAQ 字段生成 `FAQPage`。
- 文件的申请页：使用普通 `WebPage`，没有公开文件时不要伪装成 `Dataset` 或下载页。
- 三个 RFQ 指南：在具体产品事实、价格和 Offer 未确认前，不为了 Schema 强行添加 `Product`、Offer 或评论。

Schema 只能描述页面真实存在的可见内容。不得输出：

- 页面未展示的 FAQ；
- 未授权客户评价；
- 虚假价格、库存、评分或交期；
- 未确认的认证和合规范围；
- 非 GE 主体或未公开牌号。

## 13. 内链与主题集群

建议首批主题集群：

```text
Black / White / Color Masterbatch Guides（转化页）
├── What Is Masterbatch?（基础认知）
├── How to Choose the Right Masterbatch（选型）
├── Masterbatch RFQ Checklist（采购准备）
├── How to Read a Masterbatch TDS（技术文件）
├── TDS vs. SDS vs. COA（文件理解）
├── Why Technical Documents Need Grade Review（文件边界）
├── Common Masterbatch Quality Problems（问题排查）
└── Sample Types and Trial Confirmation（样品流程）
```

每个资源文章：

- 至少链接到一个直接相关产品指南。
- 从至少一个相关产品或支柱页获得反向链接。
- 正文内链从 2～5 个相关链接开始。
- 使用描述性锚文本，例如 `prepare a black masterbatch RFQ`。
- 不使用 `click here`、`learn more` 或全站统一锚文本。
- 不为凑数量链接无关产品、国家和文件页面。

内链由内容 ID 生成，发布前校验：

- 目标内容已发布；
- 目标 URL 返回 200；
- 锚文本与目标主题一致；
- 没有循环指向同一段落的重复链接；
- 重要页面不是只能从 Sitemap 被发现。

## 14. 图片与媒体

### 14.1 媒体注册表

每张内容图片至少记录：

```yaml
image_id: black-masterbatch-pellets
source_path: /approved-media/black-masterbatch-pellets.jpg
output_file: black-masterbatch-pellets.webp
alt: Black masterbatch pellets prepared for plastic processing
caption: null
width: 1600
height: 900
usage: guide-hero
rights_status: approved
person_release: not-applicable
credit: null
```

字段说明：

- `image_id`：Markdown 和 WordPress 之间稳定引用。
- `output_file`：描述性小写文件名。
- `alt`：描述图片在当前页面中的信息或功能，不堆关键词。
- 纯装饰图片使用空 Alt。
- 首屏主图不懒加载；首屏以下图片可懒加载。
- 写入宽度和高度，减少布局偏移。
- 照片和产品图优先 WebP/AVIF；Logo 和简单图标可使用 SVG。
- 200 KB 只作为内容图片的经验参考，最终以清晰度和实际性能为准。

### 14.2 公开素材门禁

以下任一条件不满足时，媒体不能进入公开页面：

- 素材归属已确认；
- 公开使用授权已确认；
- 人物肖像授权已确认；
- 水印和第三方品牌已检查；
- 图片内容没有超出产品证据范围；
- 文件进入 WordPress 后没有被设置为公开技术文件。

TDS、SDS、COA、RoHS 和 FDA 文件不进入公开媒体库，也不放在可被直接猜测或遍历的 `/wp-content/uploads/` 路径。

## 15. Markdown 到 WordPress 的导入器

### 15.1 导入原则

- 按 `content_id` 幂等 upsert，重复运行不生成重复页面。
- 先校验全部内容，再写入；任何 P0 错误阻止整批发布。
- staging 默认导入为草稿或待审。
- Front Matter 字段映射到明确的 post fields、post meta、taxonomy 和 SEO 插件字段。
- 正文只转换成白名单区块，不将任意 HTML、脚本或 iframe 直接写入数据库。
- 首页 Gutenberg 正文执行区块名称、嵌套配对、H1、危险标签和链接协议校验。
- 媒体先从注册表匹配，缺失时保留占位并报告，不自动从外部抓取。
- 导入日志记录内容 ID、旧状态、新状态、内容哈希、操作者和时间。
- 不把 WordPress 自动生成的 ID 回写为内容主键。

### 15.2 状态映射

| Markdown `status` | WordPress 状态 | 是否可索引 |
| --- | --- | --- |
| `draft` | Draft / Private | 否 |
| `review` | Pending / Draft | 否 |
| `approved` | Draft 或 Publish，需人工确认 | 仅批准发布后 |
| `published` | Publish | 是 |
| `retired` | Draft / Private / 410 或重定向 | 否 |

`approved` 不等于可以直接公开。发布仍需满足：

- 路由已确认；
- 公开主体和公司事实已确认；
- 产品证据范围已确认；
- CTA 目标表单可用；
- 隐私政策有效；
- 图片授权完成；
- SEO、内链和移动端检查通过。

### 15.3 内容哈希与冲突

每个可导入对象计算规范化内容哈希：

```text
hash = SHA256(normalized_front_matter + normalized_body + media_ids + taxonomy_ids)
```

导入器行为：

- 哈希未变：跳过写入。
- 哈希变化且 WordPress 未编辑受管字段：更新。
- 哈希变化且 WordPress 已编辑受管字段：停止并报告冲突。
- 只有 `form_submissions`、浏览量等运行时数据不受内容哈希管理。

建议锁定以下字段为 Markdown 管理：

- 正文；
- H1；
- SEO Title 和 Description；
- 结构化 FAQ；
- CTA；
- 证据关联；
- 审核状态。

WordPress 管理员可管理：

- 菜单；
- 表单提交数据；
- 媒体裁切和替代尺寸；
- 插件运行配置；
- 分析工具；
- 邮件发送日志；
- 不进入正文的全局公告。

如果业务团队希望上线后在 WordPress 中直接修改文案，应增加“导出回 Markdown”或明确把 WordPress 设为该页面的新主源，不能让两个来源同时维护同一字段。

### 15.4 WordPress 接入方式

可选接入方式：

| 方式 | 适用场景 | 要求 | 建议 |
| --- | --- | --- | --- |
| WP-CLI 自定义导入命令 | Markdown 与 WordPress 在同一部署或运维流程中 | 服务器命令权限、staging、dry-run、日志 | 首选，适合首批内容和持续批量导入 |
| 受控 REST 接口 | 内容包在另一个系统，需要远程触发导入 | HTTPS、服务账号、最小权限、请求签名或应用密码、幂等键 | 需要跨系统自动化时使用 |
| WordPress 管理后台手动导入 | 首次迁移或一次性少量页面 | 人工核对字段和区块结构 | 只用于初次或例外，不作为长期同步机制 |

如果使用 REST 接入：

- 为内容导入建立单独的自定义 endpoint，不直接开放任意 post meta 写入。
- 鉴权凭据从环境变量或服务器 Secret 读取，不写入仓库、Markdown、日志或前端 JavaScript。
- 请求至少包含 `content_id`、`content_hash`、`schema_version` 和目标状态。
- 服务端重复执行同一请求时返回相同内容对象，不生成重复页面。
- 导入接口只允许白名单字段和区块，不接收任意 PHP、脚本、iframe 或短代码。
- staging 默认禁止发布；正式发布需要单独的权限和明确状态。
- API 返回结构化错误，区分字段错误、证据门禁、路由冲突和权限失败。
- 记录操作者或服务账号、内容 ID、旧状态、新状态、时间和错误摘要。

无论使用哪种接入方式，前台 WordPress 页面只读取 WordPress 中已经保存和验证过的内容对象。WordPress 请求期间不实时解析远程 Markdown。

## 16. 发布门禁

### 16.1 P0：任一失败不得发布

- 内容 ID、页面类型和路由键有效且唯一。
- 页面只有一个 H1。
- Title 和 Meta Description 唯一、与正文一致。
- 页面有明确的主要搜索意图和主关键词。
- 没有把规划稿、Market Research Only 或 Not for Dev 内容直接导入。
- 公开页面没有非 GE 主体名称。
- 没有公共文件下载、即时文件和自动文件交付。
- 没有未确认的产能、客户名称、认证、全系列适用或法规承诺。
- 文档申请所需的表单字段、收件流程和成功消息完整。
- 隐私政策有效，表单说明与实际数据保存一致。
- 图片和视频获得公开授权。
- Canonical 指向 200、可索引、无重定向链的规范 URL。
- staging 和草稿有正确的 `noindex`。

### 16.2 P1：发布前完成

- H2/H3 层级连续，只读标题即可理解页面结构。
- 首段说明主题、目标用户、核心价值和下文。
- 正文不存在关键词堆砌。
- 正文有 2～5 个相关且锚文本准确的内链。
- 每个资源文章至少有一个相关产品页入口和一个反向内链。
- 主 CTA 在首屏和页尾可见，移动端不遮挡正文。
- 图片文件名、Alt、Caption、宽高和格式合规。
- Open Graph、Breadcrumb 和允许的 Schema 输出正确。
- Sitemap 只包含可索引的规范页面。
- 旧 URL 的 301 已配置并验证。
- 表单条件逻辑、成功状态、错误状态和邮件通知已验证。
- 页面在真实手机尺寸下没有横向滚动、文字溢出或按钮遮挡。

### 16.3 P2：上线后验证

- Search Console 验证站点并提交 Sitemap。
- 使用 URL Inspection 检查首批重要页面。
- 检查 canonical、robots 和被索引状态。
- 观察真实查询、展现、点击和询盘来源。
- 有展示低点击时检查 Title 和 Meta Description。
- 有点击低转化时检查首段、CTA、表单摩擦和内链。
- 规则、产品证据、公司信息或 CTA 变化时触发复审。

## 17. 检查脚本和自动化边界

进入实际开发后，建议提供以下本地检查：

| 检查 | 目的 |
| --- | --- |
| Front Matter Schema 校验 | 必填字段、类型、枚举和内容 ID |
| 关键词唯一性检查 | 同一主关键词不能绑定多个页面 |
| 路由唯一性检查 | 两个页面不能生成相同 URL |
| 内链目标检查 | 仅引用已登记内容 ID |
| 禁用词检查 | 文件下载、全系列合规、固定 MOQ/交期等 |
| 主体名称检查 | 阻止非 GE 主体进入公开内容 |
| 图片注册表检查 | Alt、文件名、宽高、授权状态 |
| Canonical/路由检查 | 路由与重定向无冲突 |
| WordPress dry run | 输出将创建、更新、跳过和失败的页面 |
| 导入后验收 | 内容哈希、状态、模板、SEO 和表单目标 |

自动化不能替代业务审核。SEO 工具、语法工具、查重工具和 AI 只能提供提示，产品证据、公司事实和合规边界仍需人工确认。

## 18. 建议实施顺序

### 阶段 A：建立内容契约

1. 确定 WordPress、主机、域名和技术负责人。
2. 确认采用 Block Theme + 字段插件 + 表单插件 + SEO 插件组合。
3. 创建 `site.yml`、`routes.yml`、`taxonomies.yml`、`cta.yml` 和表单字段注册表。
4. 将三个产品指南转成带 Front Matter 的 Markdown。
5. 为内容字段和禁用词编写校验规则。

### 阶段 B：完成缺失页面

1. 起草首页。
2. 审核 About / Quality 的可公开事实。
3. 起草隐私政策并确认表单数据保存方式。
4. 起草 RFQ 页面、资源中心和 FAQ。
5. 将首批 4～6 篇资源文章按搜索意图重新编写。
6. 确认正式企业邮箱和表单收件人。

### 阶段 C：搭建 staging

1. 安装并配置 WordPress。
2. 建立主题模板、全局样式和共享组件。
3. 注册字段、分类、页面模板和表单。
4. 开发 Markdown 导入器和 dry-run 工具。
5. 导入三个产品指南和文档申请页。
6. 完成桌面、平板和移动端检查。

### 阶段 D：发布准备

1. 审核所有内容和证据。
2. 确认正式路由和 301 映射。
3. 验证表单、邮件、隐私政策、图片授权和成功状态。
4. 检查 Canonical、robots、Sitemap、Schema 和内链。
5. 完成 Search Console、分析工具和备份配置。
6. 按页面逐批发布，不做一次性全站切换。

## 19. 仍需业务确认的阻塞项

以下未解决前，只能做内容模型和 staging 实施，不能把相关页面标记为正式发布：

1. 法定英文公司名称和 GE 公开主体授权。
2. 公司地址、定位、生产主体和生产场所可否公开。
3. 生产线、产能、市场覆盖、实验室和客户品牌的证据与措辞。
4. 正式企业邮箱、电话、WhatsApp 和公开联系人。
5. RFQ 与文件申请的实际收件人、审核人和回复流程。
6. 表单是否保存提交记录、保存时限和访问权限。
7. 隐私政策、Cookie 和分析工具组合。
8. 每个牌号可公开的参数、文件和证据范围。
9. Logo、字体、品牌色和图片视频的公开授权。
10. 最终域名、路由、托管环境和部署方式。
11. 内容审核人、SEO 审核人和证据审核人。
12. 首批资源文章的优先级和真实信息增量来源。

## 20. 实施验收定义

WordPress 内容实施第一阶段完成时，应满足：

- 每个可导入页面都有唯一 `content_id`、页面类型、主关键词、搜索意图和路由键。
- Markdown 能通过结构校验并 dry-run 到 WordPress staging。
- 重复运行导入器不会生成重复页面。
- 三个产品指南使用同一模板，但各自保留产品差异和证据边界。
- 文档申请页和 RFQ 页使用共享表单字段，并能正确预填产品兴趣。
- 所有草稿和 staging 页面默认不可索引。
- 每个页面只有一个 H1，Title、Description、首段和 H2 结构一致。
- 每个页面有相关内链、明确 CTA 和可验证的下一步。
- 图片有描述性文件名、Alt、宽高和授权状态。
- 页面没有非 GE 主体、公开文件下载或未批准的产品承诺。
- 正式发布前可以逐项追溯到内容、证据和人工审核记录。

## 21. 相关文件

- [WordPress 内容导入器与测试说明](wordpress/README.md)
- [首个可导入首页：8 区块内容包](wordpress/content/pages/home.md)
- [首个可导入内容包：黑色母粒指南](wordpress/content/guides/black-masterbatch.md)
- [网站内容结构草案](MASTERBATCH_WEBSITE_CONTENT_STRUCTURE.md)
- [公司公开信息整理草案](COMPANY_PUBLIC_INFORMATION_DRAFT.md)
- [黑色母粒 RFQ 页面文案](../Cmp_Info/PAGE_COPY_BLACK_MASTERBATCH_RFQ.md)
- [白色母粒 RFQ 页面文案](../Cmp_Info/PAGE_COPY_WHITE_MASTERBATCH_RFQ.md)
- [彩色母粒 RFQ 页面文案](../Cmp_Info/PAGE_COPY_COLOR_MASTERBATCH_RFQ_GUIDE.md)
- [文档申请页面文案](../Cmp_Info/PAGE_COPY_DOCUMENT_REQUEST.md)
- [表单文案](../Cmp_Info/FORM_COPY_RFQ_DOCUMENT_REQUEST.md)
- [表单说明](../Cmp_Info/DOCUMENT_REQUEST_FORM_BRIEF.md)
- [Limited PRD](../Cmp_Info/LIMITED_PRD_BLACK_WHITE_COLOR_RFQ_CONTENT_GE_ONLY_DOCUMENT_REQUEST.md)
- [产品证据确认表](../Cmp_Info/MASTERBATCH_SUPPLIER_EVIDENCE_CONFIRMATION.md)
- [色母粒知识库](../色母粒知识库/README.md)
