# Film & Packaging 页面 — 静态预览 v1

- 状态：静态设计预览，尚未进入 WordPress
- 日期：2026-11-18
- 预览：`index.html`（桌面 1440 / 手机 390 截图见同目录）
- 页面类型：产品应用 LandFAQ
- 变更级别（预计）：A + C + D；发布追加 E

## 页面 Brief

| 项目 | 内容 |
|---|---|
| 页面名称 | Black Masterbatch for Film and Packaging |
| URL | `/products/black-masterbatch/film-packaging/` |
| 父级 | Black Masterbatch（Page 31） |
| 模板 | `page-film-packaging`（新建） |
| 主关键词 | `black masterbatch for film` |
| 次要关键词 | `black masterbatch for film blowing`、`black masterbatch for trash bags`、`masterbatch for packaging film`、`black masterbatch for bags` |
| 搜索意图 | 商业调查型：找薄膜/包装用黑色母粒、比较牌号、询盘 |
| 目标读者 | 吹膜厂、制袋厂、包装厂、采购和经销商 |
| 页面任务 | 用薄膜场景和 BK 牌号把买家带到 RFQ / 文件申请 |
| SEO Title | Black Masterbatch for Film & Packaging \| GE CHEMICAL（52） |
| Meta Description | Black masterbatch for blown film, bags and packaging. Compare BK020 to BK040 by carbon black, filler, dispersion and let-down before a trial.（141） |
| H1 | Black Masterbatch for Film and Packaging |
| Schema | WebPage + BreadcrumbList + FAQPage |
| 主 CTA | Request a film masterbatch quote |
| 次 CTA | Compare BK grades |

## 关键词归属

| 关键词 | 归属 |
|---|---|
| `masterbatch for blown film` | 文章 |
| `black masterbatch for film` | 页面 |
| `black masterbatch for film blowing` | 页面 |
| `black masterbatch for trash bags` | 页面 |
| `black masterbatch for bags` | 页面 |
| `masterbatch for packaging film` | 页面 |

文章使用 `blown film` 语汇，页面使用 `film and packaging / bags / packaging film`；两边不把对方的主关键词放进 Title 或 H1。

## 与吹膜文章的分工

| | 文章 | 本页面 |
|---|---|---|
| URL | `/blog/masterbatch-for-blown-film/` | `/products/black-masterbatch/film-packaging/` |
| 意图 | 信息型：怎么选、怎么试 | 商业型：有哪些牌号、怎么询盘 |
| 主关键词 | `masterbatch for blown film` | `black masterbatch for film` |
| 内容 | 选型方法、试机、TDS 阅读 | 应用场景、牌号矩阵、RFQ |
| 互链 | 文章 → 本页面 | 本页面 → 文章 |

两页并存，不合并，不互相 canonical。

## 页面结构

1. Hero：H1、薄膜范围、RFQ / 牌号 CTA、包装图
2. 四个事实：5 个牌号、20% to 40%、2% to 5% 起始添加、25 kg 包装
3. 应用：购物袋/手提袋、垃圾袋、包装膜、共挤膜
4. BK020–BK040 牌号表：炭黑、载体、CaCO3、薄膜定位
5. 薄膜检查：分散、黑度/遮盖、膜结构、添加比例、过滤/压力、试机
6. 审核流程：分享膜信息 → 牌号审核 → 样品/试机 → 文件与报价
7. FAQ：6 个买家问题
8. 最终 CTA
9. 相关阅读：吹膜文章、Black 分类、Technical Documents

## 证据与边界

- 牌号数据：BK020–BK040 当前 TDS 示例值（炭黑 20%–40%、载体、CaCO3 5.8%–47.8%）
- 添加比例：当前 TDS 示例的 2% to 5% 起始建议，不是固定用量
- 包装：25 kg，按当前 TDS；页面已用 `*` 标注
- 不写：价格、MOQ、交期、付款、食品接触、全系列合规
- 共挤膜只写“层位置和载体兼容性需确认”，不声称具体牌号已验证
- 图片：当前用 `img/product/ge-chemical-masterbatch-product-01.jpg` 黑色母粒特写，无水印；正式页需压缩并按 Hero 比例裁切

## 设计说明

- 沿用 `design-tokens.css`、Black guide 的 `bm-*` 节奏和 Header/Footer
- 深绿 Hero + 白/软灰内容区 + 青柠 CTA
- 桌面双栏 Hero；手机单栏
- 手机端牌号表改为卡片，标签由 `data-label` 提供
- 未新增全局 token

## 文件

- `index.html`：静态预览
- `film-packaging.css`：页面专属样式
- `desktop.png` / `mobile.png`：1440 / 390 截图

## 进入生产前需要确认

1. Hero 图已换成黑色母粒特写，是否保留；
2. 是否保留“25 kg”和“2% to 5%”两个事实条；
3. 是否接受页面只在 Black 分类页和吹膜文章中进入，不加入主导航；
4. 移动端牌号表用卡片，还是保留横向滚动；
5. 是否把 FAQ 作为页面内的 6 个问题，并输出 FAQPage Schema。
