---
created: 2026-06-12
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 34](http://projecteuler.net/problem=34) 「桁の階乗」
> 145は面白い数である. 1! + 4! + 5! = 1 + 24 + 120 = 145となる.  
> 各桁の数の階乗の和が自分自身と一致するような数の和を求めよ.
> 
> **注:** 1! = 1 と 2! = 2 は総和に含めてはならない.

[[Problem 33 - 桁消去分数|問題33]]に続いて、また面白い数ですか。使う階乗は1桁の数字のものだけ、つまり以下の10つだけになる。

- 0! = 1
- 1! = 1
- 2! = 2
- 3! = 6
- 4! = 24
- 5! = 120
- 6! = 720
- 7! = 5040
- 8! = 40320
- 9! = 362880

9!は6桁の数字なので、探索範囲の上限値はおそらく7桁までになる。9,999,999は7x9! (= 2,540,160)よりも大きいからだ。あとは、以下の関数を作れば最低限の処理はできそう。

- 数字を桁ごとに分解する関数
- 数字を階乗に置き換える関数
- 階乗の和が自分自身と一致するか判定する関数

ただ、そのままだとループをおよそ1000万回繰り返さないといけなくなる。探索範囲をもっと刈り込む必要がある。

## 学んだこと
- 前提条件は

## 自分が書いたコード
- 素直にループを1000万回近く繰り返して算出
	- 実行完了まで15秒近くかかっていて良くない
	- 探索範囲をもっと刈り込めるはずだが思いつかない

```racket
;; single-digit-list: Natural -> (listof Natural)
;; 数字を桁ごとに分解する
(define (single-digit-list num)
  (define (loop n acc)
    (cond [(> 10 n) (cons n acc)]
          [else
           (let-values ([(q r) (quotient/remainder n 10)])
             (loop q (cons r acc)))]))
  
  (loop num '()))

;; factorial-table: Natural[0, 9] -> Natural
;; 一桁の数字を階乗に置き換える（テーブル参照）
(define (factorial n)
  (define v (vector 1 1 2 6 24 120 720 5040 40320 362880))
  (vector-ref v n))

;; sum-factorial: Natural -> Natural
;; 各桁の数の階乗の和を求める
(define (sum-factorial num)
  (for/sum ([d (single-digit-list num)])
    (factorial d)))

;; solve-34: -> (listof Natural)
;; 各桁の数の階乗の和が自分自身と一致するような数を求める
(define (solve-34)
  (for/list ([i (in-range 3 10000000)]
             #:when (= (sum-factorial i) i))
    i))
```

## LLMによる改善案
- 

```racket

```

## 参考
- 