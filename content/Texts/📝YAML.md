---
tags:
  - 📝
aliases:
  - YAML
  - YAML Ain't Markup Language
parents: "[[🗺️040_ObsidianMOC]]"
created: 2024-07-30
modified: 2024-08-19
---

正式にはYAML Ain't Markup Language。  
訳すと「YAMLはマークアップ言語じゃねえ」。PHPと同じく再帰的な命名方法。

[[🧰Obsidian]]では、mdファイルの先頭にYAMLが記述できる。これにより、テキストファイルにメタ情報を設定できるようになる。

## パラメータ
Obsidianでは、いくつか初期パラメータが決められている。
- tag, tags（タグ） 
	- シャープをつけなくてもテキストにタグが設定できる
	- 弱い関連付けができる
- alias, aliases（エイリアス）
	- テキストファイルに別名が設定できる
	- たとえば、このテキストファイルは[[📝YAML]]でもリンクできるが、[[📝YAML|YAML Ain't Markup Language]]でもリンクできる
	- 正式名だけでなくエイリアス名でも、リンクされていないメンションが見つけられる
- cssclass,cssclasses（CSSクラス）
	- 特定のテキストファイルにだけ特別なCSSクラスが設定できるらしい？
		- 設定することはないかも
			- 見た目を変えることはたぶんないので
- publish（パブリッシュ）
	- ブーリアン型（true/false）
	- Obsidian Publishにてネット上に公開するか否かが設定できる
		- このメモ帳では特に設定することはないかも

他にも以下のパラメータを使っている。
- parents
	- 上位概念・ページ
		- パンくずリストの親みたいなもの


## テンプレート
~~いちいちYAMLを入力するのが面倒くさいので、espansoを使って「:yaml」と入力したら以下のテンプレートが出るようにした。~~  
現在はTemplaterを優先しているため、このテンプレは使用していない。
```
---
created: 2024-07-29
modified: 2024-07-29
tags: []
aliases: []
parents: []
---
```
