---
created: 2024-08-02
modified: 2024-08-03
tags:
  - 💎
aliases: 
parents: 
title: 
---
>[!caution]
>今後Quartzがバージョンアップすると、この方法では正常に動かなくなる可能性があります。実施する場合は、自己責任でお願いいたします。

Quartz v4において、メモの作成日と最終修正日の両方をページに表示する方法。  
ここでは、以下のファイルのコードを変更する。
- `quartz/plugins/transformers/lastmod.ts`
- `quartz/i18n/locales/definition.ts`
- `quartz/i18n/locales/ja-JP.ts`
- `quartz/components/ContentMeta.tsx`

なお、この方法はDiscordのQuartz Communityにて、AlperenAbi氏が紹介していた方法を参考にして、大幅にアレンジしたものである。

>[!info] 事前に`quartz.config.ts`で設定すること ^locale
>- `locale`
>	- 表示したい言語に設定する（私の場合は`"ja-JP"`）
>- `Plugin.CreatedModifiedDate`の`priority`
>	- `"frontmatter"`を先頭にする
>
>```json
>configuration: {
>	...
>	locale: "ja-JP",
>	...
>},
>plugins: {
>	transformers: [
>		...
>		Plugin.CreatedModifiedDate({
>			priority: ["frontmatter", "filesystem"],
>		}),
>		...
>	]
>}
>```

## 作成日と更新日を読み取る処理を追加（任意）
私はメモの作成日と最終更新日を、[[🧰Obsidian]]のプロパティで管理している。それぞれ`created`と`modified`という独自のプロパティだ。  
しかし、Quartzには独自プロパティから日付を読み取る処理がない。（もしかしたらあるかもしれないが、見当たらなかった）  

そこで、新しく`created`と`modified`プロパティを読み取る処理を追加する。  
（独自プロパティで管理していない場合は追加しなくていいと思う。なのでこの過程は任意としている）

`quartz/plugins/transformers/lastmod.ts`にある`markdownPlugins()`のelse if文内に、以下の行を付け加える。
```ts
if (source === "filesystem") {
	...
} else if (source === "frontmatter" && file.data.frontmatter) {
	...
	// YAMLにある"created"の日付を読み取る
	created ||= file.data.frontmatter["created"] as MaybeDate
	...
	// YAMLにある"modified"の日付を読み取る
	modified ||= file.data.frontmatter["modified"] as MaybeDate
	...
}
```

## 独自のメタデータを追加する
### `definition.ts`に追記
`quartz/i18n/locales/definition.ts`の`contentMeta`に以下の2行を書き加える。
```ts
contentMeta: {
  ...
  // 作成日と最終更新日の項目を追加する
  createdDate: (variables: { date: string }) => string
  modifiedDate: (variables: { date: string }) => string
}
```

### `ja-JP.ts`に追記
[[💎Quartz v4で作成日と更新日を両方表示する#^locale|Quartzのコンフィグで設定したlocale]]と同じファイルに追記する。私の場合は`ja-JP.ts`である。

`quartz/i18n/locales/ja-JP.ts`の`contentMeta`に以下の2行を書き加える。
```ts
contentMeta: {
  ...
  // 作成日と最終更新日の項目を追加する
  createdDate: ({ date }) => `作成日: ${date}`,
  modifiedDate: ({ date }) => `更新日: ${date}`,
},
```

##  `lastmod.ts`で得た最終更新日を取り込む
`quartz/components/ContentMeta.tsx`にある`ContentMetadata()`のif文内を以下のコードに書き換える。

```ts
if (fileData.dates) {
	// 従来のコードはコメントアウトするか削除する
	// segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))

	// 作成日を取り込む
	const createdDate = i18n(cfg.locale).components.contentMeta.createdDate({
	  date: formatDate(fileData.dates.created!, cfg.locale),
	})
	segments.push(createdDate);
	// 最終更新日を取り込む
	const modifiedDate = i18n(cfg.locale).components.contentMeta.modifiedDate({
	  date: formatDate(fileData.dates.modified!, cfg.locale),
	})
	segments.push(modifiedDate)
}
```

以上、計4つのファイルを書き換えることで、ページ上部に作成日と更新日を並べて表示することができる。