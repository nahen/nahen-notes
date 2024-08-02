---
created: 2023-11-30
modified: 2024-07-30
tags:
  - 💎
aliases: 
parents: 
---
Obsidianの保管庫内およびメモをデータベースと見立てて、該当する情報をもつノートを絞り込んで表示するプラグイン。端的にいうとObsidianのSQLクエリ検索。  
MarkDownフロントマッター（[[📝YAML]]）など、メモのメタデータが検索対象になる。
## 使い方
クエリは基本的に以下の構文にのっとる。便宜上、先頭行のdataviewを全角表記にしている。QUERY-TYPEのみ必須。
```ｄａｔａｖｉｅｗ
<QUERY-TYPE> <fields>
FROM <source>
<DATA-COMMAND> <expression>
<DATA-COMMAND> <expression>
          ...
```

## クエリタイプ
### LIST（リスト）
クエリに一致するノートから箇条書きで書かれた行を抽出する。
### TASK（タスク）
クエリに一致するノートからチェックボックスで書かれた行を抽出する。
### CALENDAR（カレンダー）
月次のカレンダーをノート上に生成する。クエリに一致するノートの個数は各日付のドットの個数で表される。
### TABLE（テーブル）
クエリに一致するノートを表形式で表示する。人物の生年月日やノートの作成日時など、メタデータ内で比較を行いたい場合に使う。

## 注意
DataViewはObsidianでの使用に特化したプラグインである。そのため、Obsidian以外のエディタにおいて、DataViewのクエリは意味不明な呪文にしかならない。マークダウンテキストの互換性を保ちたい場合は、DataViewを使う場面を控えめにしたほうがいい。

## 参考
- [GitHub - blacksmithgu/obsidian-dataview: A high-performance data index and query language over Markdown files, for https://obsidian.md/.](https://github.com/blacksmithgu/obsidian-dataview)
- [Dataview](https://blacksmithgu.github.io/obsidian-dataview/)