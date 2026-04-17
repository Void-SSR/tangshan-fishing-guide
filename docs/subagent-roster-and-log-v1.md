# 小弟协作档案 v1

## 目标

把三个小弟的角色设定、工作边界、已有成果和后续协作方式固定下来。

从这一版开始：

- 不把小弟当一次性线程使用
- 优先保留角色设定与工作记录
- 后续修改继续沿用同一角色分工
- 即使线程被外部打断，也按同一角色重新接续，不重置定位

## 当前生效协议

- 复用与交接协议：
  - [subagent-reuse-and-handoff-protocol-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/subagent-reuse-and-handoff-protocol-v1.md:1)
- 角色职责与日志：
  - [dabei-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dabei-role-v1.md:1)
  - [dabei-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dabei-log-v1.md:1)
  - [dadong-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-role-v1.md:1)
  - [dadong-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-log-v1.md:1)
  - [danan-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/danan-role-v1.md:1)
  - [danan-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/danan-log-v1.md:1)
- 工作流闭环机制：
  - [workflow-closed-loop-optimization-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/workflow/workflow-closed-loop-optimization-v1.md:1)
  - [workflow-correction-learning-ledger-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/workflow/workflow-correction-learning-ledger-v1.md:1)
  - [workflow-error-prevention-ledger-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/workflow/workflow-error-prevention-ledger-v1.md:1)
  - [workflow-evolution-backlog-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/workflow/workflow-evolution-backlog-v1.md:1)

## 角色总表

### 大北

- 角色：真实性核验与图片方案负责人
- 当前优先拥有者：`Bernoulli`
- 主职责：
  - 核验钓点真实性与时效性
  - 核验海洋牧场、港区、工业区、动态管控相关信息
  - 搜索图片、环境图、地图标注图、博主标注图
  - 给出“可直接上线 / 待复核 / 仅作风险提示”的判断
- 固定工作原则：
  - 普通封禁、动态管控、作业边界不删点，只写进第三层级风险与注意事项
  - 只有生命危险型威胁才建议在第二层级前置危险提示
- 主要成果文件：
  - [verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)
  - [dabei-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dabei-role-v1.md:1)
  - [dabei-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dabei-log-v1.md:1)

#### 大北可交接职责清单

- 优先处理 `assetPriority = high` 的钓点，先盯 P0 真图替换，再处理普通点位。
- 每次补图前先核 `spot-enrichment.json`、`verification-and-assets-plan-v1.md`、`site/scripts/build.mjs`，确保数据、文案、前台显示一致。
- 只给每个钓点选一种当前最稳的图片策略：真图、环境图、地图标注图、结构占位图，不混乱叠加。
- 图片来源优先顺序固定为：官方公开图、官方报道图、公开环境图、地图标注图、博主标注图。
- 所有新图片或图片方案都要补 `imageSourceTitle`、`imageSourceUrl`、`imagePrecision`、`verificationCheckedAt`，不能只换链接不补来源。
- 风险分层必须守住：普通管控、动态进入性问题只进第三层级；只有生命危险型威胁才允许进入第二层级 `dangerFlags`。
- 核验结论要落成数据，不只停留在文字讨论；至少同步 `verificationStatus`、`verificationNotes`、`replacementPriority`、`imageReplaceTodo`。
- 时效性复核优先看港区、防波堤、工业区、海洋牧场相关点位，默认按 `verificationWindowDays` 到期前重新检查。
- 遇到无法精确对应的港区或防波堤点位，优先保留“地图标注图 + 环境图”组合，不要硬贴疑似现场图。
- 每轮交接必须给出 3 件事：最优先补图点位、暂时保留标注图的点位、前台应显示的图片精度文案。

### 大东

- 角色：UI 与前端设计负责人
- 当前优先拥有者：`Dirac`
- 主职责：
  - 负责首页、第二层级、第三层级的视觉和前端体验
  - 确保美观、信息清晰、用户体验优秀
  - 保证 iPhone 竖屏优先的 App 化感觉
- 固定工作原则：
  - 首页只做模式选择
  - 第二层级强调浏览效率
  - 第三层级强调单点沉浸与清晰
