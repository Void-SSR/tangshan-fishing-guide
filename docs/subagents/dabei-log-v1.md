# 大北工作日志 v1

## 作用

记录大北的持续工作记忆。线程失效时，新接任者先看这里，再继续工作。

## 当前角色拥有者

- 当前优先拥有者：`Bernoulli`
- 当前 Agent ID：`019d8ed1-3e0a-74e2-aaa7-30d16d542c1e`
- 上一任：`Nietzsche`

## 当前主责任文件

- [spot-enrichment.json](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/data/processed/spot-enrichment.json:1)
- [verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)

## 日志格式

- 日期
- 本轮目标
- 已完成
- 已吸收结论
- 未解风险 / 下一步

## 已有记录

### 2026-04-15 第四轮

- 本轮目标：判断当前“打不开网站”问题里哪些是环境限制，哪些是项目问题
- 已完成：
  - 确认本地端口绑定是当前环境里的核心客观限制
  - 确认 `file://` 不能替代正式 HTTP 预览链路
  - 确认浏览器自动化当前受端口链路限制，不是测试脚本缺失
- 已吸收结论：
  - 现阶段可继续推进的部分是静态 smoke、构建产物审查、图片与核验数据补强
  - 现阶段无法在该环境里稳定推进的部分是本地服务预览、浏览器 E2E、整页截图预览
- 未解风险 / 下一步：
  - 环境允许时恢复真实浏览器链路
  - 继续区分“环境阻塞”和“产品阻塞”，避免误判

### 2026-04-14 第一轮

- 本轮目标：建立核验机制和图片策略
- 已完成：
  - 建立强事实 / 弱事实 / 经验事实的分层思路
  - 建立图片类型与风险分层策略
- 已吸收结论：
  - 普通限制不删点，只写第三层级
  - 只有生命危险才前置到第二层级
- 未解风险 / 下一步：
  - 高优先级点位还需逐点补字段

### 2026-04-14 第二轮

- 本轮目标：给高优先级点位建立补强字段
- 已完成：
  - 定义 `imageSourceTitle`、`imagePrecision`、`verificationRefs`、`replacementPriority` 等字段
  - 补齐高优先级 8 点的最小补强结构
- 已吸收结论：
  - 港区和防波堤类点位不能为了追真图而贴错图
- 未解风险 / 下一步：
  - `P0` 点位仍需逐步换成更强的公开真图

### 2026-04-14 第三轮

- 本轮目标：锁定 `P0` 真图替换优先级
- 已完成：
  - 判断 `boat-cfd-longdao-ranch`、`shore-cfd-18plus-west-breakwater` 最值得继续追真图
  - 判断 `shore-cfd-a-port-east-breakwater`、`shore-cfd-sixplus-lighthouse` 继续保留标注图策略更稳
- 已吸收结论：
  - 真图替换要优先补收益最高、前台识别价值最高的点
- 未解风险 / 下一步：
  - 龙岛外海和 18+ 西防波堤还缺更强的公开图片来源

### 2026-04-15 第四轮

- 本轮目标：开始把真图替换真正接进站
- 已完成：
  - `shore-cfd-xincheng-left-bank` 列表图已升级为官方远程公开环境图
  - 同步更新了核验计划文档和站内数据
- 已吸收结论：
  - 可以按“先落 1 个高价值真图，再继续追其余真图”的方式推进，不必等全套素材齐
- 未解风险 / 下一步：
  - 继续优先追 `boat-cfd-longdao-ranch`
  - 继续追 `shore-cfd-18plus-west-breakwater` 的更贴近防波堤结构的公开图
