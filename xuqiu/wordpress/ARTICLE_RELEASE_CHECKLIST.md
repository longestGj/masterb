# 文章发布 Checklist

- 适用：新增、修改或发布 `content/posts/` 下的博客文章
- 配套规则：根目录 `AGENTS.md`、`SITE_RELEASE.md`、`xuqiu/wordpress/AGENTS.md`
- 用法：开始任务时复制本清单，逐项填写证据；没有实际证据不得标记 PASS

## 0. 变更级别

- [ ] 新文章：A + B
- [ ] 修改已发布文章：A
- [ ] 修改模板、CSS 或图片展示：追加 C
- [ ] 修改 Title、Meta、Canonical、Schema、Sitemap 或统计：追加 D
- [ ] 正式发布：当前适用级别 + E
- [ ] 已获得生产发布、Nginx、DNS、证书或重定向的明确确认（如涉及）

## 1. 内容与证据

- [ ] 全文只服务一个主要搜索意图
- [ ] 正文没有 H1；H1 由模板或 `heroTitle` 输出
- [ ] H2/H3 与确认过的大纲一致，层级不跳级
- [ ] 具体牌号数据注明“当前 TDS 示例值”，并写清适用牌号
- [ ] 没有固定价格、MOQ、交期、付款、食品接触或全系列合规承诺
- [ ] 没有“保证无黑点”“适合所有树脂”等绝对化表述
- [ ] 数值范围统一用 `to`（如 `20% to 40%`），没有 `–` / `—`
- [ ] 至少 2 个上下文出站内链，包含产品页、RFQ 或 Documents 之一
- [ ] 至少 1 个站内入口（分类页或旧文章），不是孤儿页
- [ ] 已调用 `humanizer` 完成英文润色；事实、数字、牌号、测试条件、内链、SEO 字段和 CTA 未被改写
- [ ] humanizer pass 已记录，至少说明改写段落、保留项和剩余风险
- [ ] 如果当前会话技能目录未加载 `humanizer`，已按 `~/.codex/skills/humanizer/SKILL.md` 逐条执行同等流程，并在记录中注明

证据：

```bash
# 正文 H1 应为 0
grep -c "<h1" content/posts/<slug>.wordpress.html

# 不应有 en dash / em dash
grep -o "–\|—" content/posts/<slug>.wordpress.html | wc -l   # 期望 0
```

## 2. SEO 字段

- [ ] SEO Title 25–60 字符
- [ ] Meta Description 120–155 字符
- [ ] Slug 与最终 URL 一致
- [ ] Canonical 指向正式 URL
- [ ] 发布时 `robots` 为 `index,follow`
- [ ] OG title、description、image 正确
- [ ] Schema 至少包含 `BlogPosting`
- [ ] 分类为 `Masterbatch Guides`
- [ ] `BreadcrumbList`：当前全站文章未输出；如项目决定新增，另行立项，不阻塞本篇

## 3. Featured Image

- [ ] 使用 hero-safe 图片：不带标题文字，不会被 Hero 背景裁切破坏
- [ ] 尺寸适合 Hero 和 OG（当前 Hero 参考 1600×900）
- [ ] Alt 描述实际画面或图示，不写产品性能
- [ ] 已上传媒体库，记录 Attachment ID
- [ ] 已设置 `_thumbnail_id`
- [ ] OG image 返回 `200 image/webp`
- [ ] 带文字封面只做正文内嵌图，不做 Hero
- [ ] 示意图标注 `Illustrative`，不冒充真实工厂或产品照片

## 4. Manifest、构建与测试

- [ ] `content/posts/manifest.json` 文章数量正确
- [ ] `bin/build-article-posts.js` entries 数量正确
- [ ] `tests/articles.spec.js` 数量、slug、featured post 断言正确
- [ ] `tests/seo-audit.spec.js` 已加入新文章路由
- [ ] `tests/blog-archive.spec.js` 的 feature 文章断言已更新
- [ ] 构建脚本运行后，已发布文章的 HTML 没有被旧 Markdown 覆盖
- [ ] `git diff --check` 通过

证据：

```bash
cd xuqiu/wordpress
node bin/build-article-posts.js
npx playwright test tests/articles.spec.js
MB_LIVE_BASE_URL=https://www.gemasterbatch.com npx playwright test tests/articles.spec.js
MB_LIVE_BASE_URL=https://www.gemasterbatch.com npx playwright test tests/blog-archive.spec.js
MB_LIVE_BASE_URL=https://www.gemasterbatch.com npx playwright test tests/seo-audit.spec.js
```

## 5. 发布前生产准备

- [ ] 数据库备份完成，记录路径
- [ ] 被修改的已发布文章正文已单独备份
- [ ] 新 release 从当前 release 复制，只放本次改动文件
- [ ] 文件 hash 与本地一致
- [ ] 文件 owner 为 `www-data:www-data`
- [ ] 如有 PHP 改动，已运行 `php -l`
- [ ] 已记录回滚 release、文章 ID、附件 ID
- [ ] 已明确本次是否修改 Nginx、DNS、证书或缓存（如涉及必须单独确认）
- [ ] 已获得正式发布确认

## 6. 发布后验证

- [ ] 文章 URL 返回 200
- [ ] Title、Description、Canonical 正确
- [ ] `robots` 为 `index,follow`
- [ ] OG image 返回 200
- [ ] Schema 含 `BlogPosting`
- [ ] Hero 背景正常显示，没有文字叠字
- [ ] Blog 归档出现文章卡片
- [ ] 分类页或旧文章的入站链接返回 200
- [ ] Sitemap 包含新 URL
- [ ] 桌面 1440px、平板 768px、手机 390px、320px 无横向溢出
- [ ] RFQ / Documents CTA 可点击
- [ ] 浏览器控制台无新增严重错误
- [ ] 更新 `DEPLOYMENT_LOG.md`，记录 ID、hash、验证结果和回滚方式
- [ ] 如 GSC 可用，确认已提交 URL 并检查收录状态

## 7. 回滚记录

- [ ] 回滚 release：
- [ ] 文章 ID / 附件 ID：
- [ ] 正文备份路径：
- [ ] 数据库备份路径：
- [ ] 回滚命令：
- [ ] 回滚后需要恢复的索引状态或缓存：

## 8. 已知不阻塞项

- 文章页全站未输出 `BreadcrumbList` Schema。
- `post-sitemap.xml` 未包含文章 featured image 的图片节点。
- 新文章没有 legacy root 301，除非它曾经有过根路径 URL。

以上三项为当前项目状态，除用户明确要求外，不作为单篇文章发布的阻断条件。