- 主要成果文件：
  - [ui-direction-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/ui-direction-v1.md:1)
  - [dadong-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-role-v1.md:1)
  - [dadong-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-log-v1.md:1)

### 大南

- 角色：QA、Bug 与 UX 验收负责人
- 当前优先拥有者：`Feynman`
- 当前状态说明：
  - 当前会话环境里该拥有者未直接可用
  - 现阶段按“可接任则接任、不可接任则主线程代行并写回日志”的协议执行
- 主职责：
  - 检查三层结构是否被破坏
  - 提前识别导航、筛选、状态保持、安全区、风险表达问题
  - 形成验收清单
- 固定工作原则：
  - 一级进二级后不再出现一级入口
  - 二级进三级后不再保留二级大列表 UI
  - 第三级必须是独立单钓点详情页
- 主要成果文件：
  - [qa-and-ux-checklist-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/qa-and-ux-checklist-v1.md:1)
  - [danan-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/danan-role-v1.md:1)
  - [danan-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/danan-log-v1.md:1)

#### 大南可交接职责清单

- 守住三层结构红线：首页只保留海岸钓和出海钓，二级不再出现一级大入口，三级不再残留二级列表和筛选条。
- 把 `site/tests/smoke-static.mjs` 作为首要静态验收入口，优先补会影响结构、排序、风险提示、图片状态和详情页完整性的断言。
- 把 `site/tests/smoke.spec.mjs` 作为轻量运行时回归入口，优先盯列表进入详情、返回列表、清空筛选、详情页关键状态区可见性。
- 检查第二层级危险提示是否正确，只有生命危险型威胁可以前置，普通管控、停车、作业区、进入限制一律留在三级风险区。
- 检查列表默认排序是否始终按推荐强度输出，清空筛选后必须回到原始推荐顺序，不能被图片、状态或新字段打乱。
- 检查相关推荐是否重复、是否串模式、是否指向自己，保证同区域、同模式、同目标鱼推荐对用户有真实参考价值。
- 检查真实图片替换后的状态一致性，图片 `src`、图片状态文案、核验说明、占位/远程标签必须互相对应，不能前后打架。
- 检查详情页信息密度，首屏必须先让用户看懂点位值不值得去，再看玩法、风险、来源，避免变成数据库堆叠页。
- 检查列表与详情的状态恢复，尤其是搜索词、筛选、滚动位置、跨模式隔离，防止用户返回后丢上下文。
- 每轮交接前必须回传 3 类结果：当前 P0 风险、建议新增的 smoke 保护、已确认通过的验收项，不只报问题，也要报边界和结论。

## 已有成果记录

### 大东成果

- 状态：已落地
- 成果摘要：
  - 定义了三层页面各自的视觉目标
  - 补充了 iPhone 竖屏尺寸、安全区、按钮、卡片比例、危险提示、排名标签、筛选器、底部操作区
  - 明确 8 条设计红线，防止产品做成资讯站或普通网页
- 关联文件：
  - [ui-direction-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/ui-direction-v1.md:1)

### 大南成果

- 状态：已落地
- 成果摘要：
  - 输出三层结构验收清单
  - 明确第二层级只允许生命危险型威胁前置
  - 总结导航、筛选、状态恢复、安全区和风险表达的高危 Bug
- 关联文件：
  - [qa-and-ux-checklist-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/qa-and-ux-checklist-v1.md:1)

### 大北成果

- 状态：主成果已由主线先行落地，后续继续补强
- 当前已落地文件：
  - [verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)
- 当前成果摘要：
  - 已建立核验机制
  - 已建立图片分级策略
  - 已对海岸钓前 5 和出海钓前 3 做第一轮核验草稿
  - 已初步判断需要二级前置生命危险提示的点位

## 后续协作规则

### 1. 修改任何结构前

先看：

- [site-ux-architecture-v2.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/site-ux-architecture-v2.md:1)
- [script-thoughts-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/script-thoughts-v1.md:1)

### 2. 修改视觉前

先看：

- [ui-direction-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/ui-direction-v1.md:1)

### 3. 修改风险表达前

先看：

- [verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)
- [qa-and-ux-checklist-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/qa-and-ux-checklist-v1.md:1)

