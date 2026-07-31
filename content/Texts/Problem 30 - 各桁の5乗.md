---
created: 2026-06-03
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 30](http://projecteuler.net/problem=30) 「各桁の5乗」
> 驚くべきことに, 各桁を4乗した数の和が元の数と一致する数は3つしかない.
> - $1634 = 1^4 + 6^4 + 3^4 + 4^4$
> - $8208 = 8^4 + 2^4 + 0^4 + 8^4$
> - $9474 = 9^4 + 4^4 + 7^4 + 4^4$
> 
> ただし, $1=1^4$は含まないものとする. この数たちの和は 1634 + 8208 + 9474 = 19316 である.
> 
> 各桁を5乗した数の和が元の数と一致するような数の総和を求めよ.

素直に考えると、数字の各桁を5乗した数の和を求める関数を作って、特定の数の範囲でループし続ければよさそう。でも、特定の範囲の数ってどこまで？　つまり、ループが終了する条件って何？

まずは例題にある、桁数 $\mathrm{digit}$ をもつ数の各桁を4乗した数の和の最大値（つまり $9^4 * \mathrm{digit}$ ）を見てみる。こう見ると、各桁を4乗した数の和が元の数と一致する数は、間違いなく6桁を超えない。

- 3桁：$3*9^4= 19683 \gt 10^2$ 
- 4桁：$4*9^4= 26244 \gt 10^3$
- 5桁：$5*9^4= 32805 \gt 10^4$
- 6桁：$6*9^4= 39366 \lt 10^5$

この終了条件をループに組み込めば、力技で解けそう。

## 学んだこと
- まずは探索で解く
	- 最初から「O(1)となる数理的な解法があるのでは？」と思い込まない
- 次に探索範囲を狭める
- それでもムリなら、数理的な解法を探す
- 「メモ化できそう？」という直感は案外正しいかも

## 自分が書いたコード
- ループの終了条件となる最大桁数`max-digit`を求める
	- $2〜10^{\mathrm{max-digit}}$の範囲で、条件と一致する数を抽出する
	- 抽出した数を足し合わせる
- 1〜2秒ほどかかるが、5桁の場合でも問題なく求まる

```racket
;; solve-30: Natural -> Natural
;; 各桁をn乗した数の和が元の数と一致する数の総和を求める
(define (solve-30 n)
  ;; 各桁をn乗した数の最大値の和(9^n*d)から、ループの終了条件である最大桁数dを求める
  (define max-digit
    (let loop ([d 1])
      (define max-num-digit
        (exact-ceiling (/ (log (* d (expt 9 n))) (log 10))))
    
      (if (< max-num-digit d)
          max-num-digit
          (loop (+ d 1)))))

  ;; digit-nth-power: Natural -> Natural
  ;; numの各桁をn乗した数の和を出力する
  (define (digit-nth-power num)
    (for/sum ([c (number->string num)])
      (expt (- (char->integer c) (char->integer #\0)) n)))

  ;; 数字の各桁をn乗した数の和が元の数と一致するか？
  (define (nth-power-sum? num)
      (= (digit-nth-power num) num))
  
  (for/sum ([i (in-range 2 (expt 10 max-digit))]
            #:when (nth-power-sum? i))
    i))
```

## LLMによる改善案
- 最大桁数`max-digit`ではなく最大値`max-sum`をループの終端にする
- 各桁ごとの数字は`(quotient/remainder)`のループで取得する
	- 文字列→数値化は時間がかかる？
- 1〜9をn乗した値をテーブルに保存する（メモ化）

```racket
;; solve-30: Natural -> Natural
;; 各桁をn乗した数の和が元の数と一致する数の総和を求める
(define (solve-30 n)
  ;; 0〜9のn乗テーブルを作る
  (define powers
    (for/vector ([i 10]) (expt i n)))
  
  ;; 各桁をn乗した数の最大値の和(9^n*d)から、ループの終了条件となる最大値を求める
  (define upper-bound
    (let loop ([d 1])
      (define max-sum (* d (vector-ref powers 9)))
      (if (< max-sum (sub1 (expt 10 d)))
          max-sum
          (loop (+ d 1)))))

  ;; digit-nth-power: Natural -> Natural
  ;; numの各桁をn乗した数の和を出力する
  (define (digit-nth-power num)
    (let loop ([m num] [sum 0])
      (cond [(zero? m) sum]
            [else
             (define-values (q r) (quotient/remainder m 10))
             (loop q (+ sum (vector-ref powers r)))])))

  ;; 数字の各桁をn乗した数の和が元の数と一致するか?
  (define (nth-power-sum? num)
      (= (digit-nth-power num) num))
  
  (for/sum ([i (in-range 2 (+ upper-bound 1))]
            #:when (nth-power-sum? i))
    i))
```

