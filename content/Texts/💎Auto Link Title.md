---
created: 2023-11-29
modified: 2024-07-30
tags:
  - 💎
aliases: 
parents: "[[🗺️040_ObsidianMOC]]"
---
![[auto-link-title.gif|400]]

Obsidian上でURLを貼り付ける際に、自動的にWebサイトのタイトルを取得（フェッチ）して表記してくれるプラグイン。Matt Furden氏が作成。  
ObsidianにURLを貼り付ける際、URL単体よりはリンク表記にしたほうがわかりやすいので適用した。

## 機能
### 自動的にタイトルをつける
URLをそのまま貼り付けると、[GitHub - zolrath/obsidian-auto-link-title: Automatically fetch the titles of pasted links](https://github.com/zolrath/obsidian-auto-link-title)というふうに、自動的にタイトルをつけてくれる。  
タイトルのフェッチをしてほしくない時は、**Shift+Ctrl+v**、または**Shift+cmd+v**を押す。
### 生のURLにタイトルを追加する
記入済みのURLに対してカーソルを当てる。その状態で**Ctrl+Shift+e**、または**Cmd+Shift+e**を押すと、URLにタイトルをつけることができる。  
https://obsidian.md/ → [Obsidian - Sharpen your thinking](https://obsidian.md/)
### 既存のタイトルを上書きする
タイトル付きのリンクにカーソルを当てる。その状態で**Ctrl+Shift+e**、または**Cmd+Shift+e**を押すと、URLのタイトルを上書きできる。  
[これはテストです](https://obsidian.md/) → [Obsidian - Sharpen your thinking](https://obsidian.md/)

## 参考
- [GitHub - zolrath/obsidian-auto-link-title: Automatically fetch the titles of pasted links](https://github.com/zolrath/obsidian-auto-link-title)