### 4. 修改页面跳转前

先看：

- [qa-and-ux-checklist-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/qa-and-ux-checklist-v1.md:1)

## 执行约定

从现在开始：

- 我默认保留这三个角色设定
- 后续再调小弟时，继续沿用“大北 / 大东 / 大南”的职责
- 如果长时间没工作，优先复用已经用过的小弟；只有在原小弟不可用时才新开接任者
- 新开接任者必须先读取该角色职责文档和工作日志，再开始工作
- 即使底层线程因为限制或中断被关闭，也不视为角色失效
- 角色日志和成果始终保留在项目文档中

## 2026-04-14 实时协同记录

### 本轮协作目标

- 进入真实实现阶段，不再停留在文档层
- 把三位小弟切换为“实时协同 + 阶段性回传”的长期工作方式
- 让大北、大东、大南的结果直接进入构建脚本、页面结构和测试流程

### 大北本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 先给出前端可直接消费的字段规范
  - 再补 17 个钓点完整字段建议表
- 关键输出：
  - 明确 `dangerFlags`、`dangerLevel`、`verificationStatus`、`imageType`、`verificationNotes` 的前端落法
  - 明确只有生命危险型威胁可出现在第二层级
  - 给出 17 个钓点逐点建议值，可直接用于构建脚本数据扩展
- 本轮已被主线吸收的内容：
  - 第二层级危险提示规则
  - 核验状态枚举
  - 图片类型与占位策略
  - 高优先级点位的核验文案

### 大东本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 把 UI 文档进一步收敛成可直接写 HTML/CSS 的结构建议
  - 统一首页、列表页、详情页的视觉主次和命名
- 关键输出：
  - 首页建议只保留 5 层结构：`home-shell / home-hero / home-mode-grid / home-mode-card / home-meta`
  - 列表页卡片的内容优先级固定为：排名、名称、危险提示、鱼种、汛期、导航、钓段、按钮
  - 详情页首屏固定为：`detail-topbar / detail-hero / detail-title-block / detail-summary-card`
  - 推荐了一组可直接落地的类名命名
- 本轮已被主线吸收的内容：
  - `app-shell`、`page-topbar`、`mode-card`、`spot-card`、`spot-rank-badge`、`spot-danger-badge`、`detail-bottom-actions` 等命名
  - 首页和详情页的主次关系
  - 危险提示放在图片层、不抢正文主标题的做法

### 大南本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 盯构建脚本最容易出错的点
  - 盯第二层级危险提示是否被数据污染
  - 盯测试策略和状态恢复
- 关键输出：
  - 列出构建脚本需要立即避免的 8 类错误
  - 给出页面生成后最值得补的 5 条自动化断言
  - 明确列表返回状态恢复的 4 组测试场景
- 本轮已被主线吸收的内容：
  - `scrollTo` 恢复行为从 `instant` 调整为更稳的 `auto`
  - 自动化验证切换为当前环境可执行的静态 smoke 方案
  - 详情页、列表页和危险标签规则都进入自动断言范围

### 主线落实结果

- 已新增并实现：
  - [site/scripts/build.mjs](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/scripts/build.mjs:1)
  - [site/src/styles/site.css](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/src/styles/site.css:1)
  - [site/tests/smoke-static.mjs](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/tests/smoke-static.mjs:1)
- 已调整：
  - [site/src/scripts/list.js](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/src/scripts/list.js:1)
  - [site/package.json](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/package.json:1)
- 当前实现状态：
  - 首页 / 海岸钓列表 / 出海钓列表 / 17 个详情页 / 排名说明 / 合规说明 / 最近更新，均已生成
  - PWA 基础资源已生成
  - 静态 smoke 已通过

### 后续继续协同的规则

- 大北继续负责：
  - 图片替换
  - 公开来源补强
  - 核验状态升级
- 大东继续负责：
  - UI 微调
  - 视觉一致性
  - 真机移动端体验优化
- 大南继续负责：
  - 回归测试
  - Bug 追踪
  - 状态恢复、危险提示和三层结构红线验收

## 2026-04-14 第二轮实时协同记录

### 本轮协作目标

