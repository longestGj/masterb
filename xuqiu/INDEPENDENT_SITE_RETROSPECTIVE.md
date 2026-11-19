# 独立站项目建设复盘

- 项目：GE Chemical Masterbatch 英文 B2B 独立站
- 正式域名：`https://www.gemasterbatch.com`
- 复盘日期：2026-11-16
- 本次核对方式：只读检查仓库与生产状态，不修改页面和生产环境

## 1. 项目结果

这次工作把一个以资料和内容为主的色母粒项目，推进成了具备以下能力的
英文 B2B 独立站：

- 可长期维护的 WordPress 内容与主题结构；
- 以黑色母粒和消泡母粒为核心的公开产品体系；
- 从产品内容到 RFQ、Documents 和邮件通知的询盘路径；
- 基础 SEO、Open Graph、Schema、Sitemap 和 robots 管理；
- 桌面与手机 Playwright 回归测试；
- 基于版本目录、原子 symlink 和保留回滚点的生产发布流程。

当前不是“全部完成”的网站项目。页面主体已经上线，但 GA4、Search Console、
真实 SMTP、自动备份和最终法务确认仍依赖业务账号或后续运维。

## 2. 当前线上基线

| 项目 | 当前状态 |
|---|---|
| 域名 | `https://www.gemasterbatch.com` |
| WordPress | `7.1.4` |
| 当前 release | `/var/www/ashareai/releases/20261110-17` |
| 干净回滚 release | `/var/www/ashareai/releases/20261110-15` |
| 子主题 | `mtm-b2b-masterbatch 0.9.66` |
| Rank Math SEO | `1.0.281` |
| WP Mail SMTP | `4.10.3` |
| 搜索索引 | `blog_public=1` |
| 发布对象 | 21 个 Page、4 篇 Post |
| 页面 Sitemap | 16 个 URL |
| Blog/文章 Sitemap | 5 个 URL |
| 图片 Sitemap | 29 个 `<image:image>` 节点 |
| Privacy Policy | `noindex,nofollow` |

本轮只读验证：

- `/sitemap_index.xml`、`/page-sitemap.xml`、`/post-sitemap.xml`、
  `/robots.txt` 均返回 `200`。
- 生产静态首页、产品树和主要页面均已发布。
- 图片 Sitemap 中 29 个图片 URL 已在上一发布轮逐个验证为
  `200 image/webp`。

## 3. 已建成的站点内容

### 首页

- 黑色母粒制造商和供应商定位；
- 黑色母粒、消泡母粒两条产品路线；
- 应用场景、审核流程、技术文件、工厂与公司能力；
- RFQ 和 Documents 两条主要转化路径；
- FAQ、Blog 入口与最终询盘 CTA。

### 产品体系

Black Masterbatch：

- BK020
- BK025
- BK030
- BK035
- BK040
- PT-300
- PT-450P

Desiccant Masterbatch：

- DM2476G

产品分类页和详情页均使用独立模板，包含应用、参数边界、牌号关系、
技术文件、样品或询盘入口。

### 内容与资源

- Blog 归档；
- 4 篇已发布 Buyer Guides；
- Buyer FAQ；
- RFQ Checklist；
- Technical Documents；
- About / Quality；
- Privacy Policy。

### 已移除的公开范围

White Masterbatch 和 Color Masterbatch 已按业务确认从公开产品线移除：

- 不再出现在 Header、Footer、首页、表单选项和 Schema；
- 旧产品 URL 执行 301；
- 数据库公开内容已完成清理；
- 历史文件仍可能作为内部资料保留。

## 4. 设计与前端实现

最终设计系统形成了稳定基线：

- 白色技术型页面底色；
- 深绿 `#26372B`、品牌绿 `#305030` 结构色；
- 柠檬绿 `#D0F090` 用于焦点、线条和状态信号；
- Archivo 标题 + Inter 正文的自托管字体组合；
- 1240px 主容器、4px 卡片与按钮圆角；
- 共享 Header/Footer；
- 页面专属 CSS 按模板条件加载。

重要设计经验：

- 先确认内容结构和页面任务，再做视觉方案，避免只换布局不改表达；
- 先给桌面与手机草图，获得明确反馈后再实现，显著减少返工；
- 产品页不能只做模板复用，不同分类和牌号需要不同的信息组织；
- 移动端不是桌面缩小版，需要单独调整间距、图片、表格和 CTA；
- 设计预览与生产模板分离，批准后才修改 WordPress。

