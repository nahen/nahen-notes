---
created: 2026-06-08
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 32](http://projecteuler.net/problem=32) 「パンデジタル積」
> すべての桁に 1 から n が一度だけ使われている数をn桁の数がパンデジタル (pandigital) であるということにしよう: 例えば5桁の数 15234 は1から5のパンデジタルである.
> 
> 7254 は面白い性質を持っている. 39 × 186 = 7254 と書け, 掛けられる数, 掛ける数, 積が1から9のパンデジタルとなる.
> 
> 掛けられる数/掛ける数/積が1から9のパンデジタルとなるような積の総和を求めよ.
> 
> ヒント: いくつかの積は, 1通り以上の掛けられる数/掛ける数/積の組み合わせを持つが1回だけ数え上げよ.

1〜9までの数字を1回ずつ使って、成立する掛け算の式を作る。その上で、掛け算の積をすべて足し合わせる。1〜9を並べ替えてできる組み合わせは、 $9!=362880$ 通り。そこから成立する掛け算の組み合わせをどうやって抽出するか。

探索範囲を刈り取ることはできそう。たとえば、1ケタ同士の掛け算の積はどう足掻いても7ケタにならない。同じく、2ケタ同士の掛け算の積も、5ケタにはならない。
この調子で調べていくと、1〜9をつなぎ合わせてできる数字の組み合わせで、掛け算の式が成立するのは以下の場合しかないことがわかる。

- （掛けられる数のケタ, 掛ける数のケタ）= 積のケタ
	- (1, 4) or (4, 1) = 4
	- (2, 3) or (3, 2) = 4

他にも、「掛けられる数・掛ける数の下一ケタに1はあり得ない」といった刈り取りもあるが、条件が複雑になりそうなので無視する。

あとは、掛け算の式がパンデジタルかを判定する式を作る。9文字の文字列に1〜9がすべて存在するか、でいいのか？

## 学んだこと
- 問題文をよく読め
	- _いくつかの積は, 1通り以上の掛けられる数/掛ける数/積の組み合わせを持つが1回だけ数え上げよ._
- 出力される結果もよく確認しろ

## 自分が書いたコード
- (1, 4)or(4, 1)と、(2, 3)or(3, 2)とで場合分けして、パンデジタルとなる掛け算を探索する
- 積を集合（`set`）に加えていき、最後に足し合わせる
	- 「集合使わなくてよくね？」と思っていたが、使わざるを得なかった
	- 掛ける数と掛けられる数が異なるのに同じ積になる組み合わせが存在した
		- $18 \times 297 = 5346$
		-  $27 \times 198 = 5346$

```racket
;; solve-32: -> (listof (listof Natural))
;; パンデジタルとなる掛け算を抽出して、その積の総和を出力する
(define (solve-32)
  (define (pandigital-products multiplicands multipliers)
    (for*/set ([i multiplicands]
                [j multipliers]
                #:when (pandigital?
                        (string-append (number->string i) (number->string j) (number->string (* i j)))))
      (* i j)))
  
  (define 1-4-digits-products
    (pandigital-products (in-range 2 10) (in-range 1234 9877)))

  (define 2-3-digits-products
    (pandigital-products (in-range 12 99) (in-range 123 988)))

  (apply + (set->list (set-union 1-4-digits-products 2-3-digits-products))))
```

## LLMによる改善案
- `#:do`を使って、積の再計算を防ぐ
	- ループ中で定数が使えるようになる
- 説明変数の追加
- `(apply + list)`より`(for/sum ([i list]))`のほうが読みやすいらしい？

```racket
(define (solve-32)
  (define (pandigital-products multiplicands multipliers)
    (for*/set ([i multiplicands]
               [j multipliers]
               #:do [(define p (* i j))
                     (define digits
                       (string-append
                        (number->string i)
                        (number->string j)
                        (number->string p)))]
               #:when (pandigital? digits))
      p))
  
  (define 1-4-digits-products
    (let ([1-digits-range (in-range 2 (add1 9))]
          [4-digits-range (in-range 1234 (add1 9876))])
      (pandigital-products 1-digits-range 4-digits-range)))

  (define 2-3-digits-products
    (let ([2-digits-range (in-range 12 (add1 98))]
          [3-digits-range (in-range 123 (add1 987))])
      (pandigital-products 2-digits-range 3-digits-range)))

  (define products
    (set-union 1-4-digits-products 2-3-digits-products))
  
  (for/sum ([p (in-set products)]) p))
```
