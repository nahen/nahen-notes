---
created: 2026-05-14
modified: 2026-07-09
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 23](http://projecteuler.net/problem=23) 「非過剰数和」
> 完全数とは, その数の真の約数の和がそれ自身と一致する数のことである. たとえば, 28の真の約数の和は, 1 + 2 + 4 + 7 + 14 = 28 であるので, 28は完全数である.
> 
> 真の約数の和がその数よりも少ないものを不足数といい, 真の約数の和がその数よりも大きいものを過剰数と呼ぶ.
>
> 12は, 1 + 2 + 3 + 4 + 6 = 16 となるので, 最小の過剰数である. よって2つの過剰数の和で書ける最少の数は24である. 数学的な解析により, 28123より大きい任意の整数は2つの過剰数の和で書けることが知られている. 2つの過剰数の和で表せない最大の数がこの上限よりも小さいことは分かっているが, 数学的な解析ではこの上限を減らすことは出来ていない.
>
> 2つの過剰数の和で書き表せない正の整数の総和を求めよ.

[[Problem 21 - 友愛数]]に出てきた「真の約数の和」がまたも。問題文を読むに、探索範囲は1〜28123までらしい。~~しかし今回は篩が使えなさそう。~~ 真の約数の和を求めるのに篩が使えそう。

2つの過剰数の和で表せる数字の方が、表せない数字よりも少ないと思う。なので、1〜28123の和（等差数列の和）から、2つの過剰数の和で表せる数字の和を引けば、答えが求まる。

1. 1〜28123の真の約数の和を求める（[[Problem 21 - 友愛数]]の篩を使えばいい）
2. 各数字で過剰数か否かを判定する。過剰数なら`true`、それ以外なら`false`
3. 2つの過剰数の和で表せる数を足し合わせる
4. 1〜28123の和から(3)を引く

参った。単純に2つの過剰数の和で表せる数を生成しようとすると、重複が発生する。~~重複をどうやって消したらいいんだ？~~ 別の篩を作って無理やり重複を消した。

## 学んだこと
- 

## 自分が書いたコード
- とりあえず上の手順を愚直に書いた
	- やり方は合ってた
- 真の約数の和は、[[Problem 21 - 友愛数]]の篩で求める
	- 1〜limitまでの各数で求めるように、配列のインデックスを`(add1)`や`(sub1)`で調整
- 過剰数のリストをもとに、2つの過剰数の和で表せる数を求める
	- `'(1 2 3)`のとき、`(1+1, 1+2, 1+3, 2+2, 2+3, 3+3)`となる
	- ただし、和が28123を超える場合は無視する（`#:unless`）

```racket
;; non-abundant-sums : Void -> Integer
;; 2つの過剰数の和で書き表せない正の整数の総和を求める
(define (non-abundant-sums)
  (define limit 28123)
  (define sum-all (quotient (* limit (+ limit 1)) 2))
  
  ;; sum-proper-divisors-table Integer -> (vectorof Integer)
  ;; 1〜limitまでの各数で、真の約数の和をそれぞれ求める
  (define (sum-proper-divisors-table)
    ;; 1〜limitまでの配列を作る
    (define d-values (make-vector limit 0))

    (for* ([i (in-range 1 (add1 (quotient limit 2)))]
           [j (in-range (sub1 (* i 2)) limit i)])
      (vector-set! d-values j (+ (vector-ref d-values j) i)))
    d-values)
  
  ;; list-abundant: void -> (listof Integer)
  ;; 真の約数の和の配列から、過剰数のリストを作る
  (define (list-abundant)
    (for/list ([val (sum-proper-divisors-table)]
               [i (in-naturals 1)]
               #:when (> val i))
      i))
  
  ;; sum-abundant: (listof Integer) -> Integer
  ;; 過剰数のリストから、2つの過剰数の和を作る
  (define (sum-abundant loi)
    ;; 2つの過剰数の和で生成できる数を0/1で判別するための配列(indexがその数)
    (define a-values (make-vector limit 0))
  
    (for ([(val idx) (in-indexed loi)])
      (for ([j (drop loi idx)]
            #:unless (<= limit (+ val j)))
        (vector-set! a-values (+ val j) 1)))
    (for/sum ([a a-values]
              [i (in-naturals 1)])
      (* i a)))
  
  (define sum-abun (sum-abundant (list-abundant)))

  (- sum-all sum-abun))
```

## LLMによる改善案
- アルゴリズム自体は変わっていない
- `sum-abundant`のコードを修正
	- `a-values`（0/1が入る）を`a-flags`（true/falseが入る）に変更
	- `(drop loi idx)`を使わない形に変更
		- ここで処理時間がかかっている

```racket
(define (non-abundant-sums)
  (define limit 28123)
  
  ;; sum-proper-divisors : -> (vectorof Integer)
  ;; 1〜limitまでの各数で、真の約数の和をそれぞれ求める
  (define sum-proper-divisors
    ;; 1〜limitまでの配列を作る
    (let ([d-values (make-vector (add1 limit) 0)])
      (for* ([i (in-range 1 (add1 (quotient limit 2)))]
             [j (in-range (* i 2) (add1 limit) i)])
        (vector-set! d-values j (+ (vector-ref d-values j) i)))
      d-values))
  
  ;; list-abundant: void -> (listof Integer)
  ;; 真の約数の和の配列から、過剰数のリストを作る
  (define list-abundant
    (for/list ([val sum-proper-divisors]
               [i (in-naturals 0)]
               #:when (> val i))
      i))
  
  ;; sum-abundant: -> Integer
  ;; 過剰数のリストから、2つの過剰数の和を作る
  (define (sum-abundant)
    (define abundants (list->vector list-abundant))
    (define len (vector-length abundants))
    ;; 2つの過剰数の和で生成できる数を判定する配列(indexがその数)
    (define a-flags (make-vector (add1 limit) #f))
    
    (for ([i (in-range len)]
          #:do [(define ai (vector-ref abundants i))])
      (for ([j (in-range i len)]
            #:do [(define sum (+ ai (vector-ref abundants j)))]
            #:break  (> sum limit))
        (vector-set! a-flags sum #t)))
    
    (for/sum ([flag a-flags]
              [i (in-naturals 0)]
              #:when flag)
      i))
  
  (define sum-all (quotient (* limit (+ limit 1)) 2))
  (define sum-abun (sum-abundant))

  (- sum-all sum-abun))
```