## 5. WordPress 架构

### 主题

- 使用 `mtm-b2b-masterbatch` 子主题；
- `parts/header.html` 与 `parts/footer.html` 全站共享；
- 首页使用 `front-page.html` 和共享首页内容部件；
- 分类页、产品页、About、FAQ、Documents、Checklist、Privacy 各有独立模板；
- 全局 CSS token 与页面专属 CSS 分离；
- 共享 Header/Footer 使用独立 class，避免继承单页样式。

### MU Plugins

- `mb-content-importer.php`：Markdown 和受控 Gutenberg 内容导入；
- `mb-rfq-submissions.php`：RFQ/Documents 提交、私有询盘记录和邮件通知；
- `mb-seo-schema.php`：页面角色 Schema 与主题图片 Sitemap 补录。

### 内容模型

- Markdown 内容包保留为页面和文章主源；
- 已发布页面正文不直接用旧内容包覆盖；
- 产品参数、文件范围和法规结论以具体牌号资料为边界；
- 公开页面只呈现当前已验证的产品线和事实。

## 6. SEO 与搜索基础

已完成：

- 每页独立 Title、Meta Description 和 HTTPS self-canonical；
- 单一 H1；
- Organization、WebSite、WebPage、CollectionPage、Product、FAQPage、
  BlogPosting Schema；
- Open Graph 和 Twitter Card；
- Rank Math XML Sitemap；
- Privacy Policy `noindex,nofollow`；
- 旧产品与结构页 301；
- 首页与产品页主题图片补录到图片 Sitemap。

仍未完成：

- 新域名的 Search Console 验证；
- 在 GSC 提交 `sitemap_index.xml`；
- URL Inspection 抽查；
- 等待并检查 Google 覆盖率、抓取和结构化数据报告。

需要区分的四个状态：

1. 代码已写好；
2. 页面已经上线；
3. 搜索引擎已经抓取；
4. 页面已经进入搜索结果。

当前只能确认前两项和 Sitemap 可访问，不能宣称页面已被 Google 收录。

## 7. 转化与表单闭环

已建成两条表单：

- RFQ：产品、应用、树脂、工艺、目标、数量和文件需求；
- Documents：额外要求文件类型和使用目的。

当前服务端能力：

- nonce；
- 蜜罐；
- 必填和邮箱校验；
- 限流；
- 隐私同意；
- 保存私有 `mb_inquiry`；
- 尝试发送通知邮件；
- 邮件失败时仍保留询盘并记录失败状态。

仍需完成：

- 真实 SMTP 凭据；
- 收件人、回复负责人和响应时限；
- 真实投递测试；
- 邮件失败告警；
- 现有失败询盘的人工处理。

## 8. 分析、统计与转化事件

代码已接入：

- `rfq_submit_success`
- `documents_submit_success`
- `rfq_submit_error`
- `documents_submit_error`
- `rfq_email_delivery_failed`
- `documents_email_delivery_failed`

当前阻塞：

- GA4 Measurement ID 未配置；
- GA4 Measurement Protocol API Secret 未配置；
- 两个成功事件尚未在 GA4 标记为 Key Event；
- 尚未在 GA4 Realtime/DebugView 验证真实到达。

因此，GA4 代码虽然已经准备好，但当前不能把“统计分析已启用”标记为完成。

## 9. 测试与发布体系

### 测试

项目使用 Playwright 覆盖：

- 桌面和手机主要路由；
- H1、Title、Description、Canonical；
- Header/Footer；
- 产品分类与产品详情；
- Blog 和文章；
- RFQ、Documents 和 Checklist；
- About、FAQ、Privacy；
- Schema、Open Graph、Sitemap 和 robots；
- 桌面、平板、手机的横向溢出；
- 图片加载和详细正文与 Markdown 一致性。

### 发布

生产使用版本目录：

```text
/var/www/ashareai/
├── current -> releases/<release>
├── releases/
└── backups/
```

发布流程：

