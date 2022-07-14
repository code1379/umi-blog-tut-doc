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
    sidebar: [
      {
        text: "开始",
        // collapsible: true,
        items: [
          { text: "简介", link: "/introduction" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
    ],
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
  },
});
