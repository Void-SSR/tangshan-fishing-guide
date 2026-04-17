# 唐山海钓指南

这是唐山海钓指南 App 型网站的独立项目目录。

## 项目边界

- 不复用根目录旧网站的页面、样式、脚本和文案
- 不改造旧站
- 旧站信息不进入本项目内容库

## 当前状态

当前已经进入**第一版可交付状态**。

当前这版已经按“指导型网站”重做三层结构：

- 第一层级：首页只负责分流到 `海岸钓 / 出海钓`
- 第二层级：列表页只负责同模式点位比较
- 第三层级：详情页只负责单点决策

第一版覆盖内容：

- 首页：只保留 `海岸钓` / `出海钓` 两个主入口
- 海岸钓列表页
- 出海钓列表页
- `17` 个单钓点详情页
- 排名说明 / 合规说明 / 最近更新
- PWA 基础资源

第一版当前已完成：

- 独立信息库与补强数据层
- 三层 App 型结构落地
- 三层级逐字稿定稿与页面实现对齐
- 搜索、筛选、返回状态恢复
- 危险提示规则与核验状态规则
- 静态 smoke 验收
- 高优先级点位持续补图机制
- GitHub Pages 自动部署工作流

## 目录结构

- `data/raw`：来源登记与原始资料留档
- `data/processed`：结构化信息库、补强数据
- `docs`：产品、协作、角色、流程、核验、发布文档
- `site`：站点源码、构建脚本、测试与 `dist` 产物

## 启动与构建

站点目录：

- `/Users/ssr/Downloads/Openai Codex/tangshan-fishing-guide/site`

常用命令：

- `npm run build`
- `npm run test:smoke`
- `npm run start`
- `npm run preview:diagnose`

宿主机预览入口：

- `site/preview-local.command`

说明：

- `dist/` 是当前第一版静态站点产物
- `preview-local.command` 会先构建，再在宿主机启动本地预览并尝试打开浏览器
- `preview-local.command` 会同时打印：
  - 本机网址：电脑自己访问
  - 手机同网访问：手机和电脑在同一 Wi‑Fi / 局域网时使用
- `preview:diagnose` 用于判断当前环境是否适合直接做浏览器预览
- 当前 Codex 沙箱里可能同时限制本地端口、`file://` 浏览和浏览器自动化；此时优先在宿主机运行 `preview-local.command`，并用 `test:smoke` 做收口验证

## 关键文档

- 原计划：
  - [site-ux-architecture-v2.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/site-ux-architecture-v2.md:1)
- 核验与图片：
  - [verification-and-assets-plan-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/verification-and-assets-plan-v1.md:1)
- 小弟协作：
  - [subagent-roster-and-log-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/subagent-roster-and-log-v1.md:1)
- 第一版交付：
  - [site-release-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/site-release-v1.md:1)
- GitHub Pages 发布：
  - [github-pages-deploy-v1.md](/Users/ssr/Downloads/Openai%20Codex/tangshan-fishing-guide/docs/github-pages-deploy-v1.md:1)

## 公网发布

仓库已经包含 GitHub Pages 自动部署工作流：

- `.github/workflows/deploy-pages.yml`

推送到 `main` 后，去 GitHub 仓库的 `Settings -> Pages`，确认来源为 `GitHub Actions`。

如果仓库名保持为 `tangshan-fishing-guide`，默认公网地址会是：

- `https://void-ssr.github.io/tangshan-fishing-guide/`

## 当前默认假设

- 第一版同时覆盖出海钓与海岸钓
- 前台语气以实用、克制、可信为主
- 精确地图功能暂不作为第一版交付范围
- 休渔、可进入性、港区动态限制等内容仍需持续复核
