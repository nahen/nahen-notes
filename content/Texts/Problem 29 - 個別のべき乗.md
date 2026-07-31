---
created: 2026-06-01
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 29](http://projecteuler.net/problem=29) 「個別のべき乗」
> $2 \leq a \leq 5$ と $2 \leq b \leq 5$について, $a^b$ を全て考えてみよう:
> 
> - $2^2=4, 2^3=8, 2^4=16, 2^5=32$
> - $3^2=9, 3^3=27, 3^4=81, 3^5=243$
> - $4^2=16, 4^3=64, 4^4=256, 4^5=1024$
> - $5^2=25, 5^3=125, 5^4=625, 5^5=3125$
> 
>これらを小さい順に並べ, 同じ数を除いたとすると, 15個の項を得る:
>
> 4, 8, 9, 16, 25, 27, 32, 64, 81, 125, 243, 256, 625, 1024, 3125
>
> $2 \leq a \leq 100$, $2 \leq b \leq 100$ で同じことをしたときいくつの異なる項が存在するか?

$2^b〜100^b$までを集合（set）に入れていって、最後に集合の項数を求めれば、それで解決できる。Pythonで集合という概念を知っておいてよかった。

でも、集合の概念がない言語では、どうやって重複を見抜けばいいんだろう。

## 学んだこと
- 

## 自分が書いたコード
- aとbの各組み合わせで乗数を求めて、それを集合に加えていくだけ
	- 集合（set）が使える言語ではこれが正解らしい
	- Project Eulerの想定解ではないと思うが

```racket
;; solve-29: (listof Natural) (listof Natural) -> Natural
;; aとbの個別のべき乗の項数を求める
(define (solve-29 a-values b-values)
  (define a-b-set
    (for*/set ([a a-values]
               [b b-values])
      (expt a b)))

  (set-count a-b-set))
```

## LLMによる別解
-  $a^b$ は、 $base^{p*b}$ に分解できる
	- $base$： $a$ の最小の基数。たとえば $a=2, 4, 8, 16, 32,\dots$ の $base$ は2。
	- $p$： $a$ を基数 $base$ で分解したときの指数
- 各 $a$ から基数 $base$ を求め、$base^{p * b}$ の組み合わせがいくつあるかを求める
	- 当該 $base$ の組み合わせをすでに求めている場合は無視

```racket
(define (solve-euler-29 n)
  ;; p-maxとnを受け取って、p(1〜p-max)とb(2〜n)の商のユニーク数を返す
  (define (count-unique-exponents p-max n)
    (set-count
     (for*/set ([p (in-range 1 (+ p-max 1))]
                [b (in-range 2 (+ n 1))])
       (* p b))))

  ;; base=2, n=100のとき、(2 4 8 16 32 64)と最大指数6を取り出したい
  (define (collect-powers base n)
    (let loop ([val base];現在の累乗の値
               [p 1];現在の指数
               [acc '()])
      (if (> val n)
          (values acc (- p 1))
          (loop (* val base) (+ p 1) (cons val acc)))))
  
  (let main-loop ([a 2]
                  [visited (set)]
                  [total 0])
    (cond [(> a n) total]
          [(set-member? visited a) (main-loop (+ a 1) visited total)]
          [else
           ;; 累乗の仲間と最大指数を取得
           (define-values (powers p-max) (collect-powers a n))
           ;; visitedに追加
           (define next-visited (set-union visited (list->set powers)))
           ;; ユニーク数を計算してtotalに追加
           (define unique-count (count-unique-exponents p-max n))
           (main-loop (+ a 1) next-visited (+ total unique-count))])))
```

## 参考
- 