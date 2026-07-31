---
created: 2026-05-25
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 27](http://projecteuler.net/problem=27) 「二次式素数」
> オイラーは以下の二次式を考案している:
> 
> $n^2 + n + 41$.
>
> この式は, $n$ を0から39までの連続する整数としたときに40個の素数を生成する. しかし, $n = 40$ のとき $40^2 + 40 + 41 = 40(40 + 1) + 41$ となり41で割り切れる. また, $n = 41$ のときは $41^2 + 41 + 41$ であり明らかに41で割り切れる.
>
> 計算機を用いて, 二次式 $n^2 - 79n + 1601$ という式が発見できた. これは n = 0 から 79 の連続する整数で80個の素数を生成する. 係数の積は, $-79 \times 1601$ で -126479である.
>
> さて, $|a| \lt 1000, |b| \leq 1000$ として以下の二次式を考える (ここで $|a|$ は絶対値): 例えば $|11| = 11$  $|-4| = 4$である.
>
> $n^2 + an + b$
> 
> $n = 0$ から始めて連続する整数で素数を生成したときに最長の長さとなる上の二次式の, 係数 $a, b$ の積を答えよ.

特定の範囲内ならば、素数は二次式で表せる。それなら、係数が-1000〜1000となる二次式から素数を生成するものも見つけ出せるよね、という問題らしい。なんて面倒臭いんだ。

すべての組み合わせを求めようとすると、aもbもほぼ2000通りなので、2000×2000となって計算量がとんでもないことになる。

ところで、二次式の答えは素数であればよくて、その答えが連続している必要はない。（たとえば、オイラーの式は $f(3)=53, f(4)=61$ となり、間の素数59を無視している）

また、問題文にある2つの二次式は、それぞれ以下の階差数列をもつ。
- オイラーの式の階差数列：初項が4、公差が2の等差数列→2n+2
- 計算機の式の階差数列：初項が-76、公差が2の等差数列→2n-78

ここから、以下の条件が見出せる。
- 数列 $a_n$ の初項 $a_0 (= b)$ は必ず素数
- 数列 $a_n$ の階差数列 $b_n$ は $2(n+c)$ の形（cは整数）
	- 数列 $a_n$ の候補となる素数はすべて奇数になる
		- そのため階差数列 $b_n$ は必ず偶数
- 数列 $a_n$ の一般項は、$a_n = n^2 + 2(c-1)n + (a_1 - 2c)$
	- [階差数列と一般項の公式](https://www.try-it.jp/chapters-5324/sections-5399/lessons-5404/) $a_n=a_1+\sum^{k=1}_{n-1}b_k$ より
		- $a = 2(c-1)$
		- $b=(a_1 -2c)$

~~つまり、$b$ が1000未満の素数 $p$ となる範囲と、$-499 \lt c \lt 501$ となる $c$ の範囲で、二次式 $n^2 + an + b$ を作りまくって、最長の長さとなる二次式をしらみつぶしに探したうえで、係数 $a , b$ の積を求めるということか？~~ 

かなり複雑に考えすぎていた。以下の制限だけ考慮すればよかったみたい。
- b は必ず素数
- a は必ず奇数

## 学んだこと
- ブルートフォースが唯一の正解であるときもある
	- この問題は a と b の探索領域をいかに減らすかがカギだった

## 自分が書いたコード
- もう無理。長すぎる
	-  b の候補となる1000以下の素数リストを作る
	- 各 b に対して、 a の候補となる奇数リストを作る
	- 奇数 a と素数 b を $n^2 + an + b$ に代入する
		- $f(n) = n^2 + an + b$ が0以下、または素数でないときの $n$ を、その二次式の最長の長さ index とする
		- (a, b, index)の組み合わせで、indexが一番大きい組み合わせを探す
			- 一番大きい組み合わせで a と b の積を求める

```racket
(define (solve-27)
  ;; 素数テーブル
  (define p-table (primes 20000))
  ;; bの候補となる素数の一覧(1000まで)
  (define b-values
    (for/list ([p p-table]
               [i (in-range 0 1000)]
               #:when p)
      i))
  ;; bからaの候補を求める
  (define (a-values b)
    (for/list ([a (in-range -999 1000 2)] ;aは必ず奇数
               #:when (and (>= (+ a b 1) 0)
                           (vector-ref p-table (+ a b 1))))
      a))
  ;; n^2 + an + b
  (define (quadratic-fn a b)
    (lambda (n) (+ (* n n) (* a n) b)))

  ;; 二次式にn,a,bを代入し、その結果が素数でないindexを探す
  (define-values (res-a res-b res-index)
    (for/fold ([max-b 0]
               [max-a 0]
               [max-index 0])
              ([b b-values])
      (define-values (best-a best-index)
        (for/fold ([max-a 0]
                   [max-index 0])
                  ([a (a-values b)])
          ;; n^2 + an + b
          (define fn (quadratic-fn a b))
      
          (define (loop i)
            (cond [(or (= i b)
                       (< (fn i) 0)
                       (not (vector-ref p-table (fn i)))) i]
                  [else
                   (loop (+ i 1))]))
          (define current-index (loop 1))
      
          (if (> current-index max-index)
              (values a current-index)
              (values max-a max-index))))
    
      (if (> best-index max-index)
          (values b best-a best-index)
          (values max-b max-a max-index))))
  (* res-a res-b))
```

## LLMによる改善案
- 

```racket
;; prime? : Integer -> Boolean
(define (prime? n)
  (cond
    [(< n 2) #f]
    [(= n 2) #t]
    [(even? n) #f]
    [else
     (define limit (exact-floor (sqrt n)))
     (not
      (for/or ([i (in-range 3 (+ limit 1) 2)])
        (= (remainder n i) 0)))]))

;; 与えられた a, b に対して、n=0 から始まる連続する素数の個数をカウントする関数
(define (count-consecutive-primes a b)
  (let loop ([n 0])
    (define value (+ (* n n) (* a n) b))
    (if (and (> value 0) (prime? value))
        (loop (+ n 1))
        n)))

;; メインの探索処理
(define (solve-euler-27)
  ;; b は 1000 以下の素数(かつ、aが奇数になるよう正の素数に限定しても十分解が見つかります)
  (define b-candidates (filter prime? (range 2 1001)))
  ;; a は -999 から 999 までの奇数
  (define a-candidates (filter odd? (range -999 1000)))

  ;; ループを回して最大値を探索
  (for*/fold ([max-primes 0]
              [best-product 0])
             ([b (in-list b-candidates)]
              [a (in-list a-candidates)])
    
    (define current-primes (count-consecutive-primes a b))
    
    (if (> current-primes max-primes)
        (values current-primes (* a b)) ; 新しい最大値が見つかったら更新
        (values max-primes best-product)))) ; そうでなければ維持
```

## 参考
- 