- 在首版可运行基础上继续往“更像成品”推进
- 修掉相关推荐重复、来源文案内部化、Service Worker 脏路径这类质量问题
- 把下一步真实图片替换工作正式落档

### 大北本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 输出 8 个高优先级点位的真实图片替换表
  - 说明哪些点位适合直接换成公开环境图，哪些点位应继续保留地图标注图策略
- 已吸收结果：
  - 高优先级点位图片替换表已写入
    [verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)

### 大东本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 从“是否像顶级 App”角度再次审视首页、列表页和详情页
  - 给出首屏张力、列表扫读效率、详情页首屏与底部操作区的精修建议
- 已吸收结果：
  - 首页增加了工具型数据胶囊
  - 列表页把汛期摘要改成更短的“最佳窗口”
  - 详情页继续把非核心信息往下压，减少首屏噪声

## 2026-04-14 第三轮实时协同记录

### 本轮协作目标

- 把点位补强信息从构建脚本里抽出，改成独立数据文件
- 继续把站点往成品级 App 体验推进
- 增强 smoke 保护，减少后续回归

### 大北本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 明确 `spot-enrichment.json` 后续应该继续补哪些字段
  - 给出高优先级 8 点真图替换先后顺序
- 已吸收结果：
  - 新增独立数据文件：
    [spot-enrichment.json](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/data/processed/spot-enrichment.json:1)
  - 已把 `assetPriority` 接入构建器和详情页
  - 已把真图接入目录固定为：
    [site/public/images/spots/real/.gitkeep](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/public/images/spots/real/.gitkeep:1)

### 大东本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 继续提高 iPhone 竖屏下的成品感
  - 强化首页海报感、压缩列表工具区、收紧详情页首屏
- 已吸收结果：
  - 首页 `eyebrow` 改成更产品化短句
  - `mode-card` 高度上调
  - `home-meta` 与 `home-footer-note` 权重压低
  - `list-toolbar`、搜索框、筛选组进一步压缩
  - `detail-summary-card` 默认单列，更适配 390pt 宽度
  - `detail-shell` 追加更大底部留白

### 大南本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 补厚 smoke 断言
  - 盯这轮新增的图片状态、核验状态和清空筛选
- 已吸收结果：
  - `smoke-static.mjs` 已新增：
    - 首页模式卡数量断言
    - 清空筛选断言
    - 危险提示数量断言
    - 默认排序断言
    - `undefined` 泄漏断言
    - 核验与图片说明入口断言
  - `smoke.spec.mjs` 已新增：
    - 详情页主图状态说明断言
    - 清空筛选交互断言

### 大南本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 继续盯当前实现的 6 个薄弱点
  - 明确优先修复顺序
- 已吸收结果：
  - 修掉了相关推荐重复问题
  - 修掉了 Service Worker 预缓存脏路径问题
  - 来源区不再显示内部 `source-*` ID
  - 静态 smoke 新增断言：
    - Service Worker 不含脏路径
    - 详情页相关推荐不重复
    - 详情页不显示内部来源 ID

### 主线新增落实结果

- 已继续调整：
  - [site/scripts/build.mjs](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/scripts/build.mjs:1)
  - [site/src/styles/site.css](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/src/styles/site.css:1)
  - [site/tests/smoke-static.mjs](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/tests/smoke-static.mjs:1)
- 当前额外完成：
  - 首页首屏强化
  - 列表页汛期摘要压短
  - 详情页相关推荐去重补位
  - 来源文案改为用户可读标题
  - 静态 smoke 再次通过

## 2026-04-14 第四轮实时协同记录

### 本轮协作目标

- 把高优先级点位剩余的数据补强缺口补齐
- 把 QA 从“总量没问题”升级成“逐点不串、不漏、不越层”
- 在不推翻现有结构的前提下再做一轮低风险 UI 精修

### 大北本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 锁定高优先级 8 个点位里仍缺补强字段的点位
  - 给出最小可落地的字段补齐建议
