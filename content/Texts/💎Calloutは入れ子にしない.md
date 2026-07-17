---
created: 2024-12-16
modified: 2024-12-16
tags:
  - 💎
aliases: 
parents: "[[🧰Quartz]]"
title: 
---
[[🧰Obsidian]]で使える機能の中に、[[💎Callout]]がある。特定の文章を四角で囲むことで、その文章を目立つようにできる機能だ。また、ObsidianではCalloutを入れ子にすることができる。つまり、Calloutの中にCalloutを書くこともできる。

しかし、2024年12月時点の[[🧰Quartz]]では、Calloutを入れ子にすると表示が不安定になる。たとえば、内側のCalloutの文中でリンクを作成すると、そのリンクがなぜか内側のCalloutのタイトルだと認識されてしまう不具合がある。[^invalid]

[^invalid]: [Invalid callout title on nested callouts with links and footnotes · Issue #1647 · jackyzha0/quartz · GitHub](https://github.com/jackyzha0/quartz/issues/1647)

この不具合は2024年12月現在ですでに報告されており、有志が解決に向けて動いている。[^parser]気長に待とう。

[^parser]: [Markdown Parser Rework by saberzero1 · Pull Request #1496 · jackyzha0/quartz · GitHub](https://github.com/jackyzha0/quartz/pull/1496)
