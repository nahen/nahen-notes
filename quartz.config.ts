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
    baseUrl: "nahen.github.io/nahen-notes",
    ignorePatterns: ["Private", "Templates", "Daily", "Excalidraw", ".obsidian"],
    defaultDateType: "created",
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
          light: "#F2F2F2",
          lightgray: "#cccccc",
          gray: "#98A2B3",
          darkgray: "#4D4D4D",
          dark: "#333333",
          secondary: "#197A4B",
          tertiary: "#71C598",
          highlight: "rgba(0, 102, 190, 0.10)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#1a1a1a",
          lightgray: "#4d4d4d",
          gray: "#7f7f7f",
          darkgray: "#cccccc",
          dark: "#e6e6e6",
          secondary: "#71C598",
          tertiary: "#197A4B",
          highlight: "rgba(0, 102, 190, 0.30)",
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