- 已吸收结果：
  - 已补齐：
    - `shore-cfd-18plus-west-breakwater`
    - `shore-cfd-a-port-east-breakwater`
    - `shore-cfd-sixplus-lighthouse`
  - 已顺手补强：
    - `boat-cfd-longdao-ranch`
    - `boat-lt-putidao-west-reef`
    - `shore-cfd-xincheng-left-bank`
  - 现在高优先级 8 点都已有完整的前端补强字段，可继续直接推进真实公开图片替换

### 大东本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 继续提高 390pt 宽度下的成品感
  - 再压列表工具区，再收详情页首屏，再强化首页海报感
- 已吸收结果：
  - `home-shell` 加强首屏构图
  - `mode-card` 与 `mode-card__body` 再加强海报感
  - `home-meta`、`home-footer-note` 继续降权
  - `list-toolbar`、`count-pill`、`chip` 再压缩
  - `detail-summary-card` 双列断点提高到 `405px`
  - `detail-bottom-actions` 和 `back-to-top` 进一步减轻厚重感

### 大南本轮回传

- 工作状态：已实时回传
- 本轮重点：
  - 把全量详情页的三层结构红线做成强断言
  - 把危险提示、相关推荐和排序保护做成逐点校验
- 已吸收结果：
  - `smoke-static.mjs` 已新增：
    - 全量详情页不出现首页入口断言
    - 全量详情页不残留列表壳子 / 筛选条断言
    - 列表卡逐点危险提示断言
    - 详情页逐点危险提示断言
    - 全量列表默认顺序断言
    - 相关推荐不指向自己、不跨模式、数量不超 3 条断言
    - 远程图片状态与 `https` 资源一致性断言

### 主线新增落实结果

- 已继续调整：
  - [data/processed/spot-enrichment.json](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/data/processed/spot-enrichment.json:1)
  - [site/scripts/build.mjs](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/scripts/build.mjs:1)
  - [site/src/styles/site.css](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/src/styles/site.css:1)
  - [site/tests/smoke-static.mjs](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/site/tests/smoke-static.mjs:1)
  - [docs/verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)
- 当前额外完成：
  - 高优先级 8 点补强字段补齐
  - 列表卡和相关推荐加入稳定数据标识，方便后续持续验收
  - 静态 smoke 再次通过

## 2026-04-15 第五轮实时协同记录

### 本轮协作目标

- 不重开项目，继续沿原计划推进 `P0` 真图替换
- 在线程失联后重新接回大北、大东角色，不改变长期分工
- 继续把收口工作集中在图片替换、前台表达和 QA 保护上

### 大北本轮回传

- 工作状态：旧线程失联后已按原角色接续
- 本轮重点：
  - 判断 `P0` 真图替换应优先打哪两个点
  - 判断哪两个点继续保留“环境图 / 地图标注图”更稳
- 已吸收结果：
  - 真图优先继续追：
    - `boat-cfd-longdao-ranch`
    - `shore-cfd-18plus-west-breakwater`
  - 更适合继续维持现策略：
    - `shore-cfd-a-port-east-breakwater`
    - `shore-cfd-sixplus-lighthouse`
  - 本轮已先把 `shore-cfd-xincheng-left-bank` 的列表图升级为官方远程公开环境图

### 大东本轮回传

- 工作状态：旧线程失联后已按原角色接续
- 本轮重点：
  - 用最低风险的方式继续加强首页入口卡、列表卡和详情页顶部
- 已吸收结果：
  - 首页模式卡补入：
    - 核心鱼种
    - 最佳窗口
  - 列表卡补入：
    - 一句推荐摘要
  - 详情页顶部补入：
    - 区域
    - 导航
    - 最佳窗口
  - 静态 smoke 已验证通过

### 大南本轮回传

- 工作状态：持续在线协同
- 本轮重点：
  - 继续收口真实图片替换后最容易炸的质量点
- 已吸收结果：
  - 明确下一轮最值钱的保护方向：
    - 图片状态与 `src` 一致性
    - 图片替换后不串图
    - 真图替换后的浏览器侧轻量回归

### 主线新增落实结果

- 已继续调整：
  - [data/processed/spot-enrichment.json](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/data/processed/spot-enrichment.json:1)
  - [docs/verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)
- 当前额外完成：
  - `shore-cfd-xincheng-left-bank` 已接入官方远程公开列表图
  - 大北 / 大东角色已重新接回，不改项目协作机制

