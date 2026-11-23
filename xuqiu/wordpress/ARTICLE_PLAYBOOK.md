# 文章写作与发布 Playbook

- 适用：`content/posts/` 下的英文博客文章，从选题到发布
- 配套：根目录 `AGENTS.md`、`SITE_RELEASE.md`、`xuqiu/wordpress/AGENTS.md`
- 发布门禁：逐项执行 [ARTICLE_RELEASE_CHECKLIST.md](ARTICLE_RELEASE_CHECKLIST.md)
- 方法来源：项目 SEO 知识库的搜索意图、文章大纲、网页内容类型三篇笔记

本文件是流程说明，不是发布检查表。检查表负责“有没有做”，本文件负责“怎么做”。

## 1. 先判断页面类型

不要所有关键词都写成博客。

| 搜索意图 | 用户任务 | 优先页面 |
|---|---|---|
| 信息型 | 了解概念、原因、方法、类型 | 博客、指南、FAQ |
| 商业调查型 | 比较方案、选型、评估供应商 | 对比文章、选型指南、LandFAQ、分类页 |
| 交易型 | 获取报价、申请文件、联系 | 产品页、RFQ、Documents |
| 导航型 | 找品牌或已知页面 | 首页、About、Contact |

常见文章类型：

- What is：概念和范围
- How to：步骤、选型、判断标准
- A vs B：方案比较
- Problems & Solutions：问题排查
- Buyer guide：采购和询盘准备
- Case study：项目证据（必须有授权）

一篇文章只锁定一个主要意图。需要同时回答“概念 + 报价 + 公司介绍”时，拆成不同页面。

## 2. 选题

候选来源：

- `keywords/MASTERBATCH_KEYWORDS_260.csv` 和页面归并表；
- Search Console 查询（可用时）；
- 销售邮件、询盘、客户问题；
- 现有产品页、TDS 和应用场景；
- 竞品页面缺口，但不能直接复制其大纲。

选题前回答五个问题：

1. 目标读者是谁？
2. 他正在完成什么任务？
3. 搜索结果页主要是文章、分类页还是产品页？
4. 我们能否提供别处没有的牌号数据、应用经验或判断框架？
5. 读者下一步去哪里？

任一问题答不上来，先不要写。

建议打分：

| 维度 | 判断 |
|---|---|
| 意图清晰 | 信息 / 商业调查 / 交易 |
| 业务相关 | 是否能自然连到 Black / Desiccant / RFQ / Documents |
| 证据 | TDS、产品页、知识库是否够用 |
| 差异化 | 是否能讲清取舍，而不是同义改写 |
| 内链 | 是否有至少一个现有入口 |
| 成本 | 是否需要新数据、新图片或设计 |

优先做“意图清晰 + 业务相关 + 有证据 + 有明确下一步”的题。

## 3. 写作简报

写正文前先填完：

```text
工作标题：
H1：
Slug：
主关键词：
次要关键词：
搜索意图：
目标读者：
读者任务：
本文承诺：
文章类型：
预计长度：
证据：
不能写的边界：
出站内链：
站内入口：
CTA：
Featured Image：
```

简报确认后再写大纲。不要先写 2,000 字再想这篇文章要解决什么。

## 4. 大纲

把用户问题映射成 H1/H2/H3：

- H1：整页主题，和主关键词、搜索意图一致；
- H2：用户必须解决的主要问题；
- H3：某个 H2 下的参数、场景、步骤或示例。

常用顺序：

```text
指南：目标 → 准备 → 步骤 → 检查 → 常见错误 → 下一步
排查：症状 → 可能原因 → 核查 → 验证 → 预防
比较：比较场景 → 评估维度 → 各方案 → 适用条件 → 建议
采购：需求 → 规格 → 成本 → 供应商评估 → 下一步
```

大纲自检：

- 只读 H1/H2/H3，能不能看懂文章在讲什么；
- 每个 H2 是否对应一个真实问题；
- 同级标题是否在同一逻辑维度；
- 每个核心章节是否有证据或可执行动作；
- 内链和 CTA 是否已经在大纲阶段规划。

