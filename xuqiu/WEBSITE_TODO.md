# GE Chemical Masterbatch Website Todo

- 状态日期：2026-11-10
- 当前生产地址：https://www.gemasterbatch.com/
- 当前 release：`/var/www/ashareai/releases/20261110-14`
- 当前主题：`mtm-b2b-masterbatch 0.9.65`
- 当前公开产品线：Black Masterbatch、Desiccant Masterbatch
- 当前搜索状态：`blog_public=1`，页面输出 `index, follow`，Nginx 临时
  noindex 响应头已移除
- 当前数据库：21 个发布 Page、4 篇发布 Post
- 当前备份：
  `/var/www/ashareai/backups/ashareai-db-pre-remove-white-color-20261110.sql.gz`

## 当前结论

网站主体、产品分类、已发布产品页、Blog、About、FAQ、Resources、RFQ、
Documents 和隐私政策已经上线并通过桌面、手机 SEO 与路由测试。

业务方已于 2026-11-10 确认正式开放新域名搜索收录。当前仍需完成
Search Console 属性验证与 Sitemap 提交、邮件投递、自动备份、GA4
和最终业务/法务确认。

## P0：正式开放索引前必须完成

### P0-01 配置真实 SMTP

- [ ] 确认 SMTP 服务商。
- [ ] 提供 SMTP host、端口和 TLS/SSL 模式。
- [ ] 提供 SMTP 用户名和密码。
- [ ] 确认发件邮箱和发件人名称。
- [ ] 确认 RFQ 和 Documents 的接收邮箱。
- [ ] 在 WP Mail SMTP 中把 mailer 从当前 PHP `mail()` 改为真实 SMTP。
- [ ] 分别提交一次 RFQ 和 Documents 测试。
- [ ] 确认测试询盘保存成功且通知邮件实际到达。
- [ ] 确认 `_mb_rfq_email_sent=1`。
- [ ] 删除或标记测试记录。

当前证据：

- WP Mail SMTP 已安装并启用。
- mailer 仍为 `mail`。
- SMTP host、用户名和密码均未设置。

### P0-02 人工处理现有失败询盘

- [ ] 登录 WordPress 后台 `Inquiries`。
- [ ] 确认当前 1 条私有询盘是测试还是真实客户。
- [ ] 如果为真实客户，立即人工回复。
- [ ] 配置 SMTP 后决定是否需要补发内部通知。
- [ ] 确认邮件失败告警能够被发现。

### P0-03 确认表单责任人

- [ ] 确认 RFQ 回复负责人。
- [ ] 确认 Technical Documents 审核负责人。
- [ ] 确认正常响应时限。
- [ ] 确认节假日或负责人缺席时的备用处理人。
- [ ] 确认询盘数据保留期限和删除规则。

### P0-04 建立自动备份和恢复流程

- [ ] 建立每日数据库备份。
- [ ] 建立每日 WordPress 文件备份，至少覆盖：
  - [ ] `wp-content/uploads`
  - [ ] 主题和 MU Plugins
  - [ ] Nginx 和 PHP 配置
  - [ ] `.env`
- [ ] 至少保留 7–14 天。
- [ ] 增加异地或对象存储副本。
- [ ] 配置备份失败告警。
- [ ] 完成一次数据库恢复演练。
- [ ] 完成一次文件恢复演练。
- [ ] 记录恢复耗时和负责人。

当前状态：

- 只有 2026-11-09 的手动数据库备份。
- 尚未配置自动备份和恢复演练。

### P0-05 完成 Search Console 接入

- [ ] 使用业务方 Google 账号登录。
- [ ] 在 Rank Math Analytics 中连接 Google。
- [ ] 验证 `www.gemasterbatch.com` 属性。
- [ ] 确认首选域名为 `https://www.gemasterbatch.com`。
- [ ] 提交 `https://www.gemasterbatch.com/sitemap_index.xml`。
- [ ] 确认 Sitemap 状态成功。
- [ ] 检查覆盖范围和抓取错误。
- [ ] 检查结构化数据错误。
- [ ] 将仍使用 `gzh.hzscf.site` 的待办文档更新为正式域名。

### P0-06 配置 GA4

- [ ] 创建 GA4 Web Data Stream。
- [ ] 取得 GA4 Measurement ID。
- [ ] 配置 `MASTERBATCH_GA4_MEASUREMENT_ID`。
- [ ] 配置 Measurement Protocol API Secret。
- [ ] 确认页面只加载一个 GA4 配置。
- [ ] 将 `rfq_submit_success` 标记为 Key Event。
- [ ] 将 `documents_submit_success` 标记为 Key Event。
- [ ] 验证来源页面参数。
- [ ] 验证产品兴趣参数。
- [ ] 验证表单错误事件。
- [ ] 验证邮件失败事件。
- [ ] 确认事件不包含姓名、邮箱、公司或消息正文。

