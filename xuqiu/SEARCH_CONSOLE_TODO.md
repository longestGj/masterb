# Search Console 接入待办

- 状态：待办
- 创建日期：2026-11-05
- 负责人：业务方 / Google 账号持有人
- 站点：`https://gzh.hzscf.site/`
- 当前阻塞：Rank Math 已安装，但 Google Search Console 属性尚未由业务方
  使用 Google 账号授权和验证；WP-CLI 无法代替 Google OAuth。

## 后台入口

1. 登录 WordPress 后台。
2. 打开：

   https://gzh.hzscf.site/wp-admin/admin.php?page=rank-math-options-general&view=analytics

3. 在 Rank Math Analytics 中点击连接 Google 账号。
4. 在 Google 授权页面选择有权管理 Search Console 的账号并批准访问。
5. 选择或添加 `gzh.hzscf.site` 对应的 Search Console 属性。

## 提交 Sitemap

属性验证完成后，在 Search Console 中提交：

```text
https://gzh.hzscf.site/sitemap_index.xml
```

提交后确认状态不是错误，并等待 Search Console 抓取页面 Sitemap。

## 完成标准

- [ ] Google 账号已在 Rank Math Analytics 中连接成功。
- [ ] `gzh.hzscf.site` 属性已在 Search Console 中验证。
- [ ] `sitemap_index.xml` 已提交。
- [ ] Sitemap 状态为成功，且能列出页面 Sitemap。
- [ ] 首页和主要内容页开始出现抓取或索引数据。

## 完成后记录

完成时在本文件补充：

- 完成日期；
- Search Console 属性类型；
- 验证方式；
- Sitemap 状态；
- 是否存在抓取、覆盖范围或结构化数据错误。

不要把 Google 密码、OAuth Token、验证文件私钥或其他凭据写入本仓库。
