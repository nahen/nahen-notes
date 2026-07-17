---
created: 2025-10-04
modified: 2025-10-04
tags:
  - 💎
aliases:
parents: "[[🗺️040_ObsidianMOC]]"
title:
---
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">all your base are belong to *you* <a href="https://t.co/8FWJz5IxEU">https://t.co/8FWJz5IxEU</a></p>&mdash; kepano (@kepano) <a href="https://twitter.com/kepano/status/1925211484424122497?ref_src=twsrc%5Etfw">May 21, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Obsidian上でリレーショナル・データベース[^2]を作る機能。端的にいえば、Obsidianのコミュニティ・プラグインである[[💎DataView]]の公式版。2025年5月に早期アクセス版で先行公開、同年8月に一般に公開された。

データベースを作る機能と紹介したが、Vault内の検索結果を表示する機能というほうが正しい。Vault内のすべてのファイルから、検索条件やフィルタに当てはまるファイルを一覧で表示する。

## baseファイルの構造
Basesファイルは`.base`拡張子で作られる。`.base`ファイルには、設定した検索条件やフィルタが[[📝YAML]]形式で書かれている。

### filters（フィルタ）
一覧に表示するファイルを絞り込むための条件。たとえば、特定のタグやリンクを持つファイルだけを表示することや、特定のフォルダ内のファイルを非表示にすることができる。

### properties（プロパティ）
一覧に表示する列の項目。ファイル名やファイルの作成日・更新日、その他もろもろを表示できる。`Add Formula`で[[#formulas（数式）|数式]]を作ることもできる。

### formulas（数式）
数式の名称と式を設定することで、式の実行結果を一覧に表示する。スプレッドシートの数式に近いが、一個のセルではなく一つの列で適用される。

たとえば以下の数式を使うと、各ファイルの最終更新日からの経過日数（要するに放っとかれた日数）を一覧に表示できる。[^1]
```
file.mtime.relative()
```

### views（ビュー）
検索結果の表示方法。現在はテーブル（表）形式とカード形式の2種類のみ。

- 現在使えるビュー
	- テーブル（表）
	- カード
- 早期アクセス版のみ
	- リスト（箇条書き）
	- 地図

[^1]: 初めは`今日の日付-最終更新日`で求めていたが、[date.relative()](https://help.obsidian.md/bases/functions#%60relative()%60)だけで通用することをObsidianのヘルプを読んで知った。ドキュメントは読もう。

[^2]: 表形式で情報を管理するデータベース。おそらくデータベースの中でも主流の形式。Excelを使ったことのある人なら誰でも馴染みやすい。
