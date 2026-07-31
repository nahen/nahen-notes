---
created: 2026-07-14
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 43](http://projecteuler.net/problem=43) 「部分文字列被整除性」
> 数1406357289は0から9のパンデジタル数である (0から9が1度ずつ現れるので). この数は部分文字列が面白い性質を持っている.
> 
> $d_1$を上位1桁目, $d_2$を上位2桁目の数とし, 以下順に$d_n$を定義する. この記法を用いると次のことが分かる.
> 
> - $d_2d_3d_4$ = 406 は 2 で割り切れる
> - $d_3d_4d_5$ = 063 は 3 で割り切れる
> - $d_4d_5d_6$ = 635 は 5 で割り切れる
> - $d_5d_6d_7$ = 357 は 7 で割り切れる
> - $d_6d_7d_8$ = 572 は 11 で割り切れる
> - $d_7d_8d_9$ = 728 は 13 で割り切れる
> - $d_8d_9d_{10}$ = 289 は 17 で割り切れる
> 
> このような性質をもつ0から9のパンデジタル数の総和を求めよ.

つまり、パンデジタル数の2桁目から抜き出してつくった3桁の数字が、それぞれ特定の素数で割り切れることを確認したらいいということ？

素直に解くとしたら、パンデジタル数をひたすら作ることになる。そのうえで、その数から得られる各々の3桁の数字が問題文の条件を満たすものだけを抽出する。

- 順列からパンデジタル数を生成する関数
- パンデジタル数から各3桁の数字を抽出する関数
- 各3桁の数字が問題文の条件を満たすか判定する関数

ところで、$d_n$ の中にはいくつか制約が存在する。
- $d_1$ は0以外
- $d_4$ は偶数
- $d_3 + d_4 + d_5$ が3の倍数
- ~~$d_6$は 0 または 5~~
	- 以下の制約により、$d_6$ には 5 しか入らない
		- $d_6 \neq d_7 \neq d_8$ （パンデジタル数なので）
		- $d_6d_7d_8$ は 11 で割り切れる
			- $d_6 = 0$ だと $d_7 = d_8$ となり、パンデジタル数でなくなる
		- 参考サイトを見るまで気づかなかった……
- $d_6 + d_8 - d_7$ が 0 または 11 になる
- $d_7d_8 + (d_9 \times 4)$ が13の倍数
- $(d_8 \times 2)-d_9d_{10}$が17の倍数

なんか、[[💭私は数独も好き|数独]]に見えてきた。空いたマス目にどの数字が当てはまるのか調べるという意味で。

## 学んだこと
- 条件を満たす対象が少ないのであれば、生成した方が速い

## 自分が書いたコード
- 和は求められるが、処理に10秒近くかかる
	- `(permutations (range 10))`を素直に調べすぎ

```racket
;; solve-43 : -> Natural
;; 問題文の性質を持つパンデジタル数を抽出して、その総和を求める
(define (solve-43)

  ;; substring : (listof Natural) -> (listof Natural)
  ;; リストから3桁の数字のリストを出力する
  (define (substring lst)
    (for/list ([a lst]
               [b (rest lst)]
               [c (rest (rest lst))])
      (+ (* 100 a) (* 10 b) c)))
  
  ;; multiples-of? : Natural Natural -> Boolean
  ;; nがiの倍数かどうかを判定する
  (define (multiples-of? n i)
    (zero? (modulo n i)))
  
  ;; all-true? : (listof Natural) -> Boolean
  ;; 順列から作られる数字のリストがそれぞれ問題文の条件を満たすかどうか判定する
  (define (all-true? digits)
    ;; 調べるのはd_2からなので、先頭のd_1は除外する
    (define sub (substring (rest digits)))
    (define primes '(2 3 5 7 11 13 17))

    (for/and ([s sub]
              [p primes])
      (multiples-of? s p)))
  
  ;; digits->number : (listof Naturals) -> Natural
  ;; 順列のリストを連結して数値に変換する
  (define (digits->number digits)
    (for/fold ([n 0])
              ([d digits])
      (+ (* 10 n) d)))

  ;; 0〜9でできる数字の順列から、問題文に適した組み合わせを抽出して、その数の和を求める
  (for/sum ([digits (permutations (range 10))]
             #:when (all-true? digits))
    (digits->number digits)))
```

## LLMによる改善案
- `(permutations (range 10))`を枝刈りする
- `multiples-of?`を削除
- 処理時間は短くなるが、それでも3秒近くかかる

```racket
;; solve-43 : -> Natural
;; 問題文の性質を持つパンデジタル数を抽出して、その総和を求める
(define (solve-43)
  ...
  (define (all-true? digits)
    ;; 調べるのはd_2からなので、先頭のd_1は除外する
    (define sub (substring (rest digits)))
    (define primes '(2 3 5 7 11 13 17))
    ;; それぞれの3桁の数字がそれぞれの素数で割り切れるかどうか判定する
    (for/and ([s sub]
              [p primes])
      (zero? (modulo s p))))
  ...
  ;; pandigitals : -> (lisrof Natural)
  ;; 0〜9でできる順列から、問題文を満たすものだけを抽出する
  (define pandigitals
    (filter (lambda (p)
                (and (> (list-ref p 0) 0)
                     (even? (list-ref p 3))
                     (or (= (list-ref p 5) 0) (= (list-ref p 5) 5))
                     (zero? (modulo (+ (list-ref p 2) (list-ref p 3) (list-ref p 4)) 3))))
            (permutations (range 10))))

  ;; 0〜9でできる数字の順列から、問題文に適した組み合わせを抽出する
  (for/sum ([digits pandigitals]
             #:when (all-true? digits))
    (digits->number digits)))
```

## LLMによる別解（候補生成）
- 探索空間の削減ではなく、候補の生成から始める
- 17で割り切れる3桁の数字 $d_8 d_9 d_{10}$ からスタート
	-  $d_8d_9d_{10}$ の先頭に一桁の数字 $d_7$ を加える
		- 新規の3桁数字 $d_7d_8d_9$ のうち、13で割り切れる候補だけを残す
	-  $d_7d_8d_9d_{10}$ の先頭に一桁の数字 $d_6$ を加える
		- 新規の3桁数字 $d_6d_7d_8$ のうち、11で割り切れる候補だけを残す
	- これを $d_2$ まで繰り返す
- 最後に、$d_2〜d_{10}$で使われなかった数字を $d_1$ として付け加える

```racket
(define (solve-43-alt)
  
  ;; three-digit-multiples : Natural -> (listof (listof Natural Natural Natural))
  ;; 入力値の倍数となる3桁の数字のリスト(ただし数字の重複なし)を生成する
  (define (three-digit-multiples p)
    (define LIMIT 1000)
    (for/list ([i (in-range p LIMIT p)]
               #:do [(define d1 (quotient i 100))
                     (define d2 (quotient (remainder i 100) 10))
                     (define d3 (remainder i 10))]
               #:when (and (not (= d1 d2))
                           (not (= d2 d3))
                           (not (= d3 d1))))
      (list d1 d2 d3)))

  ;; extend-left : (listof (listof Digit)) Natural -> (listof (listof (Digit)))
  ;; 3桁数字の先頭に0〜9を加えた新規リストのうち、先頭3桁の数字が p で割り切れるものだけを返す
  (define (extend-left lod p)
    (for*/list ([digit lod]
                [i (in-range 10)]
                #:when (and (not (memv i digit))
                            (zero? (modulo (+ (* i 100) (* (first digit) 10) (second digit)) p))))
      (cons i digit)))
  
  ;; digits->number : (listof Natural) -> Natural
  ;; 順列のリストを連結して数値に変換する
  (define (digits->number digits)
    (for/fold ([n 0])
              ([d digits])
      (+ (* 10 n) d)))

  (define largest-p 17)
  (define primes '(13 11 7 5 3 2))
  (define dividable-digits
    (for/fold ([lod (three-digit-multiples largest-p)])
              ([p primes])
      (extend-left lod p)))

  (for/sum ([d dividable-digits])
    (let ([missing
           (for/first ([i (in-range 10)]
                       #:unless (member i d))
             i)])
    (digits->number (cons missing d)))))
```

## 参考
- [Jacob Elafandi: Project Euler, Problem 43](https://math.berkeley.edu/~elafandi/euler/p43/)