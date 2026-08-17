---
created: 2026-08-04
modified: 2026-08-04
tags:
  - 🦾
aliases:
parents:
title:
---
> [!tldr] 説明はいいからCSSだけ教えて
> ```scss
> tbody, article p:not(.callout p, .footnotes p) {
>     margin-block: 1.5rem;
> }
> 
> tbody, li, p {
>     line-height: 1.85rem;
> }
> 
> .explorer-content ul li > a,
> .explorer-content .folder-container div > a,
> .explorer-content .folder-container div > button span,
> .backlinks > ul > li > a,
> .toc ul li > a {
>     display: block;
>     line-height: 1.4rem;
>     padding-top: 0.2rem;
>     padding-bottom: 0.2rem;
>     overflow-wrap: anywhere;
> }
> ```

## 行間が狭いので広げる
[[🧰Quartz]]のデフォルトCSSは、行の高さ(`line-height`)を`1.6rem`に設定している。これは英文を読むには最適な行間だが、日本語には少し狭く感じる[^1]。

このサイトでは本文の行の高さを少し増やして、`1.85rem`に設定している。

```scss
tbody, li, p {
	line-height: 1.85rem;
}
```

## 追加のカスタムCSS
これで設定完了と言いたいところだが、行の高さを調整すると、今度は別の部分が不自然になってしまう。なので、不自然になってしまった2点、「段落間の余白」と「サイドバーの一覧」の2つを修正する。

### 段落間の余白を広げる
行の高さを広げたら、行間と段落間の余白が同じ高さになってしまった。これでは行間と段落間の区別がつきづらい。なので、`p`の段落と段落の間に新しく`margin-block`を追加する。`1.5rem`ぐらいにしておくと、行間と段落間の区別がつきやすく感じる。

ただ、考えなしに`article`内の`p`に適用したら、コールアウトや脚注に余分な余白が生まれてしまった。なので`:not()`でそれらの`p`は除外している。

```scss
tbody, article p:not(.callout p, .footnotes p) {
    margin-block: 1.5rem;
}
```

### サイドバーのリンクテキストの行間を狭める
行の高さを広げたら、サイドバーにあるリンクテキストが読みづらくなってしまった。サイドバーは幅が狭いため、長すぎるリンクテキストは折り返されて複数行で表示される。ところが、この折り返した行の行間とリスト間の余白が同じ高さになってしまい、見づらくなってしまった。

そこで、サイドバーやバックリンクに限って、別のCSSを適用する。複数行をまたぐリンクテキストは、その行間を`1.4rem`に狭める。そして、文章間の余白も狭めるため、`padding-top`と`padding-bottom`を`0.2rem`に設定している。

```scss
.explorer-content ul li > a,
.explorer-content .folder-container div > a,
.explorer-content .folder-container div > button span,
.backlinks > ul > li > a,
.toc ul li > a {
    display: block;
    line-height: 1.4rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
}
```

[^1]: モリサワのnote記事[『行と行のアキは必要？ 行間や行送りの基本』](https://note.morisawa.co.jp/n/n2b06edcb3a45#:~:text=%E5%B0%8F%E8%AA%AC%E3%81%AA%E3%81%A9%E3%81%AE,%E3%81%99%E3%81%8F%E3%81%AA%E3%82%8A%E3%81%BE%E3%81%99%E3%80%82) によると、小説などの長い文章では行間を75〜100%空けると読みやすくなるという。
