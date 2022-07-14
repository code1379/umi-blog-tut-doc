# 实现 API 路由

我们现在要回实现 `api` 目录下的 `.ts` 文件了，只要我们自己清楚：

1. API 会如何被调用 (path, request header, request body)
2. 我们应该在 API 内做什么事
3. 响应什么内容回去 (status, response header, response body)

那么 API 路由的开发就像写编写一个简单的函数一样。

## 用户注册

当用户对 `/api/register` 发起 `POST` 请求时，代表他们想要在我们的博客网站注册一个账号。

```typescript
// src/api/register.ts
import type { UmiApiRequest, UmiApiResponse } from "umi";
// 用户注册的时候，需要向数据库中添加用户
import { PrismaClient } from "@prisma/client";
// 用户密码加密
import bcrypt from "bcryptjs";
// jwt 设置 token
import { singToken } from "@/utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case "GET":
      res.json({ register: "is working" });
      break;
    case "POST":
      try {
        // 获取请求体里面的数据
        const { email, name, avatarUrl, password } = req.body;
        // 建立一个 Prisma 客户端，他可以帮助我们连线到数据库
        const prisma = new PrismaClient();
        // 在数据库的 User 表中建立一个新的数据
        const user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl,
            // 密码是经过 bcrypt 加密的
            passwordHash: bcrypt.hashSync(password, 8),
          },
        });

        // 把建立成功的用户数据（不包含密码）和 JWT 回传给前端
        res
          .status(201)
          .setCookie("token", await singToken(user.id))
          .json({ ...user, passwordHash: undefined });

        // 处理完请求以后记得断开数据库连接
        await prisma.$disconnect();
      } catch (e: any) {
        // 如果发生未预期的错误，将对应的错误说明的 Prisma 文档发给用户
        console.error(e);
        res.status(500).json({
          result: false,
          message:
            typeof e.code === "string"
              ? "https://www.prisma.io/docs/reference/api-reference/error-reference#" +
                e.code.toLowerCase()
              : e,
        });
      }
      break;
    default:
      // 如果不是 POST 请求，代表他正在用错误的方式访问这个 API
      res.status(405).json({ error: "Method not allowed" });
  }
}
```

jwt 设置/校验 token

```ts
// utils/jwt.ts
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

// 使用 jwt.sign 签发 token
export function singToken(id: number) {
  if (!secret)
    throw new Error("Environment variable JWT_SECRET is not defined!");
  return new Promise<string>((resolve, reject) => {
    jwt.sign({ id }, secret, {}, (err, token) => {
      if (err || !token) return reject(err);
      resolve(token);
    });
  });
}

export function verifyToken(token: string) {
  if (!secret)
    throw new Error("Environment variable JWT_SECRET is not defined!");
  return new Promise<{ id: number }>((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err || !payload) return reject(err);
      resolve(payload as { id: number });
    });
  });
}
```

`.env` 中添加 `JWT_SECRET`

```bash
DATABASE_URL='mysql://********:********@chtl6ffosmbh.ap-southeast-2.psdb.cloud/umi-blog?sslaccept=strict'
JWT_SECRET='secret_key or you can use rsa to generate secret key'

```

最后，在 `POSTMAN` 中使用 `application.json` 向 `/api/register` 发起 `POST` 请求

```json
{
  "email": "d.buaoc@ksod.lb",
  "name": "Maria Walker",
  "password": "123456",
  "avatarUrl": "http://dummyimage.com/120x60"
}

// 返回结果 中没有密码
{
    "id": 1,
    "email": "d.buaoc@ksod.lb",
    "name": "Maria Walker",
    "avatarUrl": "http://dummyimage.com/120x60"
}
```
