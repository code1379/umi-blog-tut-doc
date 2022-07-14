---
outline: deep
outlineTitle: "准备工作"
---

# 准备工作

## 环境准备

### 注册 PlanetScale 服务

我们的博客将会把用户和文章的数据保存在 MySQL 数据库中。然而，我们不需要真的自己准备一台服务器来运行数据库，我们可以使用免费的 [PlanetScale](https://planetscale.com/) 来一键部署一个开箱即用的数据库！

### 安装数据库、加密解密、用户身份验证 相关依赖

```bash
pnpm i -d prisma @types/bcryptjs @types/jsonwebtoken
pnpm i @prisma/client bcryptjs jsonwebtoken
```

1. [prisma](https://github.com/prisma/prisma) 和 [@prisma/client](https://www.npmjs.com/package/@prisma/client): 这两个包让我们可以用 [Prisma](https://www.prisma.io/) 来方便地串接数据库，不需要担心任何复杂的 SQL 命令。
2. [bcryptjs](https://github.com/dcodeIO/bcrypt.js): 这个包让我们将用户注册后的密码使用 [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) 哈希加密算法来安全的存储在数据库中。
3. [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): 这个包让我们可以方便地使用用 [JWT(Json Web Token)](https://jwt.io/) 实现用户鉴权。

然后将 `package.json` 中 `scripts` 里面的 `build` 脚本从

```json
"scripts": {
  "dev": "umi dev",
  "build": "umi build",
  "postinstall": "umi setup",
  "start": "npm run dev"
},
```

改成

```json
"scripts": {
  "dev": "umi dev",
  "build": "prisma generate && umi build",
  "postinstall": "umi setup",
  "start": "npm run dev"
},
```

这可以确保每次开始构建以前都已经生成好 Prisma 客户端。

::: danger [IMPORTANT](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
重要提示 prisma generate：您需要在对 Prisma 模式进行每次更改后重新运行该命令，以更新生成的 Prisma 客户端代码
:::

### 安装 Tailwindcss （可以不使用，我们后面使用 antd）

使用 Umi 提供的微生成器来在项目中启用 Tailwindcss :

```bash
npx umi g tailwindcss
```

他会帮我们安装 Tailwindcss 所需要的依赖，然后生成需要的文件。

### 生成对应页面

我们可以使用 Umi 的微生成器来自动生成这些页面：login.tsx, posts/post.tsx, posts/create.tsx:

```bash
npx umi g page login posts/post posts/create
```

新增后的目录结构是这样的：

```
src
├── assets
│     └── yay.jpg
├── layouts
│     ├── index.less
│     └── index.tsx
└── pages
    ├── index.tsx
    ├── docs.tsx
    ├── login.less
    ├── login.tsx
    └── posts
        ├── create.less
        ├── create.tsx
        ├── post.less
        └── post.tsx
```

### 配置 Umi 项目

> 配置路由、启用 API 路由、~~启用 tailwindcss~~

```typescript
// .umirc.ts
export default {
  npmClient: "pnpm",
  apiRoute: {
    platform: "vercel",
  },
  routes: [
    { path: "/", component: "index" },
    { path: "/posts/create", component: "posts/create" },
    { path: "/login", component: "login" },
    { path: "/posts/:postId", component: "posts/post" },
  ],
  plugins: [require.resolve("@umijs/plugins/dist/tailwindcss")],
  tailwindcss: {},
};
```

- `apiRoute` 这个配置项告诉 Umi 我们的项目启用了 **API 路由** 这个功能，而 `platform: 'vercel'` 代表我们要部署到 [Vercel](https://vercel.com/) 平台，在 `umi build` 的时候会针对这个平台来将 API 路由进行打包。
  为了顺利部署项目到 Vercel ，你需要在项目根目录下加入一个 `vercel.json` 配置文件：

  ```json
  {
    "build": {
      "env": {
        "ENABLE_FILE_SYSTEM_API": "1"
      }
    },
    "rewrites": [
      {
        "source": "/api/:match*",
        "destination": "api/:match*"
      }
    ]
  }
  ```

- `routes` 这个配置项则声明了我们网站的路由架构，可以看到我们的博客网站有这些页面：

  - `/`: 首页
  - `/posts/create`: 建立文章
  - `/login`: 登入
  - `/posts/:postId`: 某篇文章 （因为默认的路由是 `/posts/post`，所以我们需要自己手动设置路由）

- ~~`plugins` 配置项代表我们启用了哪些 Umi 插件，其中 `@umijs/plugins/dist/tailwindcss` 是在 Umi 中使用 Tailwindcss 的插件。下面一项 `tailwindcss: {}` 则是从配置来启用该插件的意思。~~
