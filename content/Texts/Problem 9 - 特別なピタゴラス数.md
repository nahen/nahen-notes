---
modified: 2026-04-06
created: 2026-04-06
tags:
  - 
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 9](https://projecteuler.net/problem=9) 「特別なピタゴラス数」
>ピタゴラス数(ピタゴラスの定理を満たす自然数)とは $a \lt b \lt c$ で以下の式を満たす数の組である.  
>
>$$a^2 + b^2 = c^2$$
>
>例えば, $3^2 + 4^2 = 9 + 16 = 25 = 5^2$ である.
>
>$a + b + c = 1000$ となるピタゴラスの三つ組が一つだけ存在する.  これらの積 $abc$ を計算しなさい.

$a + b + c = 1000$ 、 $a^2 + b^2 = c^2$ の連立方程式を解け、というものっぽい。ただ、変数が3つあるのに式が2つしかないので、この方法では $a, b, c$ をすべて求められない。

上2つの方程式を解くと、 $1000(a + b) - ab = \frac{1000^2}{2}$ となる。これが成り立つ $(a, b)$ の組み合わせをひたすらループで探す？　$\frac{1000^2}{2}$ は偶数なので、$(a, b)$のいずれかは偶数。（どちらも奇数だと、$1000(a + b) - ab$が奇数になってしまうため）

となると、 $(a, c)$ または $(b, c)$ が奇数の組み合わせ、または $(a, b, c)$ すべて偶数の組み合わせだけを調べればいい？

~~式の形だけ見ると、相加平均・相乗平均の関係を使いそう？~~　 使う必要なかった。

## 学んだこと
- 変数が多くある場合、式を変形して変数を減らせないか考える
	- 連立方程式を解くのは合ってた
		- どのタイミングでどの数学の公式を使うか、戦術を選ぶメタ知識が足りない
		- まずは王道で解こう
- ピタゴラス数 $(a, b, c)$ の和は必ず偶数である
	- 後述の変数`sum`が奇数なら、即座に`false`を返していい
- 別解：ユークリッドの公式
	- 2つの自然数 $m, n(m > n)$ において、$a = m^2 - n^2, b = 2mn, c = m^2 + n^2$となる
		- ピタゴラス数 $(a, b, c)$ はユークリッドの公式で生成できる
	- ただし、原始ピタゴラス数のみを解とするか、その倍数も解とするかでコードが異なる

## 自分が書いたコード
- $a$ が取りうる最大値から、$b$ と $c$ を算出する
	- LLMからヒントをもらった

```racket
;; pythagorean-triplet : Void -> Integer
;; a^2 + b^2 = c^2 かつ a + b + c = 1000 となる自然数の組み合わせを探して、その積abcを求める
(define (pythagorean-triplet)
  ;; calc-b : Integer -> Real
  ;; b = 1000(500-a)/(1000-a)から、bの値を求める。
  (define (calc-b a)
    (/ (* 1000 (- (/ 1000 2) a)) (- 1000 a)))

  ;; calc-c : Integer Integer -> Integer
  ;; c = 1000 - (a + b)から、cの値を求める。
  (define (calc-c a b)
    (- 1000 (+ a b)))
  
  (define (loop a)
    (let* ([b (calc-b a)]
           [c (calc-c a b)]
           [both-int? (and (exact-integer? b) (exact-integer? c))])
      (if both-int?
          (* a b c)
          (loop (sub1 a)))))

  ;; a の最大値は 332((a, b, c) = (332, 333, 335)。a < b < c, a + b + c = 1000より)。
  (loop 332))
```

## LLMによる改善案
- 引数`sum`を導入（ $a, b, c$ の和）
	- `sum = 1000`で問題9の解答になる
	- 解が存在しない場合、または `sum` が奇数の場合は`false`を返す
- `for`でループ（ $1 \leq a \lt \frac{a+b+c}{3}$ ）
	- ただし`for/first`なので、一番最初に条件に当てはまる $(a, b, c)$ の積を答えてしまう

```racket
(define (pythagorean-triplet sum)
  (if (odd? sum)
      #f
      (for/first ([a (in-range 1 (quotient sum 3))]
              #:when (and (zero? (remainder (* sum (- (/ sum 2) a)) (- sum a)))))
    (define b (/ (* sum (- (quotient sum 2) a)) (- sum a)))
    (define c (- sum a b))
    (* a b c))))
```

別解として、ユークリッドの公式を使った解法もある。この解法では、$\mod (\frac{1000}{2}/m(m+n)) =0$ で判別している。そのため、ピタゴラス数の倍数も解に含まれる。

```racket
(define (pythagorean-triplet-euclid sum)
  (let ([half (/ sum 2)])
    (for*/first ([m (in-range 2 (add1 (integer-sqrt half)))]
                 [n (in-range 1 m)]
                 #:when (zero? (remainder half (* m (+ m n)))))
      (let* ([k (/ half (* m (+ m n)))]
             [a (* k (- (* m m) (* n n)))]
             [b (* k (* 2 m n))]
             [c (* k (+ (* m m) (* n n)))])
        (* a b c)))))
```

こちらは $\frac{1000}{2} - m(m+n) = 0$ で判別している。そのため、原始ピタゴラス数のみが解になる。

```racket
(define (pythagorean-triplet-euclid sum)
  (let ([half (/ sum 2)])
    (for*/first ([m (in-range 2 (add1 (integer-sqrt half)))]
                 [n (in-range 1 m)]
                 #:when (= half (* m (+ m n))))
      (let ([a (- (* m m) (* n n))]
            [b (* 2 m n)]
            [c (+ (* m m) (* n n))])
        (* a b c)))))
```

## 参考
- [ピタゴラス数 - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%94%E3%82%BF%E3%82%B4%E3%83%A9%E3%82%B9%E6%95%B0)