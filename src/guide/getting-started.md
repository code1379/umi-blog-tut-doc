---
pageClass: api
---

# 快速上手

## 创建项目
先找个地方建个空目录。
```bash
$ mkdir myapp && cd myapp
```
通过官方工具创建项目
```bash
$ pnpm dlx create-umi@latest
√ Pick Umi App Template » Simple App
√ Pick Npm Client » pnpm
√ Pick Npm Registry » taobao
```

## 启用 Prettier（可选）
使用 umi generator 生成 prettier 配置，详情查看 [微生成器](https://umijs.org/docs/guides/generator)
```bash
$ pnpm umi g
√ Pick generator type » Enable Prettier -- Setup Prettier Configurations
```

## 启动项目
```bash
$ pnpm dev
```