1. 从当前干净 release 复制新目录；
2. 只替换本次修改文件；
3. 运行 PHP 语法、Playwright 和 Git 检查；
4. 切换 symlink；
5. 重载 PHP-FPM；
6. 清理 WordPress cache；
7. 必要时重建 Rank Math Sitemap；
8. 验证正式域名并保留上一版回滚。

## 10. 这次最重要的经验

### 内容与页面结构必须先定

如果只改布局，不重新组织内容，页面会反复出现“换了样子但仍不像独立站”
的问题。产品页需要围绕产品事实、应用、选牌、文件和询盘组织。

### 设计稿审批能减少返工

先做草图、静态预览、桌面/手机截图和对照，再实施，比直接改生产模板更稳定。

### 设计系统必须集中

统一字体、颜色、间距和按钮体系后，页面之间才有一致性。页面专属 CSS
应该扩展系统，而不是重新定义一套风格。

### 测试必须验证真实页面

只看代码或本地 HTML 不够。需要检查正式域名、实际图片、表单、Sitemap、
robots、Header/Footer 和手机布局。

### 部署必须有回滚

发布不是上传文件。版本目录、原子切换、PHP-FPM 重载和保留上一版，是这次
能快速修复问题的关键。

### 第三方服务只有配置到账号才算完成

代码接入不等于 GA4、GSC 或 SMTP 完成。必须用真实账号验证数据或邮件到达。

### 规则要与历史分离

项目规则、WordPress 开发说明和发布历史曾经混在一个超大的 `AGENTS.md`
中。现已拆分：

- 根 `AGENTS.md`：稳定规则与任务路由；
- `SITE_RELEASE.md`：站点检查；
- `xuqiu/wordpress/AGENTS.md`：开发规则；
- `xuqiu/DEPLOYMENT_LOG.md`：日期化实施历史。

## 11. 当前主要风险

| 风险 | 影响 | 优先级 |
|---|---|---|
| 真实 SMTP 未配置 | 新询盘没有可靠邮件提醒 | P0 |
| GA4 未配置 | 无法衡量访问、来源和询盘转化 | P0 |
| GSC 未验证 | 无法查看抓取、索引和 Sitemap 状态 | P0 |
| 自动备份未确认 | 数据损坏时恢复能力不足 | P0 |
| 法务与 Cookie 未最终确认 | 隐私和数据合规存在风险 | P0 |
| 大量本地改动未提交 Git | 换分支或换机器可能丢失 | P0 |
| 历史文档仍有个别旧状态 | 容易误判当前版本 | P1 |
| Sitemap XSLT 将被浏览器淘汰 | 浏览器展示受影响，不影响搜索引擎 | P2 |

## 12. 下一步建议

### P0

1. 提交当前 Git 基线，至少包括规则文件、主题、MU Plugin、测试和内容包。
2. 配置真实 SMTP，完成 RFQ 与 Documents 收件测试。
3. 创建 GA4，配置 Measurement ID 和 API Secret，验证 Key Events。
4. 验证 Search Console 属性并提交 Sitemap。
5. 确认自动备份和一次恢复演练。
6. 完成 Privacy、Cookie、数据保留和负责人确认。

### P1

1. 新建 Film & Packaging、Injection Molding、General Extrusion、
   Recycled PE/PP 应用页。
2. 补齐 Buyer Guides：What Is Masterbatch、TDS/SDS/COA、质量问题排查等。
3. 根据 GSC 查询数据补充产品、应用和采购关键词页面。
4. 建立 GEO/生成式搜索内容策略。
5. 清理和同步旧的 `WEBSITE_TODO.md` 状态。

### P2

1. 下次主题或 SEO 发布时移除 Sitemap XSLT 样式。
2. 定期压缩图片、检查 Core Web Vitals。
3. 按固定周期审计 Title、Canonical、Schema、Sitemap 和失效链接。

## 13. 总评

这次项目的核心成果不是“做了几个页面”，而是建立了一套可以继续扩展的
B2B 独立站基础：

- 内容有来源和证据边界；
- 页面有统一设计系统；
- 产品与询盘形成闭环；
- SEO 与 Sitemap 有技术基础；
- 改版有预览和审批；
- 上线有测试、release 和回滚；
- 规则、开发和发布历史已经分开维护。

网站已经具备持续发布产品页和应用文章的基础，但正式运营前仍需完成
SMTP、GA4、GSC、备份、法务和 Git 基线这六项基础设施工作。
