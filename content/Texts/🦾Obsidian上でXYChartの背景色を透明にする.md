---
created: 2024-12-21
modified: 2024-12-21
tags:
  - 🦾
aliases: 
parents: "[[🗺️040_ObsidianMOC]]"
title: 
---
Obsidian上で[[🧰Mermaid]]のXYChart（棒グラフなど）を表示すると、背景色が白に近い灰色になる。どうやら背景色はこの白色がデフォルトらしい。私はObsidianをダークモードで使っているので、このままだとグラフの文字も背景色も白くなり、見づらいことこの上ない。

幸いなことに、Obsidian Forumにてharr氏が対応策を残してくれていた。以下の内容を含んだCSSファイルを新規作成して、Obsidianの`~/.obsidian/snippets/`フォルダに入れればOK。
```css
.mermaid svg[aria-roledescription="xychart"] {
  background-color: var(--color-black);
    
  & g.main rect.background {
    opacity: 0;
  }
}
```

## 参考
- [CSS to change the background colour of XY chart from mermaid.js - Help - Obsidian Forum](https://forum.obsidian.md/t/css-to-change-the-background-colour-of-xy-chart-from-mermaid-js/86375/9)