## 2026-04-16 第六轮协作补记

### 本轮协作目标

- 按指导型网站逻辑，先把三层级逐字稿写成可评审文档
- 先完成文案层梳理和验收口径，再进入页面代码修正

### 当前环境限制

- 直接拉起原子线程时，底层返回 `gpt-5.1-codex-max` 不受当前账号支持
- 因此本轮不能稳定复用原子线程执行

### 当前执行方式

- 不重置大北 / 大东 / 大南角色边界
- 主线程按既有职责文档与日志代行协作
- 新产出必须写回本地文件，保证后续可接任

### 本轮新产出

- [three-level-copy-draft-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/three-level-copy-draft-v1.md:1)
- [three-level-copy-acceptance-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/three-level-copy-acceptance-v1.md:1)

## 2026-04-16 第七轮协作补记

### 本轮协作目标

- 把三层级逐字稿从结构摘要升级成可直接讨论的正式文案版本
- 合并大北的事实边界、大东的结构逻辑和大南的验收口径

### 本轮协作结果

- 大北已补充三层级文案事实边界：
  - [copy-guidance-three-level-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/copy-guidance-three-level-v1.md:1)
- 大东已补充指导型网站结构建议：
  - [dadong-guided-website-copy-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-guided-website-copy-v1.md:1)
- 大南已补充三层级逐字稿验收口径：
  - [three-level-copy-acceptance-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/three-level-copy-acceptance-v1.md:1)

### 本轮主线新产出

- [three-level-copy-draft-v2.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/three-level-copy-draft-v2.md:1)

### 已吸收结论

- 第一层级必须只做分流，不再承载钓点细节
- 第二层级必须是当前模式下的钓点排行榜和比较页
- 第三层级必须是单点决策页，不再混入列表壳子
- 第二层级风险前置只能保留生命危险型提示
- 文案必须围绕“值不值得去”组织，而不是围绕“资料多不多”组织

## 2026-04-16 第八轮协作补记

### 本轮协作目标

- 把三层级逐字稿从结构稿推进到页面实现可直接使用的定稿层

### 本轮协作结果

- 大北复核：首页表达边界，要求用更稳的事实口径，不做过度承诺
- 大东复核：第二层级卡片顺序和“为什么值得点开”的短摘要必须固定下来
- 大南沿用验收口径：三层级继续守“分流 / 比较 / 决策”三段门槛

### 本轮主线新产出

- [level-1-home-copy-final-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/level-1-home-copy-final-v1.md:1)
- [level-2-list-copy-final-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/level-2-list-copy-final-v1.md:1)
- [level-3-detail-copy-final-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/level-3-detail-copy-final-v1.md:1)

### 已吸收结论

- 首页统一改用“更值得优先查看”“更有实战参考价值”等稳健表达
- 第二层级卡片必须先让用户知道它排第几、强在哪、值不值得点开
- 第三层级必须围绕“去不去、何时去、怎么去、怎么钓”组织

## 2026-04-16 第九轮协作补记

### 本轮协作目标

- 把三层级定稿真正落进首页、第二层级、第三层级页面实现
- 用大北 / 大东的文案边界与结构反馈，收口到可交付页面
- 用大南 Gate 验证页面实现没有偏离“分流 / 比较 / 决策”

### 本轮协作结果

- 大北复核：页面实现里的表达仍需保持“指导型”而非营销型，尤其第二层级要控制强化词密度
- 大东复核：首页继续收缩成纯入口页；第二层级卡片顺序已按比较页逻辑调整；第三层级主图说明改成用户可读说明
- 大南 Gate：主线程按既定协议代行验收，已通过安全预检与静态验收

### 本轮主线新产出

- 首页、海岸钓列表页、出海钓列表页、详情页生成逻辑已按三层级定稿改写
- `site/tests/smoke-static.mjs` 已补到新文案与新结构断言

### 验收结果

- `npm run safety:preflight` 通过
- `npm run test:smoke` 通过

### 已吸收结论

- 首页必须保持纯入口，不再预览首推点与细节
- 第二层级卡片必须先给用户“为什么值得点开”的短摘要，再进入结构与窗口比较
- 第三层级标题区必须明确给出“一句话判断”，主图说明必须对用户可读

