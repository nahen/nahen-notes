---
created: 2026-06-29
modified: 2026-06-29
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 39](http://projecteuler.net/problem=39) 「整数の直角三角形」
> 辺の長さが整数の3つ組{a,b,c}である直角三角形を考え, その周囲の長さを p とする. p = 120のときには3つの解が存在する:
> 
> {20,48,52}, {24,45,51}, {30,40,50}
> 
> p ≤ 1000 のとき解の個数が最大になる p はいくつか？

直角三角形ということは、三平方の定理 $a^2 + b^2 = c^2 (c > b \geq a)$ の出番か。
- $a^2 + b^2 = c^2$
	- $c=\sqrt{a^2+b^2}$
- $p \leq 1000$
- $a + b + c = p$
	- $a+b+\sqrt{a^2+b^2} = p$

素直に実装するなら、以下の2つのループを回す形になる？
- c（(p/3)+1〜(p-2)）
	- b（(p-c)-1〜(p-c)/2）
	- b, cよりaは一意に求まる
	- ただし {a, b, c} が三平方の定理を満たすこと

- 三平方の定理を満たすかどうか判定する関数
- 入力値pにおける解（作れる直角三角形）の個数を求める関数
- 解の個数の最大値を求める関数

## 学んだこと
- 最長辺 $c$ よりも、最短辺 $a$ をもとに探索した方が楽

## 自分が書いたコード
- p, c, bの3重ループ
	- cからb, aを作り出す
- 組み合わせ{a, b, c}が三平方の定理を満たす場合、解の個数+1
- pを12〜`max-p`で探索
	- 解の個数`best-triangles`が最大となる`best-p`を返す

```racket
;; solve-39 : Natural -> Natural
;; 最大値 max-p 以下のpのうち、直角三角形の解の個数が最大となるpを求める
(define (solve-39 max-p)
  
  ;; pythagorean? : Natural Natural Natural -> Boolean
  ;; 入力値 a, b, c (c > b >= a) が三平方の定理を満たすか判定する
  (define (pythagorean? a b c)
    (= (* c c) (+ (* b b) (* a a))))
  
  ;; right-triangles : Natural -> Natural
  ;; 周囲の長さ p から作られる直角三角形の個数を求める
  (define (right-triangles p)
    (for/sum ([c (in-range (add1 (quotient p 3)) (- p 2))])
      (let ([r (- p c)])
        (for/sum ([b (in-range (add1 (quotient r 2)) (- r 1))]
                  #:do [(define a (- r b))]
                  #:when (pythagorean? a b c))
          1))))
  
  (if (< max-p 12)
      #f ;p が12以下の場合、直角三角形は作れない
      (for/fold ([best-p #f]
                 [best-triangles 0])
                ([p (in-range 12 (add1 max-p))]
                 #:do [(define ans (right-triangles p))]
                 #:when (> ans best-triangles))
        (values p ans))))
```

## LLMによる改善案
- 条件式を変形すれば、探索範囲をもっと絞れる
	- $a + b + c = p$ を変形して、$c = p - (a + b)$にする
	- $a^2 + b^2 = c^2$ に代入して、$a^2 + b^2 = (p - (a+b))^2$
		- $a^2 + b^2 = p^2 - 2(a + b)p + a^2 + 2ab + b^2$
	- 両辺から$a^2 + b^2$を引く
		- $p^2 - 2(a + b)p - 2ab = 0$
		- 変形して $-2ab - 2pb = 2pa -p^2$
		- $-2b(p-a) = p^2-2pa$
		- $b = \frac{p^2-2pa}{2(p-a)}$
	- ここから、pとaの2重ループだけで解を求められる
		- aの取りうる範囲は $1 \lt a \leq \frac{p}{3}$
		- pの取り得る範囲は $2 \leq p \leq \mathrm{max-p}$ で、必ず偶数
			- 整数の直角三角形を作るには、周の長さ p が偶数である必要がある

```racket
;; solve-39 : Natural -> (Values Natural Natural)
;; 最大値 max-p 以下の偶数pのうち、直角三角形の解の個数が最大となる (values p count) を求める
(define (solve-39 max-p)
  
  ;; right-triangles : Natural -> Natural
  ;; 周長 p から作られる直角三角形の個数を O(p) でカウントする
  (define (right-triangles p)
    (for/sum ([a (in-range 1 (add1 (quotient p 3)))]
              ;; 分子: p^2 - 2pa -> p(p - 2a)
              #:do [(define num (* p (- p (* 2 a))))
                    ;; 分母: 2(p - a)
                    (define den (* 2 (- p a)))]
              ;; b が整数になる(割り切れる)かつ a <= b である条件
              #:when (and (zero? (remainder num den))
                          (<= a (/ num den))))
      1))

  (if (< max-p 12)
      (values #f 0)
      ;; 直角三角形の周長 p は必ず偶数になる性質を利用し、in-range の step に 2 を指定
      (for/fold ([best-p 12]
                 [best-count 0])
                ([p (in-range 12 (add1 max-p) 2)])
        (let ([count (right-triangles p)])
          (if (> count best-count)
              (values p count)       ; 更新
              (values best-p best-count))))))
```

## 参考
- [Project Euler Solution 39: Integer right triangles | Martin Ueding](https://martin-ueding.de/posts/project-euler-solution-39-integer-right-triangles/)
	- LLM案と同じやり方で解いている