---
created: 2026-04-13
modified: 2026-04-13
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 12](http://projecteuler.net/problem=12) 「高度整除三角数」
> 三角数の数列は自然数の和で表わされ, 7番目の三角数は 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28 である. 三角数の最初の10項は:  
> $$ 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...$$
> となる.
>
> 最初の7項について, その約数を列挙すると, 以下のとおり.
>
>  **1:** 1  
>  **3:** 1,3  
>  **6:** 1,2,3,6  
> **10:** 1,2,5,10  
> **15:** 1,3,5,15  
> **21:** 1,3,7,21  
> **28:** 1,2,4,7,14,28
>
> これから, 7番目の三角数である28は, 5個より多く約数をもつ最初の三角数であることが分かる.
>
> では, 500個より多く約数をもつ最初の三角数はいくつか.

1. 三角数 $n$ を求める
2.  $\sqrt{n}$ 以下の自然数で、 $n$ を割り切れるもの（約数）の個数を求める
    （かつ商と徐数が異なる場合は+2）
3. 約数の個数が500より多ければ、その三角数 $n$ が答え
4. そうでない場合は、1に戻る（次は $n+1$ ）

## 学んだこと
- 約数の個数は素因数分解で求められる
	- 知らなかった
- 三角数は $\frac{n(n+1)}{2}$ で表せる
	- 「1〜nの和」になんで気づかなかったんだろう
- 連続する数 $n, n+1$ は1以外に共通の分母をもたない
	- $n, n+1$ は互いに素
	- この場合、$n(n+1)$ の約数＝ ($n$ の約数) × ($n+1$ の約数)
		- なんだその性質は
## 自分が書いたコード
- 三角数 $n$ を1〜$\sqrt{n}$で割っていって、見つけた約数の個数を合計する
	- $i^2 = n$ なら約数+1
	- $i^2 \neq n$ かつ$\mod(n/i) = 0$ なら約数+2
- ひとまず答えの出力はできる
	- 約数が500個の三角数を求めるのにえらく時間がかかる

```racket
;; high-divisible-tri-num : Number -> Number
;; 約数の個数がcount以上となる最初の三角数を出力する
(define (high-divisible-tri-num count)
  ;; sqrt{n}以下の自然数のうち、割り切れる自然数の個数を求める
  (define (divisor-count n)
    (define (n-squared? i)
      (= (expt i 2) n))
  
    (for/sum ([i (in-range 1 (add1 (integer-sqrt n)))]
              #:when (zero? (modulo n i)))
      ;; iの2乗がnの場合、約数の個数は1。そうでなければ2。
      (if (n-squared? i) 1 2)))
  
  (define (loop tri-num acc)
    (if (>= (divisor-count tri-num) count)
        tri-num
        (loop (+ tri-num acc) (add1 acc))))

  (loop 1 2))
```

## LLMによる改善案
- 三角数 $n$ をふたつの整数に分ける
	-  $n$ が奇数なら、$n, \frac{n+1}{2}$
	-  $n$ が偶数なら、$\frac{n}{2}, n+1$
- おのおのの整数で、約数の個数を求める
	-  求めた約数の個数はハッシュテーブルに保存して再利用する
		- `(整数, 約数の個数)`のセット
- 約数の積が三角数 $n$ の積となる

```racket
(define (solve limit)
  ;; --- メモ化テーブル ---
  (define divisor-cache (make-hash))

  ;; --- 素因数分解ベースの約数個数 ---
  (define (num-divisors n)
    (hash-ref! divisor-cache n
      (lambda ()
        (define (count-factor n p)
          (define (loop n count)
            (if (zero? (modulo n p))
                (loop (/ n p) (add1 count))
                (values n count)))
          (loop n 0))

        (define (iter n p result)
          (cond
            [(= n 1) result]
            [(> (* p p) n)
             (* result 2)]
            [else
             (define-values (n2 count) (count-factor n p))
             (if (> count 0)
                 (iter n2 (next-p p) (* result (add1 count)))
                 (iter n (next-p p) result))]))

        (define (next-p p)
          (if (= p 2) 3 (+ p 2)))

        (iter n 2 1))))

  ;; --- 三角数の約数数(分解利用) ---
  (define (tri-divisors n)
    (if (even? n)
        (* (num-divisors (/ n 2))
           (num-divisors (add1 n)))
        (* (num-divisors n)
           (num-divisors (/ (add1 n) 2)))))

  ;; --- メインループ ---
  (define (loop n)
    (if (>= (tri-divisors n) limit)
        (/ (* n (add1 n)) 2)
        (loop (add1 n))))

  (loop 1))
```

## 参考
- [約数の個数の公式と平方数の性質 \| 高校数学の美しい物語](https://manabitimes.jp/math/903)