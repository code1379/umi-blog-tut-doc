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

## 后端 API 路由设计

因为我们已经在 `.umirc.ts` 配置文件中声明了我们要启用 API 路由功能，现在可以直接在 `src` 目录下添加一个 `api` 目录，这个目录下以约定式路由的设计来提供 API 路由的开发。
作为一个博客的 API 服务，不难想到我们会需要这些接口来供用户调用：

1. 用户注册: POST `/api/register`
2. 用户登入: POST `/api/login`
3. 发表文章: POST `/api/posts`
4. 查询所有文章: GET `/api/posts` 因为我们现在还没有单独的文章列表的路由，所以我们获取到数据，展示在首页
5. 查询一篇文章: GET `/api/posts/{postId}`

所以我们可以在 `src/api` 目录下建立这些新文件（可以手动新建，也可以使用微生成器）：

```bash
npx umi g api login register posts posts/[postId]
```

微生成器生成的目录如下（posts 没有生成到 posts.ts 下面的 index.ts，我们生成的时候应该 `posts/index`）

```bash
src
├── api
│     ├── login.ts
│     ├── register.ts
│     ├── posts.ts
│     └── posts
│           └── [postId].ts
...
```

手动生成的目录如下

```bash
src
├── api
│     ├── login.ts
│     ├── register.ts
│     └── posts
│           ├── [postId].ts
│           └── index.ts
...
```

:::tip
你可能注意到了，这里有一个文件叫做 [postId].ts，这个写法代表这个路由可以动态匹配不同的值。 例如 /api/posts/1 和 /api/posts/2 两个请求都会交给 src/api/posts/[postId].ts 处理，但他们的 req.params 分别是 { postId: 1 } 和 { postId: 2 }。
:::
这里的每个 `.ts` 文件就是一个 **API Handler**，他们默认导出一个函数用来处理发送到该路径的请求，我们可以暂时先这样写：

```typescript
import type { UmiApiRequest, UmiApiResponse } from "umi";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  res.status(400).json({ error: "This API is not implement yet." });
}
```

然后你可以试着用浏览器或 [Postman](https://www.postman.com/) 访问看看这些 API 路由（例如 `http://localhost:8000/api/login` )，就可以看到你刚刚写的响应数据了 🎉

## 定义 Schema

现在必须要先确定一件事情：我们要保存哪些数据、以怎么样的形式保存在数据库，又是以怎么样的形式响应给前端的？

### 文章数据

文章数据（Post）每笔数据就代表了一篇博客里面的文章，我们可以按自己的系统需求来设计他需要保存的内容，例如我们的范例保存了这些数据

- `id`: 文章 ID
- `title`: 文章标题
- `authorId`: 作者的 ID
- `tags`: 文章的标签（以逗号隔开）
- `imageUrl`: 文章封面图片的链接
- `content`: 文章的内文（markdown 格式）

### 用户数据

用户数据 (User) 每笔数据代表一个在我们博客注册的用户数据，我们可以按照自己的系统需求来设计他需要保存的内容，例如我们的范例保存了这些数据：

- `id`: 用户 ID
- `name`: 名称
- `email`: 邮箱
- `avatarUrl`: 头像链接
- `passwordHash`: 加密过的密码

## Prisma 生成配置

> 这个章节可以考虑阅读 [Prisma 官方的教学文档](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-mysql)

定义好数据格式以后，我们要让 Prisma 帮我们根据 Schema 设计来生成对应的客户端，并且自动的将数据库迁移至为我们设计的格式。

```bash
npx prisma init
```

这个命令会在根目录下生成 `.env` 和 `prisma/schema.prisma` 文件

### 连接到数据库

:::danger
github 项目必须是 private 的，否则 planetscale 会监测到，然后发送邮件。
A thiem umi-blog database password has been detected in a public repository on GitHub. This **password has been revoked** .
Any connections using this password will be disconnected.
:::

第一步，~~我们在根目录建立一个~~在 `.env` 文件 ~~，并且在~~ 里面加入刚刚在 [注册 PlanetScale 服务](https://umijs.org/docs/tutorials/blog#%E6%B3%A8%E5%86%8C-planetscale-%E6%9C%8D%E5%8A%A1) 章节拿到的连线信息。

```bash
DATABASE_URL='mysql://********:********@chtl6ffosmbh.ap-southeast-2.psdb.cloud/umi-blog?sslaccept=strict'
```

### 编写 Prisma 配置

第二步，在~~根目录下建立一个~~ prisma/schema.prisma 文件 ~~，并~~ 把我们设计的 Schema 按照 Prisma 语法 写进去文件中：

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["referentialIntegrity"]
}

datasource db {
  provider = "mysql"
  referentialIntegrity = "prisma"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  imageUrl  String?
  tags      String

  @@index(authorId)
}

model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  passwordHash  String
  name          String?
  posts         Post[]
  avatarUrl     String?
}
```

完成后在命令行输入

```bash
npx prisma db push

...
✔ Generated Prisma Client (4.0.0 | library) to
.\node_modules\.pnpm\@prisma+client@4.0.0_prisma@4.0.0\node_modules\@prisma\client in 162ms
```

~~官方的命令`npx prisma migrate dev --name init`~~

他会帮我们创建数据库的，并且默认生成 Prisma Client（我们后面可以使用 `npx prisma generate` 手动生成）。
我们可以使用 `npx prisma studio` 查看对应的表。
接下来，手动生成 Prisma Client 在命令行中输入

```bash
npx prisma generate

✔ Generated Prisma Client (4.0.0 | library) to
.\node_modules\.pnpm\@prisma+client@4.0.0_prisma@4.0.0\node_modules\@prisma\client in 105ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

他会帮我们生成一个按照我们的 Schema 设计量身定制的客户端包。

---

至此，我们已经顺利处理完数据库的部分，接下来只要专注于如何在 API 路由中使用 Prisma 客户端包来获取与更新数据即可。