### P0-07 完成隐私、法务和 Cookie 确认

- [ ] 业务方复核 Privacy Policy。
- [ ] 法务复核 Privacy Policy。
- [ ] 确认表单数据保存期限。
- [ ] 确认邮件服务商和网站分析服务已写入隐私政策。
- [ ] 如果启用 GA4 或营销 Cookie，确认是否需要 Cookie 同意机制。
- [ ] 确认目标市场对 Cookie 和分析工具的要求。

### P0-08 正式开放索引

- [x] 取得业务方最终上线确认。
- [x] 设置 `blog_public=1`。
- [x] 移除 Nginx 临时 `X-Robots-Tag: noindex, nofollow`。
- [x] 重新生成 Rank Math Sitemap。
- [x] 确认每个公开页面有 self-canonical。
- [x] 确认 noindex 只保留在确实不应收录的页面。
- [x] 确认 Sitemap 只包含应收录页面。
- [ ] 提交 Sitemap 到 Search Console。
- [ ] 使用 URL Inspection 抽查首页、产品分类、产品详情和重点文章。
- [ ] 监控 24 小时抓取、表单和邮件。

## P1：内容建设

### P1-C01 应用页

- [ ] Film & Packaging
- [ ] Injection Molding
- [ ] General Extrusion
- [ ] Recycled PE/PP

执行要求：

- 每个应用页说明典型制品、树脂、工艺问题、选型输入和文件范围。
- 应用页只能链接到有真实内容的产品页。
- 不创建空栏目、占位页或只有关键词的页面。

### P1-C02 知识文章

- [ ] What Is Masterbatch?
- [ ] How to Choose the Right Masterbatch
- [ ] TDS vs SDS vs COA
- [ ] Why Technical Documents Need Grade Review
- [ ] Common Masterbatch Quality Problems

### P1-C03 内容集群与内链

- [ ] 建立 Application → Product Category → Product Detail → RFQ 路径。
- [ ] 建立 Blog → Product Category → RFQ 路径。
- [ ] 建立 FAQ → Technical Documents 路径。
- [ ] 检查低入链页面并补充合理入口。
- [ ] 避免机械式全站互链。
- [ ] 根据 Search Console 查询补充后续主题。

### P1-C04 后续内容扩展

- [ ] 客户案例。
- [ ] 经授权的客户评价。
- [ ] 经授权的生产、检测、包装和出口流程内容。
- [ ] 国家市场页面。
- [ ] 独立术语库。

当前限制：

- 客户案例和国家市场页必须有可公开证据。
- 不发布未经授权的品牌、客户或个人信息。

## P1：产品资料与业务证据

### P1-E01 其他产品线

- [ ] 补齐填充母粒技术文件。
- [ ] 补齐 PPA。
- [ ] 补齐开口爽滑母粒。
- [ ] 补齐抗老化母粒。
- [ ] 明确哪些产品可以公开宣传、报价或进入产品目录。

### P1-E02 商业条件

- [ ] 确认 MOQ 政策。
- [ ] 确认包装规格。
- [ ] 确认交期政策。
- [ ] 确认付款方式。
- [ ] 确认 OEM 政策。
- [ ] 确认样品政策。
- [ ] 确认不同市场的文件交付方式。

### P1-E03 知识库待确认事项

知识库仍有 8 项待确认：

- [ ] OPEN-001：ISO 472 标准词条和修订状态。
- [ ] OPEN-002：母粒定义边界。
- [ ] OPEN-003：MFI/MVR、色差和过滤测试条件。
- [ ] OPEN-004：黑点、分散、堵网等异常根因。
- [ ] OPEN-005：树脂与加工方式的具体适配。
- [ ] OPEN-006：目标市场和最终用途的法规适用性。
- [ ] OPEN-007：客户角色与采购能力判断。
- [ ] OPEN-008：样品、报价、MOQ、交期、包装和付款条件。

这些事项不阻塞当前页面运行，但会影响后续技术文章和具体产品声明。

## P1：运行监控与安全

- [ ] 增加首页可用性监控。
- [ ] 增加 `/wp-admin/` 可用性监控。
- [ ] 增加 `sitemap_index.xml` 可用性监控。
- [ ] 增加 RFQ 和 Documents 提交成功率监控。
- [ ] 增加邮件投递失败告警。
- [ ] 监控 Nginx 和 PHP-FPM 错误日志。
- [ ] 监控 MariaDB 状态。
- [ ] 监控磁盘。
- [ ] 监控内存和 Swap。
- [ ] 监控 HTTP 5xx 和 404。
- [ ] 配置 Search Console 数据异常提醒。
- [ ] 配置 GA4 Key Event 异常提醒。

