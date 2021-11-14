# drug-control-medp

毕业设计，辅助工具之二

## 快速开始 Or 生产环境测试

```bas
git clone git@github.com:Leundo/drug-control-medp.git
cd drug-control-medp
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

