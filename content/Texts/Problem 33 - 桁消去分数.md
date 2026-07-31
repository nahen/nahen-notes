---
created: 2026-06-10
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 33](http://projecteuler.net/problem=33) 「桁消去分数」
> 49/98 は面白い分数である.「分子と分母からそれぞれ9を取り除くと, 49/98 = 4/8 となり, 簡単な形にすることができる」と経験の浅い数学者が誤って思い込んでしまうかもしれないからである. (方法は正しくないが，49/98 の場合にはたまたま正しい約分になってしまう．)
> 
> 我々は 30/50 = 3/5 のようなタイプは自明な例だとする.
> 
> このような分数のうち, 1より小さく分子・分母がともに2桁の数になるような "自明でない" ものは, 4個ある.
> 
> その4個の分数の積が約分された形で与えられたとき, 分母の値を答えよ.

以下の条件に当てはまる分数を探せ、という問題。

- 分子・分母の一部に同じ数字が使われている（問題文の例では、4"9"/"9"8）
- その数字を取り除いてできる分数と、実際に約分した分数が一致する

つまり、探索範囲は以下のようになる。

- 分子nの範囲は11〜98（2桁の最大値である99は除外）
- 分母dの範囲は(n+1)〜99
- 分子と分母に共通する数字が使われている
	- ただし共通する数字が0の場合（10で割り切れる場合）は除外する

その中で、共通する数字を取り除いてできる分数が、実際の約分結果と一致するものを探す。

## 学んだこと
- 単純な条件分岐を嫌うな
	- 2ケタの数字を扱う問題に集合を使うのは過剰

## 自分が書いたコード
- 以下の範囲でひたすら条件を満たす分数を探す
	- 分子 $n (11 \leq n \leq 98)$
	- 分母 $d(n \lt d \leq 99)$
- 共通する数字は集合`set`を使って抽出
	- ゾロ目は~~処理がめんどくさくなる~~ 答えではないので除外する
- 重複する処理が多いけど、面倒くさくてそのままにしてしまった

```racket
;; solve-33 -> (listof Number)
;; 2桁からなる分子と分母のうち、共通の数字を取り除いた分数と元の分数が一致するものを抽出して、その積の分母を返す
(define (solve-33)
  (define (not-tens n) (> (modulo n 10) 0))
  (define (not-same-numbers n) (> (modulo n 11) 0))

  ;; cancelable?: Natural Natural -> Boolean
  ;; 分母と分子に共通する数字が存在するか判定する
  (define (cancelable? numerator denominator)
    (define (one-place n) (remainder n 10))
    (define (ten-place n) (quotient n 10))
  
    (for*/or ([d (list (one-place denominator) (ten-place denominator))]
              [n (list (one-place numerator) (ten-place numerator))])
      (and (not (= d 0))
           (= d n))))

  ;; cancel-frac: Natural Natural -> Number
  ;; 分母と分子から共通する数字を消去したうえで分数を返す。共通する数字が存在しない場合はそのまま。
  (define (cancel-frac numerator denominator)
    (define (one-place n) (remainder n 10))
    (define (ten-place n) (quotient n 10))

    (define n-set (set (one-place numerator) (ten-place numerator)))
    (define d-set (set (one-place denominator) (ten-place denominator)))
    (define cancel-num
      (let ([s (set-intersect n-set d-set)])
        (cond [(set-empty? s) empty]
              [else (set-first s)])))

    (define (cancel set)
      (cond [(empty? cancel-num) set]
            [else
             (let ([removed-s (set-remove set cancel-num)])
               (set-first removed-s))]))

    (define (same-numbers? n)
      (zero? (modulo n 11)))

    (cond [(or (empty? cancel-num)
               (same-numbers? numerator)
               (same-numbers? denominator))
           (/ numerator denominator)]
          [else
           (let ([canceled-n (cancel n-set)]
                 [canceled-d (cancel d-set)])
             (/ canceled-n canceled-d))]))

  (define products
    (for*/product ([n (in-range 11 99)]
                   [d (in-range (+ n 1) 100)]
                   #:when (and (cancelable? n d)
                               (and (not-tens n)
                                    (not-tens d))
                               (and (not-same-numbers n)
                                    (not-same-numbers d))
                               (= (cancel-frac n d) (/ n d))))
      (/ n d)))
```

## LLMによる改善案
- 共通する数字の有無を条件分岐で分ける
	- 古典的な条件分岐でいいんだ……
```racket
(define (solve-33-v2)
  (define (curious-fraction? n d)
    (define-values (n10 n1) (values (quotient n 10) (remainder n 10)))
    (define-values (d10 d1) (values (quotient d 10) (remainder d 10)) )

    (and
     (< n d)
     (not (= n1 0))
     (not (= d1 0))

     (or
      (and (= n10 d10)
           (= (/ n d) (/ n1 d1)))

      (and (= n10 d1)
           (= (/ n d) (/ n1 d10)))

      (and (= n1 d10)
           (= (/ n d) (/ n10 d1)))

      (and (= n1 d1)
           (= (/ n d) (/ n10 d10))))))
  
  (denominator
   (for*/product ([n (in-range 10 100)]
                  [d (in-range (add1 n) 100)]
                  #:when (curious-fraction? n d))
     (/ n d))))
```