## P1：WordPress 更新流程

- [ ] 保持 WordPress 自动更新关闭。
- [ ] 每月检查核心、主题和插件更新。
- [ ] 更新前创建数据库和文件备份。
- [ ] 先在测试环境验证更新。
- [ ] 更新后运行完整 Playwright。
- [ ] 更新后检查首页、产品页、表单、SEO 和邮件。
- [ ] 保留上一版 release 用于回滚。

当前状态：

- WordPress 已是最新版本。
- Rank Math、WP Mail SMTP 和当前 MU Plugin 均无待更新项。

## P2：文档和发布整理

- [x] 更新当前文档中的生产域名与索引状态。
- [ ] 更新部署计划中过期的主题版本。
- [ ] 清理服务器旧 release，只保留当前版和上一版。
- [ ] 上线稳定 7 天后再决定是否关闭旧测试站。
- [ ] 记录最终上线日期。
- [ ] 记录 Search Console 验证日期。
- [ ] 记录 GA4 启用日期。
- [ ] 记录 SMTP 测试日期。
- [ ] 记录首次恢复演练日期。

## 外部输入清单

以下信息必须由业务方提供，不能写入 Git：

- [ ] SMTP 服务商。
- [ ] SMTP host。
- [ ] SMTP port。
- [ ] SMTP encryption。
- [ ] SMTP username。
- [ ] SMTP password。
- [ ] 发件邮箱。
- [ ] RFQ 接收邮箱。
- [ ] Documents 接收邮箱。
- [ ] GA4 Measurement ID。
- [ ] GA4 API Secret。
- [ ] 有 Search Console 权限的 Google 账号。
- [ ] 最终域名和 canonical 确认。
- [ ] Privacy Policy 业务和法务确认。
- [ ] 备份异地存储目标。

## 推荐执行顺序

1. 配置 SMTP 并处理现有失败询盘。
2. 建立每日自动备份和恢复演练。
3. 完成 Search Console OAuth 和属性验证。
4. 配置 GA4 和 Key Events。
5. 完成 Privacy Policy、法务和 Cookie 确认。
6. 在 Search Console 验证新域名并提交 Sitemap。
7. 监控 24 小时表单、邮件、日志和索引状态。
8. 开发四个应用页。
9. 继续补充 Black 和 Desiccant 产品详情及知识文章、内链。

## 上线验收标准

- [ ] `http://gemasterbatch.com` 跳转到 `https://www.gemasterbatch.com/`。
- [ ] `https://www.gemasterbatch.com/` 返回 200。
- [ ] 23 个公开页面和文章全部返回预期状态。
- [ ] 每个页面只有一个 H1。
- [ ] 每个应收录页面有 self-canonical。
- [ ] Sitemap 不包含旧域名和 noindex 页面。
- [ ] RFQ 和 Documents 都能保存记录并成功发送邮件。
- [ ] 邮件失败会告警。
- [ ] GA4 成功事件和错误事件正常。
- [ ] Search Console 无 Sitemap、抓取或结构化数据阻塞错误。
- [ ] 桌面和手机无横向溢出。
- [ ] 所有内容图片正常加载。
- [ ] 自动备份和恢复流程已验证。
- [ ] 旧 release 可用于回滚。

## 最近已完成

- [x] 首页和产品分类视觉升级。
- [x] Black、Desiccant 产品分类闭环。
- [x] BK020、BK025、BK030、BK035、BK040 产品页。
- [x] PT-300、PT-450P 和 DM2476G 产品页。
- [x] About、FAQ、Contact、Resources、Documents 和 Privacy Policy。
- [x] Blog 和 4 篇已发布文章。
- [x] Rank Math Schema 页面角色修复。
- [x] H1、Title、Description 和图片 WebP 优化。
- [x] 25 个公开 URL 桌面与手机 SEO 审计。
- [x] 数据库回收站、自动草稿和旧 revision 清理。
- [x] 下架 White/Color 产品线、删除页面、清理公开文案并设置旧 URL 301。
- [x] 清理前完整数据库备份。
- [x] HTTPS、UFW、Fail2ban 和证书自动续期。

## 注意

- 不把 SMTP 密码、GA4 API Secret、Google OAuth Token 或其他凭据写入本文件。
- 不在自动备份和恢复流程完成前执行 WordPress 核心、主题或插件更新。
- 不在 SMTP 和最终业务确认完成前开放搜索引擎索引。
