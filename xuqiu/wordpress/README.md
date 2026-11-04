# WordPress 内容导入器

- 状态：测试版
- 日期：2026-11-03
- 适用范围：staging 中导入 `black-masterbatch.md` 的第一份草稿

## 文件

```text
wordpress/
├── bin/
│   └── wpcli
├── themes/
│   └── mtm-b2b-masterbatch/
├── mu-plugins/
│   └── mb-content-importer.php
├── content/
│   ├── pages/
│   │   └── home.md
│   └── guides/
│       └── black-masterbatch.md
└── tests/
    ├── test-importer.php
    └── homepage.spec.js
```

## 本地检查

```bash
php -l xuqiu/wordpress/mu-plugins/mb-content-importer.php
php xuqiu/wordpress/tests/test-importer.php
cd xuqiu/wordpress
npm install
npm run test:importer-syntax
npx playwright test
```

首页测试使用项目本地 Playwright Chromium，直接渲染子主题的
`page-home.html`、导入包正文、Header 和 Footer。测试检查 8 个区块、唯一 H1、
产品与转化入口、公开声明边界，以及桌面和移动端横向溢出。

## 安装持久命令

把包装脚本上传到服务器的 `/root/wpdev/wpcli`，然后安装到 `/usr/local/bin/wpcli`：

```bash
install -m 0755 /root/wpdev/wpcli /usr/local/bin/wpcli
which wpcli
wpcli --info
wpcli core version
wpcli plugin list --fields=name,status,version
```

安装后，新终端无需重新定义 Bash 函数。默认配置：

| 环境变量 | 默认值 | 用途 |
| --- | --- | --- |
| `MASTERBATCH_WP_CONTAINER` | `wpdev-wp-1` | WordPress 容器名 |
| `MASTERBATCH_IMPORT_DIR` | `/root/wpdev/import` | 服务器导入目录 |
| `MASTERBATCH_WP_CLI_IMAGE` | `wordpress:cli` | 一次性 WP-CLI 镜像 |

容器或目录变化时，可以临时覆盖：

```bash
MASTERBATCH_WP_CONTAINER=another-wp \
MASTERBATCH_IMPORT_DIR=/srv/wp/import \
wpcli plugin list
```

## 安装 MU Plugin

先把 `mb-content-importer.php` 上传到服务器 `/root/wpdev/`。导入器必须放到 WordPress 持久化的 `wp-content/mu-plugins/`。

```bash
docker exec -u 0 wpdev-wp-1 \
  mkdir -p /var/www/html/wp-content/mu-plugins

docker cp /root/wpdev/mb-content-importer.php \
  wpdev-wp-1:/var/www/html/wp-content/mu-plugins/mb-content-importer.php

docker exec -u 0 wpdev-wp-1 \
  chown 33:33 /var/www/html/wp-content/mu-plugins/mb-content-importer.php

docker exec wpdev-wp-1 \
  php -l /var/www/html/wp-content/mu-plugins/mb-content-importer.php

wpcli help mb-content
```

## Dry Run

把内容包上传到 `/root/wpdev/import/black-masterbatch.md` 或
`/root/wpdev/import/home.md`，再执行：

```bash
wpcli mb-content import /import/black-masterbatch.md --dry-run
wpcli mb-content import /import/home.md --dry-run
```

Dry run 不写入页面，只检查：

- Front Matter 和内容 ID；
- 草稿与 noindex 状态；
- SEO 标题和描述长度；
- 正文 H1、主体名称和禁用文件交付措辞；
- Markdown 到 WordPress 区块的转换；
- 是否存在重复内容 ID；
- 父页面是否存在。

## 首页导入

首页使用 `gutenberg-blocks-v1` 正文格式。导入器会校验区块名称、区块嵌套、
H1 数量、危险 HTML、链接协议、公开主体和禁用文件交付措辞。

```bash
wpcli mb-content import /import/home.md
```

导入结果为 Draft Page：

- Title：`Masterbatch Inquiries`
- Slug：`home`
- Template：`page-home`
- Body format：`gutenberg-blocks-v1`
- Noindex：开启

导入后先在 WordPress Preview 中检查完整的 8 个区块。**导入器不会自动把
草稿设为静态首页**，避免未审核草稿导致站点首页不可访问。完成公司事实、
表单、隐私政策和 CTA 审核并发布页面后，再在“设置 → 阅读”中把该页面设为
静态首页。

检查页面和元数据：

```bash
wpcli post list \
  --post_type=page \
  --post_status=draft \
  --fields=ID,post_title,post_name,post_status

wpcli post meta get <PAGE_ID> _mb_body_format
wpcli post meta get <PAGE_ID> _mb_front_page
wpcli post meta get <PAGE_ID> _wp_page_template
```

需要重新同步首页草稿时：

```bash
wpcli mb-content import /import/home.md --update
```

## 首次导入

如果 `products` 父页面尚未创建，可以在明确确认后使用：

```bash
wpcli mb-content import /import/black-masterbatch.md --create-parent
```

也可以先创建父页面并传入页面 ID：

```bash
wpcli mb-content import /import/black-masterbatch.md --parent-id=123
```

## 更新草稿

已导入的草稿需要重新同步时：

```bash
wpcli mb-content import /import/black-masterbatch.md --update
```

导入器拒绝覆盖已发布页面。内容哈希未变化时也不会重复写入。

## 导入后检查

```bash
wpcli post list \
  --post_type=page \
  --post_status=draft \
  --fields=ID,post_title,post_name,post_parent,post_status

wpcli post meta list <PAGE_ID> --format=table
```

需要在 WordPress 后台确认：

1. 页面为 Draft。
2. 标题、slug 和父页面正确。
3. 正文章节、表格、FAQ 和 CTA 文本正确。
4. `page-product-guide` 模板存在；不存在时先按默认模板预览。
5. `_mb_seo_title`、`_mb_seo_description`、`_mb_form_key` 等字段已保存。
6. CTA 目标页面和表单尚未创建时，不发布页面。

## 当前限制

- 只支持 Page。
- 只允许草稿和 noindex。
- 普通指南支持受限 Markdown；首页支持受控 Gutenberg 区块格式。
- 支持本项目使用的 YAML 子集、H2/H3、段落、列表、表格、粗体和站内/HTTPS 链接。
- 不自动安装 SEO 或表单插件。
- 不自动发布页面。
- 不自动修改 WordPress 的静态首页设置。
- 不处理技术文件上传或公开下载。
