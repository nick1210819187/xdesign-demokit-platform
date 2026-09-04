# XDesign DemoKit 增量包 - 2026-09-01

这个包只包含本轮更新涉及的文件和一份已经构建好的静态产物。

## 1. 源码增量

把 `source/` 里的文件覆盖到你的 GitHub 仓库同名路径：

- `src/pages/ComponentLibraryPage.tsx`
- `src/pages/ModalDrawerPage.tsx`
- `src/pages/OnlineServicePage.tsx`
- `src/pages/TreeTablePage.tsx`
- `src/styles.css`

覆盖后在仓库根目录执行：

```bash
npm install
npm run build
git status
git add src/pages/ComponentLibraryPage.tsx src/pages/ModalDrawerPage.tsx src/pages/OnlineServicePage.tsx src/pages/TreeTablePage.tsx src/styles.css dist
git commit -m "Update XDesign DemoKit appendable and switch patterns"
git push
```

## 2. 快速发布

如果你只想先让 GitHub Pages 看到最新页面，可以把：

```text
publish-ready/dist/
```

里的内容覆盖到你的发布目录。

如果你的仓库是用 GitHub Actions 自动构建发布，只需要提交源码增量即可，不需要手动提交 `dist/`。

## 3. 本轮更新范围

- 组件 DemoKit：追加表单组、开关展开组、表格追加组统一规则。
- 二级页面：服务设置里的多推理服务追加组、开关和删除操作对齐。
- 弹窗与抽屉：创建用户弹窗里的角色权限按 DemoKit 规则调整。
- 左树右表：左侧树结构改为三级，筛选区改为标题后紧跟开关。

本地构建已通过。
