---
created: 2024-08-02
modified: 2024-12-16
tags:
  - 🗑️
aliases: 
parents: 
title: 
---
>[!error]
>2024年12月3日のQuartzの更新で、この手法は使えなくなりました。新しい手法は[[🦾Quartz v4で作成日と更新日を両方表示する（2024年12月版）]]をご覧ください。

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
Quartzには独自プロパティを読み取る処理がある。しかし、読み取った独自プロパティは文字列として扱われ、日付とは見なされない。（少なくとも私が読んだ範囲では見当たらなかった）  

そこで、新しく`created`と`modified`プロパティを日付として読み取る処理を追加する。（独自プロパティで管理していなければ、追加しなくてもいい。なのでこの過程は任意としている）

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
`quartz/i18n/locales/definition.ts`の`contentMeta`に、新しく`createdDate`と`modifiedDate`というプロパティを追加する。書き加えるのは以下の2行。
```ts
contentMeta: {
  ...
  // 作成日と最終更新日の項目を追加する
  createdDate: (variables: { date: string }) => string
  modifiedDate: (variables: { date: string }) => string
}
```

### `ja-JP.ts`に追記
[[🗑️Quartz v4で作成日と更新日を両方表示する（アーカイブ）#^locale|Quartzのコンフィグで設定したlocale]]と同じ名前のファイル（私の場合は`ja-JP.ts`）にも、同じように`createdDate`と`modifiedDate`というプロパティを追加する。ここで設定した文言がサイトに表示される。

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

以上。  
計4つのファイルを書き換えることで、ページ上部に作成日と更新日を並べて表示することができる。