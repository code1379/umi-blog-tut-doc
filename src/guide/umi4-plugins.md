# Umi4 plugins 的使用

像之前教程中提到的使用 tailwind 一样。我们首先需要安装插件
所有的插件都在[这里](https://github.com/umijs/umi/tree/b034e224adcad8615c2de4396f0ed6c31890e8c0/packages/plugins)

我们可以通过下面的命令安装插件（Umi Max 默认集成了所有插件，官方维护人员推荐）。

```bash
pnpm install @umijs/plugins
```

当我们需要启用某个插件的时候

1. 我们需要将其添加到 plugins 里面（通过 `require.resolve` 的方式引入）
2. 我们需要添加对应的配置项到配置文件中

```typescript
plugins: [
  require.resolve("@umijs/plugins/dist/initial-state"),
  require.resolve("@umijs/plugins/dist/access"),
  require.resolve("@umijs/plugins/dist/model"),
],
access: {},
mode: {},
initialState: {}
```

## initialState 插件的使用

1. 在 src 下创建 app.js （umijs 约定的），里面导出 `getInitialState` 函数

```ts
// 这里的初始化数据。
/**
 思考 1. 是否需要远程拉取。那用户没有登录 getInitialState 就获取不到。 意思是这里其实获取到的数据是 通用数据，即没有权限的数据。
         像是路径对应的权限等等。
 思考 2. 是否使用 localStorage 来获取本地存储数据。
 */
export async function getInitialState() {
  // @ts-ignore
  const isLogin = localStorage.getItem("isLogin")
    ? JSON.parse(localStorage.getItem("isLogin"))
    : false;
  const data = {
    name: "dell",
    age: 18,
    isLogin,
  };
  return data;
}
```

如果想要修改 initialState 的值，我们可以通过 `useModel`，代码如下

```ts

```

## access 插件的使用

在 src 下创建 access.ts，导出的函数中默认直接获取到 initialState 初始化的值。

```ts
// @ts-ignore
import type { InitialState } from "umi";

export default function (initialState: InitialState) {
  const { isLogin } = initialState;
  return {
    isLogin,
  };
}
```