## 5. 草稿

文章正文用 Gutenberg HTML 块，放在
`content/posts/<slug>.wordpress.html`。

基本结构：

```html
<!-- wp:paragraph -->
<p>Opening answer and scope.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>Section question</h2>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table"><table>...</table></figure>
<!-- /wp:table -->
```

规则：

- 正文不写 H1，H1 由 `heroTitle` 或模板输出；
- H2/H3 层级连续；
- 表格只放适合表格的数据，并注明牌号和 TDS 范围；
- 数值范围统一写 `to`，例如 `20% to 40%`、`2% to 5%`、`3 to 50`；
- 不用 `–` 或 `—`，`tests/articles.spec.js` 会拒绝；
- 英文用保守、证据优先的 B2B 表达；
- 篇幅由问题和证据决定，不按固定字数平均分配。

### 5.1 Humanizer pass（必过）

每篇新文章或大幅改写的文章，在跑测试和发布前必须完成一次 `humanizer` 润色。

执行顺序：

1. 通读全文，标出 humanizer SKILL.md 里的 AI 写作模式；
2. 保留全部事实、数字、牌号、测试条件、引用、内链、SEO 字段和 CTA；
3. 重写句子和段落节奏，删除空泛过渡、重复 closer、装饰性加粗和机械三段式；
4. 检查没有新增事实，也没有丢失原有 claim；
5. 检查没有 `–` / `—`，数值范围仍用 `to`；
6. 记录改写段落、保留项和未解决风险。

如果当前会话技能目录没有加载 `humanizer`，按
`~/.codex/skills/humanizer/SKILL.md` 逐条执行同等流程，并在记录中注明
“humanizer skill 未加载，按 SKILL.md 手动执行”。

## 6. 证据与声明边界

写具体事实时，先建一张内部核对表：

| 说法 | 来源 | 适用范围 | 公开措辞 |
|---|---|---|---|
| 炭黑含量 30% | 当前 TDS | BK030 | “current TDS lists 30%” |
| MFI 3–50 | BK020–BK040 页面 | 具体牌号 | “current BK020 to BK040 pages list…” |
| Food Grade | 单个 TDS | 具体牌号 | “TDS carries a Food Grade label” |

必须区分：

- 典型值、规格值、客户验收值；
- 单个牌号、样品、批次与整条产品线；
- TDS、COA、SDS、合规声明各自能证明什么。

不能写：

- 固定价格、MOQ、交期、付款方式；
- 食品接触、FDA、RoHS、REACH 的全系列结论；
- “保证无黑点”“适合所有树脂”“完全替代”；
- 没有数据的机械性能、耐候或合规结论。

说“当前页面列出……”时，必须覆盖所有适用牌号，或点名具体牌号。不能拿部分牌号代表全系列。

## 7. 内链

每篇文章至少：

- 2 个上下文出站内链，包含产品页、RFQ 或 Documents 之一；
- 1 个站内入口，来自分类页、旧文章或资源页；
- 发布后不能是孤儿页。

锚文本说明目标页面，例如 `black masterbatch for injection molding`，不用 `click here`。

新增入站链接时注意顺序：

1. 先把文章发布；
2. 再上线分类页/旧文章的入站链接；
3. 或把两者放在同一次发布，避免链接指向草稿 404。

## 8. Featured Image

文章 Hero 使用 Featured Image 作为背景，并叠加约 87% 深绿遮罩。

因此 Featured Image 必须 **hero-safe**：

- 不带标题文字；
- 不把关键信息放在边缘；
- 推荐 1600×900；
- 带文字的封面只能做正文内嵌图，不能做 Hero。

工作流：

1. 用 HTML/SVG 设计；
2. 用 Playwright 截图；
3. 转 WebP；
4. 上传媒体库，记录 Attachment ID；
5. 设置 `_thumbnail_id`；
6. 写 Alt，描述实际画面或图示；
7. 检查 1440px 和 390px 下 Hero 是否正常、无叠字。

示意图可以标注 `Illustrative`，但不能冒充真实工厂或产品照片。

