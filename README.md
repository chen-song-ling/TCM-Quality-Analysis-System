# void-react-electron

自用空项目，用于起步构建嵌入 react 框架的 electron 项目。在 [electron-boilerplate](https://github.com/szwacz/electron-boilerplate) 的基础上修改而来。

## 快速开始 Or 生产环境测试

```bas
git clone git@github.com:Leundo/void-react-electron.git
cd void-react-electron
npm install
npm run build
npm run elec
```

## 浏览器环境测试

不需要 `npm run build`，热加载模式。

```bash
npm run start
```

## Electron 环境测试

不需要 `npm run build`，热加载模式。一个终端挂起服务：

```bash
npm run start
```

另一个终端拉起 Electron

```bash
npm run elec-dev
```

## 打包

```bash
npm run build
npm run release
```

