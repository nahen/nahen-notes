---
created: 2026-07-30
modified: 2026-08-04
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 46](http://projecteuler.net/problem=46) 「もうひとつのゴールドバッハの予想」
> Christian Goldbachは全ての奇合成数は平方数の2倍と素数の和で表せると予想した.
> $$
> \begin{align}
> 9 = 7 + 2\times1^2\\
> 15 = 7 + 2\times2^2\\
> 21 = 3 + 2\times3^2\\
> 25 = 7 + 2\times3^2\\
> 27 = 19 + 2\times2^2\\
> 33 = 31 + 2\times1^2
> \end{align}
> $$
> 後に, この予想は誤りであることが分かった.
> 
> 平方数の2倍と素数の和で表せない最小の奇合成数はいくつか?

素直にやるなら、以下の手順になるか？
- あらかじめ素数のテーブルを作る
- 奇数 $m$ をfor文でループさせる（ただし素数は除く）
	- 自然数 $n$ を $1 \leq n \leq \sqrt{\frac{m}{2}}$ でループさせる(`for/or`)
		-  $m - 2n^2$ が素数かどうか判定する
			- 素数であれば不適なので、次の奇数 $m + 1$ へ
	-  すべての $m-2n^2 (1 \leq n \leq \sqrt{\frac{m}{2}}$) が素数でなければ、 $m$ が答え

## 学んだこと
- 

## 自分が書いたコード
- [[📝エラトステネスの篩]]で素数テーブルを作る
	- 上限値は10万
- 自然数 n のループから 奇数`2n-1`を作る
	- その奇数が平方数の2倍と素数の和で表すことができるか確認する

```racket
(define (solve-46)
  ;; prime-table: Natural -> (vectorof Boolean)
  ;; 素数判定のBoolean配列を出力する(limitが上限)
  (define prime-table
    (let* ([LIMIT 100000]
           [v (make-vector LIMIT #t)])
      (define (not-prime! n) (vector-set! v n #f))
      (define (prime? n) (vector-ref v n))
      ;; 0と1は素数でないので除外
      (not-prime! 0)
      (not-prime! 1)
  
      (for* ([i (in-range 2 (add1 (integer-sqrt LIMIT)))]
             #:when (prime? i)
             [j (in-range (* i i) LIMIT i)])
        (not-prime! j))
      v))
 
  (define (prime? n)
    (vector-ref prime-table n))

  ;; 最小の奇合成数は 9(=2*5-1) なので、自然数 n は 5 から始める
  (for/first ([n (in-naturals 5)]
              #:do [(define odd (- (* 2 n) 1))]
              #:when (not (prime? odd))
              ;; 平方数の2倍と素数の和で表せるか確認する
              #:do [(define not-available?
                       (not
                        (for/or ([i (in-range (integer-sqrt (quotient odd 2)) 0 -1)]
                                #:do [(define odd-2ii (- odd (* 2 i i)))])
                         (prime? odd-2ii))))]
              #:when not-available?)
        odd))
```

## LLMによる改善案
- 

```racket

```

## 参考
- 