## 2026-04-17 第十轮协作补记

### 本轮协作目标

- 把第二层级进一步收成真正的“比较页”
- 把第三层级首屏进一步收成真正的“决策页”
- 在不越过既定三层结构边界的前提下完成一轮 UI/UX 精修

### 本轮协作结果

- 大东复核：第二层级要补强比较信息，排序说明前置，首屏只保留模式分流
- 大南复核：第二层级缺少显式的新手 / 到达 / 成本比较信号，第三层级首屏缺少“怎么去 / 首访建议”
- 主线程据此完成页面实现调整，并顺序通过安全预检与静态 smoke

### 本轮主线新产出

- 第二层级新增“全部”筛选、排序规则提示、比较型卡片信息块
- 第三层级新增“到达与准备”“首访建议”摘要卡，并弱化非决策型状态信息
- 相关推荐已稳定补齐到三张卡

### 验收结果

- `npm run build` 通过
- `npm run safety:preflight` 通过
- `npm run test:smoke` 通过

### 已吸收结论

- 第二层级必须让用户一眼比较“这点在哪、强在哪、值不值得点开”
- 第三层级首屏必须补足“怎么去”和“第一次去怎么判断”这两个决策信息
- 每组筛选都必须有显式“全部”回退项，不能只靠“清空筛选”

## 2026-04-17 第十一轮协作补记

### 本轮协作目标

- 继续压缩第二层级与第三层级的视觉节奏
- 把“比较信息”和“决策信息”进一步提到用户首屏扫描路径里

### 本轮协作结果

- 第二层级卡片保留比较结构，但进一步强调“区域与导航 / 核心钓段”的判断顺序
- 第三层级在标题区新增决策提示条，把“到达与准备 / 首访建议”提升到首屏
- 按串行方式重新通过构建、安全预检与静态 smoke，避免并行抢占 `dist`

### 验收结果

- `npm run build` 通过
- `npm run safety:preflight` 通过
- `npm run test:smoke` 通过

### 已吸收结论

- 第三层级首屏必须先让用户回答“能不能去、第一次怎么去”，再看下层资料
- 第二层级筛选器和工具区必须继续让位于比较信息本身

## 2026-04-17 第十二轮协作补记

### 本轮协作目标

- 把第二层级进一步压成“分梯队推荐排序页”
- 把第三层级首屏补足“怎么钓”这一条决策信息

### 本轮协作结果

- 新增梯队分组渲染：第一梯队 / 第二梯队 / 第三梯队
- 第二层级卡片新增“适合谁先看”比较信号
- 第三层级摘要卡新增“怎么钓”首屏信息
- 第三层级底部动作区改成“返回排序页 / 继续比较”的明确出口
- 吸收 Hubble 审看意见后完成一轮结构微调

### 验收结果

- `npm run build` 通过
- `npm run safety:preflight` 通过
- `npm run test:smoke` 通过

### 已吸收结论

- 第二层级必须先呈现“梯队差异”和“谁该先看哪个点”
- 第三层级首屏必须明确回答“怎么钓”，不能只回答“值不值得去”

## 2026-04-17 第十三轮协作补记

### 本轮协作目标

- 把第一层级改成真正的指导入口页，而不是解释型首页
- 用真实图片和更直接的出发式文案替换旧的“信息站”口吻

### 本轮协作结果

- 首页主说明改成“今天怎么钓，先从这里选”
- 删除首页里“这不是资讯流 / 百科大全”这类解释性废话
- 首页两张主卡改成“岸边先看 / 出船先看”的出发式结构
- 首页卡片补足更多目标鱼种，并把“适合谁先点进来”压成一行短提示
- 保留首页底部轻辅助入口：排名说明 / 合规说明 / 最近更新

### 验收结果

- `npm run build` 通过
- `npm run safety:preflight` 通过
- `npm run test:smoke` 通过

### 已吸收结论

- 第一层级只能负责“先选怎么钓”，不能承载具体钓点和长解释
- 首页的行动感应来自进入决策，不应来自虚假数据或夸张承诺
