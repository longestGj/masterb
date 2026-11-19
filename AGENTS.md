# AGENTS.md

本文件只保留跨任务稳定规则和任务路由。日期化的实施记录、WordPress 开发细节
和发布检查分别放在对应文件中。

## Task Routing

按任务类型读取规则：

| 任务 | 必读规则 |
|---|---|
| 页面、文章、SEO、CMS、模板、WordPress、Nginx 或发布 | 本文件 + `SITE_RELEASE.md` |
| 主题 CSS、PHP、JavaScript、模板、测试或 wp-cli | 本文件 + `SITE_RELEASE.md` + `xuqiu/wordpress/AGENTS.md` |
| 视觉或 UI 设计与验收 | 上述规则 + `DESIGN.md` |
| 色母粒知识库、市场研究、资料整理 | 本文件 + 对应来源文件 |
| 查看历史发布、版本或回滚点 | `xuqiu/DEPLOYMENT_LOG.md` |

`xuqiu/DEPLOYMENT_LOG.md` 是历史记录，不是稳定开发规则，也不能替代当前
线上验证。

### Site Task Gate

凡是页面、文章、SEO、CMS、模板、WordPress、Nginx 或发布任务：

1. 开始前读取 `SITE_RELEASE.md`。
2. 先判断 A–E 变更级别。
3. 执行当前任务适用的检查。
4. 正式发布前执行全部适用级别和 E 级检查。

纯知识库研究、市场调研、资料整理，且不修改公开页面时，不触发本门禁。

因此：

- 文章修改进入 A/B 检查。
- 博客文章写作或发布：另读 `xuqiu/wordpress/AGENTS.md` 的
  Article Publishing、`xuqiu/wordpress/ARTICLE_RELEASE_CHECKLIST.md` 和
  `xuqiu/wordpress/ARTICLE_PLAYBOOK.md`。
- 普通知识库整理不进入站点发布流程。
- 正式部署同时执行根规则、`SITE_RELEASE.md` 和 WordPress 开发规则。

## 项目定位

本仓库是色母粒（masterbatch）B2B 外贸项目的资料、内容与 WordPress
实施工作区。

项目包括：

- 色母粒知识库与技术资料；
- 公司、产品、市场、关键词和竞争对手研究；
- 英文独立站页面、文章、表单和内容包；
- WordPress 子主题、MU Plugin、测试和部署脚本；
- SEO、Sitemap、统计和线上发布维护。

当前公开产品线只有：

- Black Masterbatch
- Desiccant Masterbatch

White Masterbatch 和 Color Masterbatch 已从公开产品线移除。除非用户重新
明确授权，不得重新增加公开入口、表单选项、Schema 或产品页。历史资料中
出现 White/Color 不改变当前公开产品范围。

## Start a Task

按以下顺序开始：

1. 本文件；
2. 与任务类型对应的路由规则；
3. [色母粒知识库入口](色母粒知识库/README.md)；
4. [市场研究决策摘要](Cmp_Info/MASTERBATCH_RESEARCH_DECISION_SUMMARY.md)；
5. 与任务直接相关的页面文案、产品资料、PRD、表单或来源文件；
6. [待确认事项](色母粒知识库/待确认事项/待确认事项清单.md)和
   [来源索引](色母粒知识库/参考来源/来源索引.md)。

不要仅根据文件名、旧草稿或历史日志判断项目当前状态。

## Directory Map

```text
masterb/
├── AGENTS.md
├── SITE_RELEASE.md
├── DESIGN.md
├── 色母粒知识库/
├── Cmp_Info/
│   └── PIC&Vedio/
├── img/
├── product/
├── keywords/
├── wenzhang/
└── xuqiu/
    ├── DEPLOYMENT_LOG.md
    ├── design-preview/
    └── wordpress/
        ├── AGENTS.md
        ├── content/
        │   ├── pages/
        │   ├── products/
        │   ├── posts/
        │   ├── guides/
        │   └── server-sync-20261117/
        ├── mu-plugins/
        ├── themes/mtm-b2b-masterbatch/
        ├── tests/
        └── bin/
```

### `色母粒知识库/`

面向零基础读者的色母粒知识库，包含基础知识、生产与指标、应用与选型、
质量问题、询盘与外贸、术语表、来源索引和待确认事项。

知识库用于建立选型、核查和沟通框架，不是具体产品的性能、配方、价格、
交期或合规承诺。

### `Cmp_Info/`

公司业务资料，包括 TDS、SDS/MSDS、检测报告、公司简介、产品地图、市场、
关键词、竞争对手、页面机会和询盘研究。

White/Color 相关文件可能作为历史资料保留，但不代表当前公开产品线。

### `Cmp_Info/PIC&Vedio/`

生产设备、包装、托盘、装柜和出口图片/视频。用于公开页面前应确认素材
归属、人物肖像、水印和公开授权。

### `img/`

从 `Cmp_Info/PIC&Vedio/` 分类整理的网站素材，包括 factory、product、
packaging、export-loading、customer-visit、exhibition 和 videos。

用户已确认 `img/` 可用于网站，但图片本身不能证明具体牌号、性能、产能、
客户或合规结论。Alt 必须描述实际画面。

### `product/`

中文产品页主源：BK020–BK040、PT-300、PT-450P、DM2476G、Black 支柱页和
炭黑含量选型文章。用于产品事实、应用、TDS 参数和 FAQ 的中文底稿；英文
页面文案需按牌号证据和公开边界改写，不能逐字翻译或扩展为全系列承诺。

### `keywords/`

关键词规划清单（260 词）和页面归并表。只作选题和页面映射参考，不是
搜索量、KD 或 CPC 报告；使用前需按目标国家、数据库和采集日期重新验证。

### `wenzhang/`

