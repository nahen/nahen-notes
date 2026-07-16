---
created: 2026-03-26
modified: 2026-06-30
tags:
  - 📝
aliases:
parents:
title:
---
>[!memo] [Problem 5](https://projecteuler.net/problem=5) 「最小の倍数」
2520 は 1 から 10 の数字の全ての整数で割り切れる数字であり, そのような数字の中では最小の値である.  
では, 1 から 20 までの整数全てで割り切れる数字の中で最小の正の数はいくらになるか.

おそらく下のアルゴリズムでできそう？
1. n 未満の素数を求める  
   例：1〜10の場合、(2, 3, 5, 7)
2. 各素数において、値が n 未満となる累乗の最大値を求める  
   例：1〜10の場合、(8, 9, 5, 7)
3. 上記で求めた最大値のセットを掛け合わせる 

→「最小公倍数（LCM）は、各素因数の最大べき乗の積」らしいので、間違ってなかった

## 学んだこと
- まずは具体例から考える
- `(for/product)`
	- `(for)`で求めた各項目を掛け合わせる

## 自分が書いたコード
- `(prime? n)`が手続型に近い
- `(foldl * 1 (map ...))`はやっつけがすぎる
	- `(for/product ...)`を知らなかった
```racket
;; prime-list : Number -> (listof Number)
;; 指定した値までに存在する素数リストを出力する
(define (prime-list n)
  (define (prime? n)
    (cond [(< n 2) false]
          [(= n 2) true]
          [(even? n) false]
          [else
           (let loop ([i 3])
             (cond [(> (* i i) n) true]
                   [(zero? (modulo n i)) false]
                   [else (loop (+ i 2))]))]))

(for/list ([i (in-range 2 (add1 n))]
           #:when (prime? i))
  i))
  
;; max-multiple : Number Number -> Number
;; 指定した素数において、制限値以下で最大の累乗値を返す
(define (max-multiple n max)
  (define (inner-loop i)
    (cond [(> (expt n i) max)
           (expt n (- i 1))]
          [else
           (inner-loop (add1 i))]))
  
  (inner-loop 1))
  
;; smallest-multiple : Number -> Number
;; 1〜n までの整数全てで割り切れる数字の中で最小の正の数を出力する

(define (smallest-multiple n)
  (foldl * 1
         (map (lambda (i)
                (max-multiple i n))
              (prime-list n))))
```

## Geminiによる改善案
- `(max-multiple n max)`を削除
	- `(smallest-multiple)`内の`(max-power p)`として統合
- `(for/product)`によるコードの簡略化

```racket
;; prime-list : Number -> (listof Number)
;; 指定した値までに存在する素数リストを出力する
(define (prime-list n)
  (define (prime? n)
    (and (> n 1)
         (or (= n 2)
             (and (odd? n)
                  (for/and ([i (in-range 3 (add1 (integer-sqrt n)) 2)])
                    (not (zero? (modulo n i))))))))

  (for/list ([i (in-range 2 (add1 n))]
             #:when (prime? i))
    i))

;; smallest-multiple : Number -> Number
;; 1〜n までの整数全てで割り切れる数字の中で最小の正の数を出力する
(define (smallest-multiple n)
  ;; p を n を超えない範囲で掛け算し続ける
  (define (max-power p)
    (let loop ([val p])
      (if (> (* val p) n)
          val
          (loop (* val p)))))

  (for/product ([p (prime-list n)])
    (max-power p)))
```