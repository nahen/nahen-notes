---
created: 2026-05-20
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 25](http://projecteuler.net/problem=25) 「1000桁のフィボナッチ数」
> フィボナッチ数列は以下の漸化式で定義される:
> 
> $F_n = F_{n-1} + F_{n-2}$, ただし $F_1 = 1, F_2 = 1$.  
> 
> 最初の12項は以下である.  
> -  $F_1 = 1$
> - $F_2 = 1$
> - $F_3=2$
> - $F_4=3$
> - $F_5=5$
> - $F_6=8$
> - $F_7=13$
> - $F_8=21$
> - $F_9=34$
> - $F_{10}=55$
> - $F_{11}=89$
> - $F_{12}=144$
>
> 12番目の項, $F_{12}$ が3桁になる最初の項である.
> 
> 1000桁になる最初の項の番号を答えよ.

再帰の手本、フィボナッチ数列。素直に考えれば、フィボナッチ数列を算出しまくって1000桁になる最初の項を求めればいい。~~でももっと楽に求める方法がありそう。~~ 素直に考えた方法が一番楽だったわ。

## 学んだこと
- 数学的な漸化式に引っ張られるな
	- 数学上最適な式とプログラミングの実装で最適な式は違う
- 比較したい値が固定値なら、1度だけ算出して使え
	- 毎回比較したい値を算出するのはムダ
- ループ不変式
	- ループしても変わらない変数はループ外に出す

## 自分が書いたコード
-  $n$ をカウントアップし続けて、初めて1000桁になるフィボナッチ数を求める
	-  $\mathrm{digit}=1$ の場合の条件分岐も用意
- ややこしく書きすぎ（下記のLLMによる改善案を参照）
	- `digit?`はいらなかった
	- $\mathrm{digit}=1$ の条件分岐もいらない
		- 漸化式 $F_n = F_{n-1} + F_{n-2}$ に引っ張られすぎ

```racket
;; n-digit-fibonacci: Natural -> Natural
;; n桁になる最初のフィボナッチ数の項番号を求める
(define (n-digit-fibonacci digit)
  (define (digit? n steps)
    (define (divide-by-10-times s)
      (quotient n (expt 10 s)))
    (< 0 (divide-by-10-times (- steps 1))))
  
  (define (loop fn-1 fn-2 n)
    (let ([fn (+ fn-1 fn-2)])
      (if (digit? fn digit)
          n
          (loop fn fn-1 (+ n 1)))))
  
  (define f1 1)
  (define f2 1)

  (if (= digit 1) 1 (loop f2 f1 3)))
```

## LLMによる改善案
-   $F_n$ と一番小さい1000桁の数字（$10^{999}$）と大小比較する
	- 毎回10で割り続ける必要がないので`(digit?)`がいらない
		- 巨大数を扱えるからできる芸当
	-  $\mathrm{digit}=1$ の場合でも正しい項番号 $1$ が返ってくる

```racket
(define (euler-25 digits)
  ;; limit: digits桁の最小の値
  (define limit (expt 10 (- digits 1)))
  
  ;; fib-iter: 反復処理を行う名前付きlet
  ;; idx: 現在の項のインデックス (F_n の n)
  ;; a  : F_n の値
  ;; b  : F_{n+1} の値
  (let fib-iter ([idx 1]
                 [a 1]
                 [b 1])
    (if (>= a limit)
        idx
        (fib-iter (+ idx 1) b (+ a b)))))
```