英文文章草稿（发布前）。已发布文章的正文以
`xuqiu/wordpress/content/posts/*.wordpress.html` 和线上页面为准；草稿可能
滞后、保留旧链接或旧产品线内容，不能当作线上现状。

### `xuqiu/wordpress/`

WordPress 实施目录。相关开发规则见 `xuqiu/wordpress/AGENTS.md`。

`content/pages|products|posts` 是内容包主源；`content/guides/` 只保留历史
Black 指南；`content/server-sync-20261117/` 是生产内容的只读快照，用于
核对线上，不作为导入源。

### `xuqiu/design-preview/`

各页面的静态设计预览、线上截图和版本对照。用于设计评审和回归对比，
不是生产模板；生产模板在 `xuqiu/wordpress/themes/`。

### `xuqiu/DEPLOYMENT_LOG.md`

日期化的生产部署与实施历史。只在需要追踪历史、版本、旧改动和回滚点时
读取；当前状态仍以线上检查为准。

## Facts and Evidence

### Information Priority

表达具体产品事实时，按以下优先级：

1. 对应产品、版本和批次的当前 TDS、COA、SDS/MSDS、检测报告或供应商
   书面确认；
2. 当前来源索引中明确记录适用范围和证据强度的资料；
3. 公司官网或公开产品地图中的产品类别和型号线索；
4. 知识库中的通用教学框架。

知识库不能替代具体产品文件、试样或供应商确认。

### Product and Compliance Boundaries

- 不把单个牌号、样品或批次的文件扩展为整条产品线。
- TDS 中的建议添加比例、MFI、炭黑含量、填料含量等必须注明牌号和文件来源。
- 典型值、规格值和客户验收值必须区分。
- 缺少当前证据时写“待确认”，不要补写通用温度、配方、比例、MOQ、
  价格、交期或法规结论。
- 照片、颜色名称、树脂缩写、加工方式和目标市场不能单独证明适配或合规。
- 质量现象优先按“现象—可能原因—核查信息—下一步验证”表达。
- 历史 White/Color FDA、RoHS 或其他文件不得扩展为当前公开产品承诺。

### Public Entity and Documents

现有资料涉及多个主体：

- GE CHEMICAL & POLYMER GROUP CO., LTD；
- Wudi Longda；
- BINZHOU LEACHY NEW MATERIAL CO., LTD；
- SHANDONG BEIHONG NEW MATERIAL TECHNOLOGY CO., LTD。

主体关系、文件归属和公开授权未完全澄清时：

- 公开主体只写 `GE CHEMICAL & POLYMER GROUP CO., LTD`；
- 非 GE 文件仅作内部供应参考；
- 不在公开页面、元数据、FAQ、下载说明或表单中暴露非公开主体；
- 文件可用性按具体牌号、用途和国家审核；
- 网站采用“文档申请 + 人工审核 + 邮件回复”，不提供无需审核的公开下载。

### File Naming Notes

- `TDS--PT-400.doc` 的文件名是 PT-400，但正文型号为 PT-450P。
- `TDS--BK040.doc` 和 `TDS--PT-400.doc` 中的 `Food Grade` 不能直接扩展为
  完整食品接触合规结论。
- 公司简介、检测报告和 MSDS 中的地址、主体或范围有差异时，先由业务方确认。
- 未经明确授权，不公开个人电话、邮箱或客户资料。

## Editing Rules

- 默认使用中文交流；英文网站文案除外。
- 使用专业、保守、证据优先的 B2B 表达。
- 修改带状态字段的文件时，同步更新状态、日期和适用范围。
- 新增或更新事实时，记录来源、查阅日期和适用边界。
- 不删除来源、待确认项或反证来让结论显得更确定。
- 不把“可能”“通常”“待确认”机械改成确定承诺。
- 修改知识库时同步检查术语表、来源索引、待确认事项和交叉链接。
- 修改页面文案时检查 RFQ、Documents、隐私和证据边界是否一致。
- 修改市场研究时保留数据日期、地区和关键词口径。
- 除非明确要求，不覆盖原始 TDS、SDS/MSDS、检测报告和公司资料。

## Skills

`humanizer` v3.1.0 位于 `~/.codex/skills/humanizer/`，可用
`$humanizer` 调用。

适用于英文官网页面、文章、FAQ、销售邮件和对外文案的自然化改写。改写时
必须保留事实、数字、日期、牌号、测试条件、引用、SEO 字段、CTA 和证据
边界。

不用于改写 TDS、MSDS、法规原文、来源索引或待确认事项。Humanizer 不能
覆盖本项目的主体、合规、公司事实和产品参数规则。

## Modification and Verification

- 编辑文件优先使用 `apply_patch`。
- 修改前查看 `git status --short`，保留用户已有改动。
- 完成后至少运行 `git diff --check`。
- 检查 Markdown 相对链接、文件路径和事实状态。
- 修改前端时按 `SITE_RELEASE.md` 和 WordPress 开发规则执行 Playwright。
- 不执行 `rm -rf`、强制推送、硬重置、`DROP TABLE` 或 `TRUNCATE`。
- 密钥、Token、Cookie、私钥和客户敏感资料不得写入仓库、文案、日志或提交记录。
- 不通过删除内容、隐藏入口或关闭索引绕过检查问题。

## Delivery

一般任务结束时说明：

- 修改了哪些文件或 CMS 对象；
- 变更属于知识、研究、PRD、文案、代码还是部署；
- 哪些结论有文件支持，哪些仍待确认；
- 执行了哪些验证；
- 是否改变项目阶段或公开声明边界。

属于 `SITE_RELEASE.md` 门禁的任务，还必须按该文件第 9 节输出检查结论、
检查明细、修改内容、未解决问题和回滚方式。
