---
created: 2026-03-28
modified: 2026-03-28
tags:
  - 📝
aliases:
parents:
title:
---
>[!memo] [Problem 6](https://projecteuler.net/problem=6) 「二乗和の差」
>最初の10個の自然数について, その二乗の和は,
>$$ 1^2+ 2^2 + ... + 10^2 = 385 $$
>最初の10個の自然数について, その和の二乗は,
>$$ (1 + 2 + ... + 10)^2 = 3025 $$
>これらの数の差は 3025 - 385 = 2640 となる.
>
>同様にして, 最初の100個の自然数について二乗の和と和の二乗の差を求めよ.

素直にループをぶん回せば解決できそうだが……。

## 学んだこと
- 規則性が見えたら、数学的に解けないか疑え
- 等差数列の和の公式
	- $\frac{1}{2}n(n+1)$
- 二乗の和の公式
	- $\frac{1}{6}n(n+1)(2n+1)$

## 自分が書いたコード
- 解決はしているが、問題の意図をつかめていない
-  $O(n)$
	- n = 1億以上になると時間がかかる

```racket
;; sum-square-diff : Number -> Number
;; 各数の和の二乗から、各数の二乗の和を引いた値を求める
(define (sum-square-diff n)
  (define (square-sum n)
    (let* ([lst (in-range 1 (add1 n))]
           [s (for/sum ([i lst]) i)]
           [sq (* s s)])
      sq))
  (define (sum-square n)
    (let* ([lst (in-range 1 (add1 n))]
           [s (for/sum ([i lst]) (* i i))])
      s))
  
  (- (square-sum n) (sum-square n)))
```

## Geminiによる改善案
- 等差数列の和の公式、二乗の和の公式を導入
	-  $O(1)$ 
		- n=1億以上でも瞬殺

```racket
;; sum-square-diff : Number -> Number
;; 各数の和の二乗から、各数の二乗の和を引いた値を求める
(define (sum-square-diff n)
  (define (square-of-sums n)
    (sqr (/ (* n (+ n 1)) 2)))
  (define (sum-of-squares n)
    (/ (* n (+ n 1) (+ (* n 2) 1)) 6))
  
  (- (square-of-sums n) (sum-of-squares n)))
```

## 参考
- [Project Euler Problem 6: Sum Square Difference \| Grae](https://www.grae.io/post/euler_problem_6/)