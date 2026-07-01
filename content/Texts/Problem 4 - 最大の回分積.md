---
created: 2026-03-25
modified: 2026-03-26
tags:
  - 📝
aliases:
parents:
title:
url: https://odz.sakura.ne.jp/projecteuler/?Problem+4
---
>[!problem] Problem 4 「最大の回文積」
左右どちらから読んでも同じ値になる数を回文数という. 2桁の数の積で表される回文数のうち, 最大のものは 9009 = 91 × 99 である.  
では, 3桁の数の積で表される回文数の最大値を求めよ.

## 学んだこと
- `for/fold`
	- Racketでループ後の算出結果を返したいときは、これを使うといい
- 枝刈り（Pruning）
	- 最適解にならないと確定したルートは、それ以降計算しない
		- 計算しても時間のムダ
	- この問題で枝刈りできるタイミング
		- すでに積を求めた組み合わせ
			-  $999 \times 998$ を求めたら、 $998 \times 999$ は無意味
		- 現時点での最大回文数よりも求めた積が小さい

## 自力で書いたコード
- `for/fold`を知らなかったので、再帰構造を2つ続けて書いた
- 回文数が見つかったらすぐに`inner-loop`から抜ける
	- あまり良くないらしい
	- 回文数が見つからないと100までカウントダウンして計算してしまう

```racket
(define (max-3-digit-pn)
  (define MIN-LIMIT 100)
  (define MAX-LIMIT 999)
  
  (define (outer-loop i max-pn)
    (let ([pn (inner-loop i i)])
      (cond [(< i MIN-LIMIT) max-pn]
            [(> pn max-pn) (outer-loop (- i 1) pn)]
            [else (outer-loop (- i 1) max-pn)])))

  (define (inner-loop i j)
    (let ([n (* i j)])
      (cond [(< j MIN-LIMIT) 0]
            [(is-pn? n) n]
            [else (inner-loop i (- j 1))])))

  (define (is-pn? num)
    (let ([lst (string->list (number->string num))])
      (equal? lst (reverse lst))))
  
  (outer-loop MAX-LIMIT 0))
```

## Geminiによる改善コード
- 計算した積が現在での最大回文数より小さければ、`inner-max`から抜ける
	- 計算量がめちゃくちゃ減る

```racket
(define (max-3-digit-pn)
  (define (palindrome? n)
    (let ([s (number->string n)])
      (equal? s (list->string (reverse (string->list s))))))

  (define (inner-max i current-max)
    (for/fold ([max-pn current-max])
              ([j (in-range i 99 -1)]
               #:break (< (* i j) max-pn))
      (let ([n (* i j)])
        (if (and (> n max-pn) (palindrome? n))
            n
            max-pn))))

  (for/fold ([max-pn 0])
            ([i (in-range 999 99 -1)])
    (inner-max i max-pn)))
```