## 9. Manifest、构建与测试

新增文章必须同步三处：

1. `content/posts/manifest.json`
2. `bin/build-article-posts.js`
3. `tests/articles.spec.js`（以及 `blog-archive.spec.js`、`seo-audit.spec.js`）

原则：

- 已发布文章的 HTML 是正文事实来源，不能被旧 Markdown 覆盖；
- 构建脚本对已发布文章使用 `frozen`，新文章可以用 `prebuilt`；
- 新文章要加入 `seo-audit.spec.js` 的 live 路由列表；
- Blog 归档的 feature 文章断言要随最新文章更新；
- 每次构建后检查已发布文章 HTML 的 hash 是否变化。

## 10. 本地验证

```bash
cd xuqiu/wordpress
node bin/build-article-posts.js
npx playwright test tests/articles.spec.js
git diff --check
```

需要线上验证时：

```bash
MB_LIVE_BASE_URL=https://www.gemasterbatch.com \
  npx playwright test tests/articles.spec.js
MB_LIVE_BASE_URL=https://www.gemasterbatch.com \
  npx playwright test tests/blog-archive.spec.js
MB_LIVE_BASE_URL=https://www.gemasterbatch.com \
  npx playwright test tests/seo-audit.spec.js
```

如果服务器偶发超时，先记录具体路由和响应时间，不要直接把测试改成跳过。

## 11. 草稿导入与预览

正式发布前，先创建 WordPress 草稿：

- 上传 Featured Image；
- 用 `wp media import` 获取 Attachment ID；
- 用 `wp post create` 导入正文；
- 写入 `_mb_*` 和 Rank Math 字段；
- 草稿使用 `noindex,nofollow`；
- 核对本地与 WordPress 正文的 MD5；
- 在后台预览桌面和手机。

草稿阶段不要给公开页面加入站链接，避免 404。

## 12. 正式发布

发布前：

- 备份数据库；
- 备份被修改的已发布文章正文；
- 从当前 release 复制新 release；
- 只放本次改动文件；
- 校验 hash 和 owner；
- 记录回滚 release、文章 ID、附件 ID。

发布顺序：

1. 发布新文章，切换 `index,follow`；
2. 更新旧文章的入站链接；
3. 切换 release（如有模板/样式变更）；
4. 重载 PHP-FPM；
5. 清缓存；
6. 重新生成 Rank Math Sitemap；
7. 执行发布后检查。

## 13. 发布后验证

至少检查：

- URL 200；
- Title、Description、Canonical；
- `index,follow`；
- OG image 200；
- BlogPosting Schema；
- Hero 背景无叠字；
- Blog 归档卡片；
- 入站链接 200；
- Sitemap 包含 URL；
- 桌面 1440、平板 768、手机 390/320 无横向溢出；
- RFQ / Documents CTA 可点击；
- 控制台无新增严重错误。

把这些结果和回滚信息写入 `xuqiu/DEPLOYMENT_LOG.md`。

## 14. 常见失败模式

- 用带大标题的封面做 Hero，和 H1 叠字；
- 数值范围用了 en dash，测试失败；
- manifest、build、test 三处数量不一致；
- 构建脚本用旧 Markdown 覆盖已发布 HTML；
- 文章没有站内入口，成为孤儿页；
- 用部分牌号代表全系列；
- 先上线入站链接，文章还没发布，链接 404；
- Blog 归档测试还硬编码旧 feature 文章；
- 清缓存后服务器偶发慢请求，被误判为页面错误；
- 文章页没有 BreadcrumbList、post sitemap 没有图片节点（当前已知缺口）。

## 15. Definition of Done

一篇文章算完成，需要同时满足：

- 内容回答了一个明确搜索意图；
- 证据和声明边界清楚；
- 已完成 `humanizer` pass，并记录改写段落、保留项和剩余风险；
- 有出站内链和站内入口；
- Featured Image hero-safe，Alt 正确；
- manifest/build/test 一致；
- 发布后 URL、SEO、Schema、OG、Sitemap、Blog 卡片和移动端都验证通过；
- 有回滚记录和部署日志。
