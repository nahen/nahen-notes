---
created: 2026-05-05
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 20](http://projecteuler.net/problem=20) 「各位の数字の和 2」 
> _n_ × (_n_ - 1) × ... × 3 × 2 × 1 を _n_! と表す.  
> 例えば, 10! = 10 × 9 × ... × 3 × 2 × 1 = 3628800 となる.    
> この数の各桁の合計は 3 + 6 + 2 + 8 + 8 + 0 + 0 = 27 である.  
> では, 100! の各位の数字の和を求めよ.
>
> 注: [[Problem 16 - 各位の数字の和]] も各位の数字の和に関する問題です。解いていない方は解いてみてください。

[[Problem 16 - 各位の数字の和#別解|Problem 16別解と同じ方法]]でやれば解けるのか？　つまり、数値の各桁に対して掛け算をする。しかし、前回は2を掛ければよかったが、今回は掛ける数値が変動するうえに2ケタ、3ケタの数値も含まれる。

もちろん、racketは巨大数も扱えるので、階乗を求めてそのまま各桁を足し合わせてもいい。でもそれはProject Eulerの想定解ではないと思う。

## 学んだこと
- すでに似たような問題を解いていても、すぐに解法が思い出せるわけではない
	- [[📝想起練習]]していない解法は思い出しづらい
		- 自力で導けなかった解法は特に
- リストの総和の求め方
	- `(for/sum ([l list]) l)`でも`(apply + list)`でもどっちでもいいらしい
	- 生成AIでも意見が分かれる
		- 手早く総和を求めるなら`(apply)`
		- 追加の処理を入れる余地を残したいなら`(for/sum)`

## 自分が書いたコード
- [[Problem 16 - 各位の数字の和#別解]]を参考に、`(loop lst carry acc)`部分のコードを修正
	- `carry`が10以上になっても動作するようになった

```racket
;; factorial-digit-sum : Integer -> Integer
;; 入力値の階乗を求めて、各桁の和を出力する。
(define (factorial-digit-sum n)
  ;; (listof Integer) Integer -> (listof Integer)
  ;; 数字の各桁にiを掛けて出力する
  (define (multipled-digits d n)
    (define (loop lst carry acc)
      (cond [(empty? lst)
             (if (> carry 0)
                 (let-values ([(quo rem) (quotient/remainder carry 10)])
                   (loop '() quo (cons rem acc)))
                 acc)]
            [else
             (let* ([multipled (+ (* (first lst) n) carry)]
                    [quo (quotient multipled 10)]
                    [rem (remainder multipled 10)])
               (loop (rest lst)
                     quo
                     (cons rem acc)))]))
  
    (loop (reverse d) 0 '()))
  
  (define digits
    (for/fold ([d '(1)])
              ([i (in-range 1 (add1 n))])
      (multipled-digits d i)))
  
  (for/sum ([d digits]) d))
```

## LLMによる改善案
- `(reverse list)`の場所以外は特に変わっていない
	- `reverse`を最初に置くか、最後に置くか
	- 正直好みの範囲だと思う

```racket
(define (factorial-digit-sum n)
  (define (multiply-digits digits n)
    (define (loop ds carry acc)
      (cond
        [(empty? ds)
         (if (= carry 0)
             (reverse acc)
             (loop '()
                   (quotient carry 10)
                   (cons (remainder carry 10) acc)))]
        [else
         (let* ([prod (+ (* (first ds) n) carry)]
                [digit (remainder prod 10)]
                [next-carry (quotient prod 10)])
           (loop (rest ds)
                 next-carry
                 (cons digit acc)))]))
    (loop digits 0 '()))
  
  (define digits
    (for/fold ([d '(1)])  ; LSD-first
              ([i (in-range 1 (add1 n))])
      (multiply-digits d i)))
  (apply + digits))
```
