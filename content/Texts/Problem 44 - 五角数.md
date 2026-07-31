---
created: 2026-07-22
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 44](http://projecteuler.net/problem=44) 「五角数」
> 五角数は $P_n = n(3n-1)/2$ で生成される. 最初の10項は
> 
> 1, 5, 12, 22, 35, 51, 70, 92, 117, 145, ...
> 
> である.
> 
> $P_4 + P_7 = 22 + 70 = 92 = P_8$ である. しかし差 70 - 22 = 48 は五角数ではない.
> 
> 五角数のペア $P_j$ と $P_k$ について, 差と和が五角数になるものを考える. 差を $D = \lvert P_k - P_j \rvert$ と書く. 差 D の最小値を求めよ.

ラクにクリアーできると高を括っていたら、恐ろしく難産だった。

五角数とは、正五角形の形に点を並べたときの全ての点の個数を表すらしい。探索空間の上限は、$D = \lvert P_k - P_k-1 \rvert$  が現在の $D$ の最小値を超えたときになる。

整数 $x$ が五角数かどうかを判定したい。まずは以下が成り立つとする。
 $x = \frac{n(3n-1)}{2}$
 
  $n$ の二次方程式に変形したうえで、二次方程式の解の公式を当てはめる。（ただし n > 0、 x > 0）
 $3n^2 - n - 2x = 0$
 $n = \frac{-(-1)+\sqrt{(-1)^2-4\cdot3\cdot(-2x)}}{2\cdot3}$
 $n = \frac{1+\sqrt{24x + 1}}{6}$

つまり以下の2つを満たしていれば、 $x$ は五角数と言える。
- $24x+1$ が平方数である
- $1+\sqrt{24x+1}$ が 6 で割り切れる
	- もしくは、 $\sqrt{24x+1}$ を 6で割った余りが5である、とも言える

とすると、以下を作ればいいのか？
- 値が五角数かどうかを判定する関数
	- 値が平方数かどうかを判定する関数

%%
以下は、私が数学的に解こうとして迷走しまくったもの。

$P_k + P_j$ が五角数になる条件は、
$k(3k-1)+j(3j-1) = n(3n-1)$
$3k^2-k + 3j^2-j = 3n^2-n$
$3k^2-k + 3j^2-j -3n^2 + n = 0$

ここで n の二次方程式に変形する。
$3n^2 - n - (3k^2 + 3j^2 - k - j) = 0$
$3n^2 - n - (3(k^2+j^2) - (k + j))$ = 0
$3n^2 - n - (3(k+j)^2 - (k + j) - 6kj)$ = 0

二次方程式の解の公式（ただし n > 0、k > j >0）より、
$n = \frac{1 + \sqrt{1+4 \cdot 3 \cdot \left( 3(k+j)^2 - (k + j) - 6kj\right)}}{2 \cdot 3}$
$n = \frac{1 + \sqrt{36k^2 + 36j^2 - 12k  -12j + 1}}{6}$

ここで、$36k^2 - 12k + 1 = (6k-1)^2$  および $36j^2 - 12j = (6j-1)^2-1$ より、
$n = \frac{1 + \sqrt{(6k-1)^2 + (6j-1)^2 - 1}}{6}$

つまり、$(6k-1)^2 + (6j-1)^2-1 = (6n-1)^2$ となる $j, k$ の組み合わせを求めれば、 $P_k + P_j = P_n$ となる $n$ が求められる。

次に、差が五角数となる条件を知りたい。
$P_k - P_j$が五角数となる条件は、
$k(3k-1) - j(3j-1) = m(3m-1)$
$3(k^2-j^2) - (k-j) = 3m^2 - m$

ここで、mの二次方程式に変形する。
$3m^2 - m - (3(k^2 - j^2) -(k-j)) = 0$

二次方程式の解の公式（ただし m > 0、k > j >0）より、
$m = \frac{1 + \sqrt{1+12 \cdot \left( 3(k^2-j^2) - (k - j)\right)}}{6}$
$m = \frac{1 + \sqrt{36k^2 - 36j^2 - 12k + 12j+1}}{6}$
ここで、$36k^2 - 12k + 1 = (6k-1)^2$  および $36j^2 - 12j = (6j-1)^2-1$ より、
$m = \frac{1 + \sqrt{(6k-1)^2 - (6j-1)^2 + 1}}{6}$

つまり、$(6k-1)^2 - (6j-1)^2+1 = (6m-1)^2$ となる $j, k$ の組み合わせを求めれば、 $P_k - P_j = P_m$ となる $m$ が求められる。
%%

## 学んだこと
- まずは探索で解こう
	- 真っ先に数学的に解こうとするな
	- 自分の知らない道をマッピングし続けたところで、道に迷うだけ
- 探索で詰まったときが、数学的な解法を探しどき
	- でも今回はめちゃくちゃ詰まった
- $x^2-y^2 = n$ となる $x, y$ を求めたい場合、 $n$ の約数 $(a, b)$ の組み合わせが使える
	- $x$ と $y$ で二重ループを回すより効果的
	-  $(x+y)(x-y) = ab$

## 自分が書いたコード
- 一応答えらしきものは求められる
	- 探索範囲がかなり恣意的
	- 処理時間が10秒以上かかる

```racket
(define (solve-44)
  ;; penta : Natural -> Natural
  ;; n(3n-1)/2を求める
  (define (penta n)
    (/ (* n (- (* 3 n) 1)) 2))
  
  ;; penta? : Natural -> Boolean
  ;; 入力値が五角数かどうか判定する
  (define (penta? x)
    (let ([d (+ (* 24 x) 1)])
      (and (square? d)
           (zero? (modulo (+ (integer-sqrt d) 1) 6)))))

  (define-values (k j diff)
    (for/fold ([min-k 10000]
               [min-j 1]
               [min-d 9999999])
              ([k (in-range 2 10000)])
      (for/fold ([cur-k min-k]
                 [cur-j min-j]
                 [cur-d min-d])
                ([j (in-range 1 k)]
                 #:do [(define pen-k (penta k))
                       (define pen-j (penta j))
                       (define s (+ pen-k pen-j))
                       (define d (- pen-k pen-j))]
                 #:when (and (penta? s) (penta? d)))
        (if (> cur-d d)
            (values k j d)
            (values cur-k cur-j cur-d)))))
  diff)
```

## LLMによる改善案
- 探索範囲は「自然数 $n$ における $12n(3n-1)$ の約数の組み合わせ」だけに留められる
	- $k$ と $j$ を1〜最大値までループするよりも少ない
	- 処理時間も1〜2秒ほどで済む
-  $P_{j+q} - P_{j} = P_n$（$P_k - P_j = P_n$ のままでもよかったらしい）
	- $(j+q)(3j+3q-1) - j(3j-1) = n(3n-1)$
	- $3j^2 + 3qj - j + 3qj + 3q^2 - q - 3j^2 + j = n(3n-1)$
	- $3q^2 + (6j - 1)q - n(3n-1) = 0$
- $q$ が整数となるには、判別式 $D = (6j−1)^2+12n(3n−1)$ が平方数である必要がある
	- $D = x^2$ とおくと、$(6j−1)^2+12n(3n−1) = x^2$
	- $x^2 - (6j−1)^2 = 12n(3n−1)$
	- $y = 6j - 1$とおく
		- $x^2 - y^2 = 12n(3n-1)$
		- $(x + y)(x - y) = 12n(3n-1)$
- ここで、 $12n(3n-1)$ の約数を $a,b$ とおく
	- $(x+y)(x-y)=ab$
	- $b = (x + y), a = (x - y)$とおくと、$x = \frac{a+b}{2}, y = \frac{b-a}{2}$
		- よって約数$a , b$ が定まると $j, q$ が求められる
			- ただし $j, q$ がいずれも整数であることを確認する
		- $j = \frac{1}{6} \left( \frac{b-a}{2} + 1 \right)$（ $y+1$ が6の倍数であれば $j$ は整数）
		- $q = \frac{x - y}{6} = \frac{a}{6}$ （ $a$ が6の倍数であれば $q$ は整数）
		- $j+q = \frac{1}{6}(\frac{a+b}{2} + 1)$
- あとは $P_{j+q} + P_j$ が五角数かどうかを判定する
	- 五角数であれば、$P_n$ が答え

```racket
(define (solve-44-alt2)
  
  ;; square? : Natural -> Boolean
  ;; 入力値が平方数かどうかを判定する
  (define (square? n)
    (let ([i-sq (integer-sqrt n)])
      (= (* i-sq i-sq) n)))
  
  ;; penta : Natural -> Natural
  ;; n(3n-1)/2を求める
  (define (penta n)
    (quotient (* n (- (* 3 n) 1)) 2))
  
  ;; penta? : Natural -> Boolean
  ;; 入力値が五角数かどうか判定する
  (define (penta? x)
    (let ([d (+ (* 24 x) 1)])
      (and (square? d)
           (zero? (modulo (+ (integer-sqrt d) 1) 6)))))

  ;; find-diff? : Natural -> Boolean
  ;; P(j+q)-P(j) = P(n) かつ P(j+q)+P(j)が五角数となる j, q が存在するかどうか判定する
  (define (find-diff? n)
    (define constant-n (* 12 n (- (* 3 n) 1)))
    
    (define (penta-sum? j q)
      (penta? (+ (penta (+ j q)) (penta j))))
    
    (for/or ([d (in-range 1 (add1 (integer-sqrt constant-n)))]
                #:when (zero? (remainder constant-n d))
                #:do [(define-values (a b) (values d (/ constant-n d)))]
                #:when (= (modulo a 2) (modulo b 2)) ;a+b, a-bが偶数の場合、a, bの偶奇は同じ
                #:do [(define-values (x y) (values (/ (+ a b) 2) (/ (- b a) 2)))]
                #:when (and (zero? (modulo (+ y 1) 6));y+1(= 6j-1+1)が6で割り切れるなら、jは整数
                            (zero? (modulo a 6))));a(= x-y = 1-6i+D)が6で割り切れるなら、qは整数
      (define j (quotient (+ y 1) 6))
      (define q (quotient a 6))
      (define-values (p-k p-j) (values (penta (+ j q)) (penta j)))
      (penta? (+ p-k p-j))));P(k)+P(j)が五角数かどうか判定
  
  ;; 最初にTrueが返った時のP(n)が問題44の答え
  (for/first ([n (in-range 1 2000)]
              #:when (find-diff? n))
    (penta n)))
```

## LLMによる回答（総当たり）
- もっと簡単なコードがあった
	- なんでこれを思いつけなかったんだ？
```racket
;; penta : Natural -> Natural
(define (penta n)
  (quotient (* n (- (* 3 n) 1)) 2))

;; square? : Natural -> Boolean
(define (square? n)
  (define r (integer-sqrt n))
  (= (* r r) n))

;; penta? : Natural -> Boolean
(define (penta? p)
  (define d (+ (* 24 p) 1))
  (and (square? d)
       (zero? (modulo (+ (integer-sqrt d) 1) 6))))

(define (solve-44)
  (for*/first ([k (in-naturals 2)]
               [j (in-range (sub1 k) 0 -1)]
               #:do [(define pk (penta k))
                     (define pj (penta j))
                     (define diff (- pk pj))]
               #:when (and (penta? diff)
                           (penta? (+ pk pj))))
    diff))
```