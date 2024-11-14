import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Nahen's Notes",
    enableSPA: true,
    enablePopovers: true,
    locale: "ja-JP",
    analytics: {
      provider: "plausible",
    },
    baseUrl: "nahen.github.io/nahen-notes/",
    ignorePatterns: ["Private", "Templates", "Daily", "Excalidraw", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "",
        body: "",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#e8e4e0",
          lightgray: "#c6c1ba",
          gray: "#a49e93",
          darkgray: "#434a4e",
          dark: "#2b3135",
          secondary: "#296247",
          tertiary: "#3de88b",
          highlight: "rgba(44, 93, 134, 0.1)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#141516",
          lightgray: "#3a3f41",
          gray: "#988f81",
          darkgray: "#c8c3bc",
          dark: "#d8d5d0",
          secondary: "#77c89d",
          tertiary: "#197A4B",
          highlight: "rgba(0, 82, 152, 0.3)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
         markdownLinkResolution: "shortest",
         prettyLinks: true, 
         openLinksInNewTab: true,
        }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
