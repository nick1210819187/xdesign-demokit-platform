# 上传说明

这是一份完整源码包，对应当前本地预览里的升级版 DemoKit。

上传 GitHub 时，把这个文件夹里的内容上传到仓库根目录，覆盖同名文件：

- `.github`
- `public`
- `scripts`
- `src`
- `.gitignore`
- `README.md`
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`

不要上传：

- `node_modules`
- `dist`
- 之前的增量包或 handoff 文件夹

上传后 GitHub Actions 会自己构建并发布。
