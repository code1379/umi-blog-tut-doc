# 页面搭建

## 登录页面
这里使用到了 [formily](https://formilyjs.org/zh-CN)，我们安装相应的依赖
```bash
pnpm install @formily/core

# react 框架桥接库
pnpm install @formily/react 
# vue 框架桥接器
pnpm install @formily/vue
```
安装组件库 antd 
```bash
pnpm install antd moment @formily/antd
```
全局引入 antd 样式
```typescript
// layout/index.tsx
import 'antd/dist/antd.css';
```