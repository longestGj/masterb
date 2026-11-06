# GA4 转化统计接入待办

- 状态：代码已接入，等待 GA4 配置
- 创建日期：2026-11-05
- 站点：`https://gzh.hzscf.site/`
- 当前阻塞：需要业务方创建或提供 GA4 Measurement ID；邮件投递失败事件
  还需要 GA4 Measurement Protocol API Secret。

## 1. 配置 Measurement ID

Measurement ID 不是密钥，但仍应由业务方从 GA4 后台取得。推荐通过
WordPress option 保存：

```bash
wpcli option update mb_ga4_measurement_id G-XXXXXXXXXX
```

也可以用环境变量覆盖：

```text
MASTERBATCH_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

未配置有效 `G-` ID 时，主题不会加载 Google Analytics 脚本。

## 2. 配置 Measurement Protocol API Secret

API Secret 只能通过服务器环境变量提供，不能写入数据库、Markdown、代码或
Git 提交：

```text
MASTERBATCH_GA4_API_SECRET=<secret>
```

该 Secret 仅用于服务端发送“邮件投递失败”事件。

## 3. 已接入事件

客户端事件：

| 事件 | 触发条件 | 主要参数 |
|---|---|---|
| `rfq_submit_success` | RFQ 成功保存 | `product_interest`、`source_page`、`page_location`、`entry_referrer` |
| `documents_submit_success` | Documents 请求成功保存 | `product_interest`、`source_page`、`page_location`、`entry_referrer` |
| `rfq_submit_error` | RFQ 校验或保存失败 | `product_interest`、`source_page`、`page_location` |
| `documents_submit_error` | Documents 校验或保存失败 | `product_interest`、`source_page`、`page_location` |

服务端 Measurement Protocol 事件：

| 事件 | 触发条件 | 主要参数 |
|---|---|---|
| `rfq_email_delivery_failed` | RFQ 已保存但邮件失败 | `product_interest`、`source_page`、`inquiry_id` |
| `documents_email_delivery_failed` | Documents 已保存但邮件失败 | `product_interest`、`source_page`、`inquiry_id` |

事件不发送姓名、公司、邮箱、消息正文或其他表单内容。

## 4. GA4 后台设置

1. 在 GA4 中创建 Web Data Stream，取得 Measurement ID。
2. 将以下事件标记为 Key Event：
   - `rfq_submit_success`
   - `documents_submit_success`
3. 在 Realtime 和 DebugView 中确认事件能正常到达。
4. 创建来源、产品兴趣、表单错误和邮件投递失败的探索报表。

## 5. 完成标准

- [ ] GA4 Measurement ID 已配置。
- [ ] 页面源码中只加载一个 GA4 配置。
- [ ] RFQ 成功事件可到达 GA4。
- [ ] Documents 成功事件可到达 GA4。
- [ ] 表单错误事件可到达 GA4。
- [ ] 产品兴趣和来源页面参数可见。
- [ ] API Secret 配置后，邮件失败事件可到达 GA4。
- [ ] 隐私政策已由业务方和法务确认。
