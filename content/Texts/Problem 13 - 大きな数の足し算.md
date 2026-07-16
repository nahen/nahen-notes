---
created: 2026-04-15
modified: 2026-04-15
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 13](http://projecteuler.net/problem=13) 「大きな数の足し算」
> 以下の50桁の数字100個の合計の上から10桁を求めなさい。（数値は省略）

旧来の数値型を使う場合は、50桁を何桁まで簡略化するかという問題がある。ただ、今のRacketであれば50桁でも素直に足し算できると思う。

## 学んだこと
- 

## 自分が書いたコード
- 素直に足し算するだけ
	- 数字100個はリストとして宣言しておく
	- `n`は表示する桁数

```racket
(define (large-sum lst n)
  (let* ([sum (apply + lst)]
         [total-digits (string-length (number->string sum))]
         [divisor (expt 10 (- total-digits n))])
    (quotient sum divisor)))
```

## LLMによる改善案
- 対数(log)から桁数を取得
- 除数の最低値を1に設定
	- 乗数を0以上の整数にする

```racket
(define (large-sum lst n)
  (let* ([sum (apply + lst)]
         [total-digits (inexact->exact (ceiling (/ (log sum) (log 10))))]
         [divisor (expt 10 (max 0 (- total-digits n)))])
    (quotient sum divisor)))
```

## 別解
- いわゆる`long int`などを使わない場合の回答
	- 50桁の数字が格納できない場合の手法
	- 本来はこれが正解だと思う
- 合計の上10桁を知るには、各数値の上12桁〜上13桁がわかればOK
	- 100個＝ $10^2$ 個
	- ただし、合計値の10桁目以降が`9`続きでないことが前提
```racket
(define (large-sum-alt lst n)
  (define (num-digits x)
    (add1 (exact-floor (/ (log x) (log 10)))))
  (define (truncate-digits x k)
    (quotient x (expt 10 k)))
  (define carry-digits
    (exact-floor (/ (log (length lst)) (log 10))))
  (define sum
    (for/sum ([x lst])
      (define digits (num-digits x))
      (define cut (max 0 (- digits (+ n carry-digits))))
      (truncate-digits x cut)))
  (define final-cut
    (max 0 (- (num-digits sum) n)))

  (truncate-digits sum final-cut))
```

## 参考
- [Jacob Elafandi: Project Euler, Problem 13](https://math.berkeley.edu/~elafandi/euler/p13/)