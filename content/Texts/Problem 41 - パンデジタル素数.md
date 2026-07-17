---
created: 2026-07-06
modified: 2026-07-07
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 41](http://projecteuler.net/problem=41) 「パンデジタル素数」
> n桁パンデジタルであるとは, 1からnまでの数を各桁に1つずつ持つこととする.（下のリンク先にあるような数学的定義とは異なる）
> 
> 例えば2143は4桁[パンデジタル数](http://ja.wikipedia.org/wiki/%E3%83%91%E3%83%B3%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E6%95%B0)であり, かつ素数である. 
> 
> n桁（この問題の定義では9桁以下）パンデジタルな素数の中で最大の数を答えよ.

またパンデジタル。問題の定義から、最大値の桁数 $n$ は $n \leq 9$ 。$n$ 桁のパンデジタル数の組み合わせを作って、それが素数かどうかを判定するのがいい？

- 試し割り法で素数かどうか判定する関数
-  $n$ 桁パンデジタル数のリストを生成する関数

## 学んだこと
- `permutations`
	- 順列のリストを返す
- `for/first`
	- 最初に`#:when`を満たす要素を出力する
- 3の倍数判定法
	- [各桁の和が３の倍数なら３の倍数、の証明](https://mathwords.net/3nobaisu)

## 自分が書いたコード
- パンデジタル数の生成方法はLLMから教わった
	- `permutations`なんて知らなかった

```racket
;; solve-41 : Natural -> Natural
;; n桁のパンデジタル数の素数の最大値を出力する
(define (solve-41 d)
  ;; prime? : Natural -> Boolean
  ;; 入力値が素数かどうか判定する
  (define (prime? n)
    (cond [(< n 2) #f]
          [(= n 2) #t]
          [(= n 3) #t]
          [(even? n) #f]
          [else (for/and ([i (in-range 3 (add1 (integer-sqrt n)) 2)])
                  (> (remainder n i) 0))]))
  
  ;; digits->number : (listof Naturals) -> Natural
  ;; 順列のリストを連結して数値に変換する
  (define (digits->number digits)
    (for/fold ([n 0])
              ([d digits])
      (+ (* 10 n) d)))
  
  ;; prime-pandigitals : -> (listof Natural)
  ;; n桁のパンデジタル数の素数のリストを出力する
  (define (prime-pandigitals digit)
    (for/list ([digits (permutations (range 1 (add1 digit)))]
               #:do [(define n (digits->number digits))]
               #:when (prime? n))
      n))

  (for/first ([digit (in-range d 0 -1)]
        #:do [(define lst (prime-pandigitals digit))]
        #:when (not (null? lst)))
    (apply max lst)))
```

## LLMによる改善案
- `pan-multiple-by-3?`を追加
	- 3の倍数判定法を使って、桁数をふるい落とす
		- 3の倍数は素数ではないので除外できる
	- パンデジタル数の各桁の和より、探索範囲は7桁、4桁、1桁だけになる
		- 9桁：$1+2+3+\dots+9 = 45 = 3\times15$（3の倍数）
		- 8桁：$1+2+3+\dots+8 = 36 = 3 \times 12$（3の倍数）
		- 7桁：$1+2+3+\dots+7 = 28$ （3の倍数ではない）
		- 6桁：$1+2+3+\dots+6 = 21 = 3\times 7$ （3の倍数）
		- 5桁：$1+2+3+4+5 = 15 = 3\times 5$ （3の倍数）
		- 4桁：$1+2+3+4 = 10$ （3の倍数ではない）
		- 3桁：$1+2+3= 6=3\times 2$ （3の倍数）
		- 2桁：$1+2= 3$ （3の倍数）
- `prime-pandigitals`を`largest-prime-pandigital`に変更
	- 素数のリストではなく、素数の最大値を返す


```racket
;; solve-41 : Natural -> Natural
;; n桁のパンデジタル数の素数の最大値を出力する
(define (solve-41-alt d)
  ;; prime? : Natural -> Boolean
  ;; 入力値が素数かどうか判定する
  (define (prime? n)
    (cond [(< n 2) #f]
          [(<= n 3) #t]
          [(even? n) #f]
          [else (for/and ([i (in-range 3 (add1 (integer-sqrt n)) 2)])
                  (> (remainder n i) 0))]))
  
  ;; digits->number : (listof Naturals) -> Natural
  ;; 順列のリストを連結して数値に変換する
  (define (digits->number digits)
    (for/fold ([n 0])
              ([d digits])
      (+ (* 10 n) d)))
  
  ;; largest-prime-pandigital : Natural -> Natural
  ;; n桁のパンデジタル数の素数の最大値を出力する
  (define (largest-prime-pandigital digit)
    (for/fold ([best 0])
              ([digits (permutations (range digit 0 -1))])
      (let ([n (digits->number digits)])
        (if (and (< best n) (prime? n))
            n
            best))))

  ;; pan-multiple-by-3? : Natural -> Boolean
  ;; パンデジタル数の各桁の和が3の倍数かどうか判定する
  (define (pan-multiple-by-3? digit)
    (let ([sum (quotient (* digit (add1 digit)) 2)])
      (zero? (remainder sum 3))))

  (for/first ([digit (in-range d 0 -1)]
              #:when (not (pan-multiple-by-3? digit))
              #:do [(define large (largest-prime-pandigital digit))]
              #:when (> large 0))
    large))
```
