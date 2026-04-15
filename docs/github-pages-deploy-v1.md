# GitHub Pages 发布说明 v1

## 目的

让 `tangshan-fishing-guide` 独立仓库在推送到 GitHub 后，自动生成一个可公开访问的网址。

## 当前状态

仓库已包含：

- `.github/workflows/deploy-pages.yml`
- `site/package.json` 的独立依赖声明
- `site/scripts/build.mjs` 的 GitHub Pages 路径兼容处理

## 使用方式

### 1. 推送代码到 GitHub

在本机终端执行：

```bash
cd "/Users/ssr/Downloads/Openai Codex/tangshan-fishing-guide"
git push -u origin main
```

### 2. 在 GitHub 仓库里启用 Pages

进入仓库：

- `Settings`
- `Pages`

确认来源使用：

- `GitHub Actions`

### 3. 等待工作流完成

仓库的 `Actions` 里会出现：

- `Deploy GitHub Pages`

当它成功后，Pages 公网地址通常会是：

- `https://void-ssr.github.io/tangshan-fishing-guide/`

## 工作流做了什么

1. 检出仓库
2. 在 `site/` 目录安装依赖
3. 运行 `npm run build`
4. 运行 `npm run test:smoke`
5. 上传 `site/dist`
6. 部署到 GitHub Pages

## 已处理的兼容问题

- 页面内部链接已改为相对路径
- `manifest.webmanifest` 已改为相对路径
- Service Worker 预缓存路径已改为适合仓库子路径部署
- 产物内自动生成 `.nojekyll`

## 仍需注意

- 第一次使用 GitHub Pages 时，仓库设置页可能需要手动确认一次 `Pages -> Source -> GitHub Actions`
- 如果远程仓库名不是 `tangshan-fishing-guide`，最终网址路径也会跟着变
