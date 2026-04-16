# 小弟复用与交接协议 v1

## 目的

把“小弟优先复用、失效可交接、不中断主线”的规则固定下来，避免每次开新线程都重新建立上下文。

## 核心规则

1. 同一角色优先复用已经用过的小弟  
   长时间未工作不是重开理由。只要原小弟还能用，优先继续用原小弟。

2. 同一角色不默认并行开多个拥有者  
   `大北 / 大东 / 大南` 每个角色默认只有一个“当前角色拥有者”。除非明确需要临时辅助线程，否则不为同一角色重复开新小弟。

3. 复用顺序固定  
   - 当前仍可用的角色拥有者
   - 该角色最近一次已用过的替补小弟
   - 可恢复的历史同角色小弟
   - 以上都不可用时，才新开接任小弟

4. 新开接任小弟前必须先做交接加载  
   新小弟必须先读：
   - 角色职责文档
   - 该角色工作日志
   - 协作总档案
   - 当前正在改的核心文件
   读完后再开始产出。

5. 角色失效不等于角色失忆  
   小弟线程失效，只代表执行体失效，不代表角色失效。角色的持续记忆由本地职责文档和工作日志承接。

6. 交接必须写回本地  
   每次关键产出、重大判断、失败尝试、已吸收结论，都要写回对应角色日志，不能只留在临时对话里。

7. Agent ID 必须做存活校验  
   角色文档里记录的 Agent ID 只代表“最近有效拥有者”，不代表当前一定可直接使用。每次调用前都要先检查该拥有者是否仍在当前环境可用。

8. 当前拥有者不可用时，先走“角色接任”，再走“主线程代行”  
   如果原拥有者不在当前环境、线程位已满、或无法恢复：
   - 先尝试按协议新开该角色的接任者
   - 如果当前环境连接任者也无法创建，则由主线程临时代行该角色职责
   - 主线程代行期间，必须把结论写回该角色日志，直到新接任者可以无缝接手

9. 环境受限时，不强求浏览器型验收  
   如果 `file://`、本地端口、浏览器自动化、系统预览同时受限，则按“宿主机预览脚本 > 主线程代行静态 smoke > 角色日志留痕”的顺序降级，不把不可执行流程硬当成必过门槛。

10. 阶段性交付前必须经过大南验收关  
   任何要交给用户查验的阶段性版本，都必须先经过大南的 QA Gate。若大南原拥有者不可用，则按本协议复用/接任；若环境仍受限，则由主线程按大南职责清单代行验收，并把结论写回大南日志后，才能交付用户。

## 当前角色绑定

### 大北

- 当前优先拥有者：`Bernoulli`
- 当前 Agent ID：`019d8ed1-3e0a-74e2-aaa7-30d16d542c1e`
- 上一任：`Nietzsche`
- 角色文件：
  - [dabei-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dabei-role-v1.md:1)
  - [dabei-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dabei-log-v1.md:1)

### 大东

- 当前优先拥有者：`Dirac`
- 当前 Agent ID：`019d8ed1-4179-74b3-a7a2-92bf21fb643d`
- 上一任：`Planck`
- 角色文件：
  - [dadong-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-role-v1.md:1)
  - [dadong-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/dadong-log-v1.md:1)

### 大南

- 当前优先拥有者：`Feynman`
- 当前 Agent ID：`019d8a1e-2845-7c63-a523-79c71626e15e`
- 上一任：无
- 角色文件：
  - [danan-role-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/danan-role-v1.md:1)
  - [danan-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagents/danan-log-v1.md:1)

## 新小弟接任步骤

1. 读取该角色职责文档  
2. 读取该角色工作日志最近 3 轮记录  
3. 读取 [subagent-roster-and-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagent-roster-and-log-v1.md:1)  
4. 读取当前正在修改的核心文件  
5. 在角色日志写一条“接任记录”  
6. 再开始执行具体任务

## 角色日志最低写入要求

每次需要至少写回 5 类信息：

- 本轮目标
- 输入依据
- 已完成动作
- 已吸收结论
- 下一步或未解风险

## 节省算力规则

- 角色职责和历史决策先查本地文档，不先重新分析
- 同类问题优先复用已有结论、已有测试、已有字段规范
- 小任务不强制调小弟；只有在该角色明显能提高质量或速度时才调
- 同一轮里优先复用现有活跃小弟，不重复开新线程

## 失败兜底

如果原小弟不可用：

1. 先确认是否能恢复或继续使用最近接任者  
2. 不行再新开接任小弟  
3. 新小弟必须按本协议完成加载  
4. 在对应角色日志补一条“接任原因 + 接任时间 + 继承范围”

## 当前项目的浏览 / QA 降级顺序

1. 优先复用当前可用的大南拥有者做真实浏览式验收  
2. 原拥有者失效时，创建大南接任者并先读职责文档和日志  
3. 若环境不允许创建接任者，则由主线程临时代行大南职责并写回日志  
4. 浏览链路优先级固定为：
   - 宿主机运行 `preview-local.command`
   - 环境允许时跑浏览器 E2E
   - 当前环境受限时跑静态 smoke
5. 任何一步如果失败，都必须记录“失败原因 / 受限类型 / 已采用降级方案”
