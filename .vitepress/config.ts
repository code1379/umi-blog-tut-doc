import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "@vue/theme";
import baseConfig from "@vue/theme/config";

import { version } from "../package.json";

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  title: "UmiBlog",
  description: "Learn Umi",
  srcDir: "src",
  themeConfig: {
    logo: "/logo.svg",
    outlineTitle: "页面概览",
    sidebar: {
      "/guide/": [
        {
          text: "开始",
          // collapsible: true,
          items: [
            { text: "快速上手", link: "/guide/getting-started" },
            { text: "准备工作", link: "/guide/preparation" },
            { text: "实现API路由", link: "/guide/api-routes" },
          ],
        },
      ],
    },
    nav: [
      {
        text: "Guide",
        link: "/guide/what-is-vitepress",
        activeMatch: "/guide/",
      },
      {
        text: "Configs",
        link: "/config/introduction",
        activeMatch: "/config/",
      },
      {
        text: version,
        items: [
          {
            text: "Changelog",
            link: "https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md",
          },
          {
            text: "Contributing",
            link: "https://github.com/vuejs/vitepress/blob/main/.github/contributing.md",
          },
        ],
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-present Guo Yuan",
    },
  },
});
