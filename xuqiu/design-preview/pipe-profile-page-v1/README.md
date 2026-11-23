# Pipe and Profile 应用页 — 静态预览 v1

- 状态：静态设计预览，尚未进入 WordPress
- 日期：2026-11-23
- 页面类型：产品应用 LandFAQ
- 预计变更级别：A + B + C + D；发布追加 E

## 页面 Brief

| 项目 | 内容 |
|---|---|
| 页面名称 | Black Masterbatch for Pipe and Profile Extrusion |
| URL | `/products/black-masterbatch/pipe-profile/` |
| 父级 | Black Masterbatch |
| 模板 | `page-pipe-profile`（待建） |
| 主关键词 | `black masterbatch for pipe` |
| 次要关键词 | `black masterbatch for HDPE pipe`、`black masterbatch for profile extrusion`、`carbon black masterbatch for pipe`、`black masterbatch for conduit` |
| 搜索意图 | 商业调查型：找管材/型材用黑色母粒、比较牌号、询盘 |
| 目标读者 | HDPE 管材厂、导管/护套厂、型材厂、回收 PE 管厂、采购和经销商 |
| 页面任务 | 用管材/型材场景和 BK 牌号把买家带到 RFQ / 文件申请 |
| 主 CTA | Request a pipe masterbatch quote |
| 次 CTA | Compare BK grades |

## 页面结构

1. Hero：H1、范围、RFQ、母粒图
2. 四个事实：5 个牌号、20% to 40%、2% to 5% 起始添加、25 kg 包装
3. 应用：HDPE pipe、conduit/cable protection、profile extrusion、recycled PE pipe
4. BK020–BK040 牌号表：炭黑、载体、CaCO3、管材/型材定位
5. 检查项：分散、炭黑与 UV、载体/MFI、填料/密度、表面/尺寸、试机
6. 审核流程：分享信息 → 牌号审核 → 样品/试机 → 文件与报价
7. FAQ：6 个买家问题
8. 最终 CTA
9. 相关阅读：Black 牌号、Film & Packaging、Let-Down Ratio

## 证据与边界

- 牌号数据：BK020–BK040 当前 TDS 示例值
- 添加比例：当前 TDS 示例的 2% to 5% 起始建议，不是固定用量
- 包装：25 kg，按当前 TDS，页面用 `*` 标注
- 不写：价格、MOQ、交期、食品接触、全系列合规
- 不写：WRAS/NSF/ISO 认证、压力管适用、户外寿命、保证 UV 等级
- 不写：“最佳 UV 保护”或“所有管材通用”
- 只写：炭黑含量和分散会影响 UV/耐候表现，需按管材标准、暴露条件和试机确认
- 图片：自定义矢量主图，画的是黑色 HDPE 管端、型材和母粒；无文字、无外部版权素材，已转 1600×1200 WebP

## 设计说明

- 沿用 Film & Packaging 页面的 `bm-*` 设计节奏和 `pp-*` 页面样式
- 桌面双栏 Hero；手机单栏
- 手机牌号表改为卡片
- 未新增全局 token

## 已确认

1. URL 使用 `/products/black-masterbatch/pipe-profile/`；
2. Hero 图使用本次生成的自定义矢量主图；
3. 保留 “Recycled PE pipe” 卡片；
4. 保留 WRAS/NSF FAQ；
5. 移动端牌号表使用卡片。

## 待确认

- 这版静态预览是否批准进入生产模板。
- 当前主图是技术矢量插画，不是管材实拍；如果后续有真实管材/型材生产图，可替换主图而不改页面结构。
