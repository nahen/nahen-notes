---
created: 2026-03-07
modified: 2026-03-07
tags:
  - 🦾
aliases:
parents:
title:
---
Arcブラウザの閲覧履歴を保存しているDBから閲覧履歴を抽出して、CSVに出力するバッチファイル。履歴は今日のぶん。

```
#!/bin/zsh
# スクリプトが置かれているディレクトリを取得
DIR="$(cd "$(dirname "$0")" && pwd)"
DB_PATH="$HOME/History_temp"
OUT_PATH="$HOME/result.csv"

cp -f "$HOME/Library/Application Support/Arc/User Data/Default/History" "$DB_PATH"

if [ ! -f "$DB_PATH" ]; then
    echo "エラー: $DB_PATH が見つかりません。"
    exit 1
fi

sqlite3 "$DB_PATH" <<EOF
.mode csv
.headers on
.output "$OUT_PATH"
select urls.id, datetime(visits.visit_time/1000000-11644473600,'unixepoch','localtime') as visit_time, urls.title, urls.url from visits left join urls on visits.url = urls.id where date(visits.visit_time/1000000-11644473600, 'unixepoch', 'localtime') = date('now', 'localtime') order by visits.id desc;
.exit
EOF
echo "完了しました。 $OUT_PATH を確認してください。"
```

## 参考
- [Google Chromeの閲覧履歴をエクスポートする(Windows, Mac対応) #SQLite3 - Qiita](https://qiita.com/MURAMASA2470/items/d081e71d79c4dc36671e)
	- ArcはChroniumが元なので、ファイル配置もDB構成もChromeと同じ
- [ヒアドキュメント - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%92%E3%82%A2%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)