---
created: 2026-05-12
modified: 2026-07-08
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
s>[!memo] [Problem 22](http://projecteuler.net/problem=22) 「名前のスコア」
> 5000個以上の名前が書かれている46Kのテキストファイル [names.txt](https://projecteuler.net/project/resources/p022_names.txt) を用いる. まずアルファベット順にソートせよ.  
> のち, 各名前についてアルファベットに値を割り振り, リスト中の出現順の数と掛け合わせることで, 名前のスコアを計算する.
>
> たとえば, リストがアルファベット順にソートされているとすると, COLINはリストの938番目にある. またCOLINは 3 + 15 + 12 + 9 + 14 = 53 という値を持つ. よってCOLINは 938 × 53 = 49714 というスコアを持つ.
>
> ファイル中の全名前のスコアの合計を求めよ.

ついにファイルの入力がきた。でもやること自体はそこまで複雑ではない。

1. テキストファイルを読み込む
2. カンマで要素を区切って5000件以上のリストにする
3. リストの末尾まで以下を繰り返す（`fold`でもよさそう）
	1. リストをアルファベット順にソートする（これで出現順が求められる）
	2. アルファベットを1文字ずつ数値に変換して、足し合わせる
	3. 名前の和に出現順を掛ける

## 学んだこと
- `(in-naturals [start])`
	- 無限に続く整数のストリームを返す
	- リストにある要素の出現順も取得したいときに便利
		- `(in-range 1 (add1 (length list))`より楽

## 自分が書いたコード
- 上記の流れを愚直に実装した
	- `foldl`でもできそうだが、`for/sum`の方がいいらしい
- `string-split`だけだと、リストの各要素に`\"`が残ってしまう
	- `string-trim`で`\"`を取り除く

```racket
;; 名前のリスト
(define CONTENT
  (map (lambda (s) (string-trim s "\""))
       (string-split (file->string "p022_names.txt") ",")))

;; alphabet-score: String -> Integer
;; 名前を1文字ずつアルファベット順での数値に変換して、足し合わせた和を出力する
(define (alphabet-score name)
  (define BASE (sub1 (char->integer #\A)))
  (for/sum ([s name])
    (- (char->integer s) BASE)))

;; names-scores: (listof String) -> Integer
;; ファイル中の全名前のスコアの合計を求める
(define (names-scores content)
  (define SORTED-CONTENT (sort content string<?))

  (for/sum ([i (in-range 1 (add1 (length SORTED-CONTENT)))]
            [name SORTED-CONTENT])
    (* i (alphabet-score name))))
```

## LLMによる改善案
- `alphabet-score`を一部修正
	- 自作版では、`A`のアスキーコードから1引いた値を足す
	- こちらでは、`A`のアスキーコードを引いた値に1を足す
		- やっていることは同じだが、こちらの方が見やすい？
- インデックスを`(in-naturals ...)`で表現
	- `(in-range 1 (add1 (length list))`より短く済むし確実

```racket
(define CONTENT
  (map (lambda (s) (string-trim s "\""))
       (string-split (file->string "p022_names.txt") ",")))

(define (alphabet-score name)
  (define A (char->integer #\A))
  (for/sum ([c name])
    (add1 (- (char->integer c) A))))

;; names-scores: (listof String) -> Integer
;; ファイル中の全名前のスコアの合計を求める
(define (names-scores content)
  (define sorted-content (sort content string<?))

  (for/sum ([i (in-naturals 1)]
            [name sorted-content])
    (* i (alphabet-score name))))
```
