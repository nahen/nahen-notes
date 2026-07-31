---
created: 2026-06-25
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 38](http://projecteuler.net/problem=38) 「パンデジタル倍数」
> 192 に 1, 2, 3 を掛けてみよう.
> 
> 192 × 1 = 192  
> 192 × 2 = 384  
> 192 × 3 = 576
> 
> 積を連結することで1から9の [パンデジタル数](http://ja.wikipedia.org/wiki/%E3%83%91%E3%83%B3%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E6%95%B0) 192384576 が得られる. 192384576 を 192 と (1,2,3) の連結積と呼ぶ.
> 
> 同じようにして, 9 を 1,2,3,4,5 と掛け連結することでパンデジタル数 918273645 が得られる. これは 9 と (1,2,3,4,5) との連結積である.
> 
> 整数と (1,2,...,n) (n > 1) との連結積として得られる9桁のパンデジタル数の中で最大のものはいくつか?

パンデジタル数は確か、1〜9の数字をひとつずつ使ってできる整数だったか。9桁のパンデジタル数の個数は $9! = 362880$ 個なので、そこから素直に全探索する手もあるか？

ところで、連結積が9桁となる場合の、整数と掛ける数の組み合わせは以下のとおりになる。
- 4桁の整数（5000〜）と(1, 2)
- 3桁の整数（100〜333）と(1, 2, 3)
- 2桁の整数
	- （25〜33）と(1, 2, 3, 4)
- 1桁の整数
	- 1と(1, 2, 3, ..., 9)
	- 3と(1, 2, 3, ..., 6)
	- （5〜9）と(1, 2, 3, 4, 5)

- 整数と掛ける数のリストから連結積を作る関数
- 値がパンデジタル数かどうか判定する関数
- 9桁のパンデジタル数のリストから最大値を取得する関数

## 学んだこと
- 問題文がすでに探索空間を示していることがある
	- 整数9と(1, 2, 3, 4, 5)の連結積が918273645
		- これよりも大きい連結積があるか調べればいい
	- 探索範囲は、4桁かつ最上位が9の整数だけ
		- 2〜3桁の整数では9桁の連結積が作れない
- `string-append*`
	- 文字列のリストをそのまま結合したいなら、`string-join`よりもこちらの方が便利？

## 自分が書いたコード
- ゴリ押し
	- 整数が4桁の場合、3桁の場合、1桁の場合でそれぞれ求める
		- パンデジタル数となる連結積が見つからなかったので、整数が2桁の場合は除外

```racket
;; solve-38 : -> Natural
;; 連結積として得られる9桁のパンデジタル数の中で最大のものを出力する
(define (solve-38)
  ;; concatenate : Natural Natural -> Natural
  ;; 整数と連結数から連結積を作る
  (define (concatenate num product)
    (define con
      (string-join
       (for/list ([i (in-range 1 (add1 product))])
         (number->string (* num i)))
       ""))
    (string->number con))

  ;; pandigital? : Natural -> Boolean
  ;; 数字が9桁かつパンデジタル数かどうか判定する
  (define (pandigital? n)
    (define 9-digits?
      (and (>= n 100000000) (< n 1000000000)))
    (define pan?
      (let ([str (number->string n)]
            [nums '("1" "2" "3" "4" "5" "6" "7" "8" "9")])
        (for/and ([i nums])
          (string-contains? str i))))
  
    (and 9-digits? pan?))
  
  (define 4-digits
    (for/list ([i (in-range 5000 10000)]
        #:do [(define con (concatenate i 2))]
        #:when (pandigital? con))
    con))
  (define 3-digits
    (for/list ([i (in-range 100 334)]
        #:do [(define con (concatenate i 3))]
        #:when (pandigital? con))
    con))
  (define 1-digits
    (list (concatenate 1 9) (concatenate 9 5)))
  
  (apply max (append 4-digits 3-digits 1-digits)))
```

## LLMによる改善案
- 探索範囲は9234〜9487まで削減できる

```racket
;; solve-38 : -> Natural
;; 連結積として得られる9桁のパンデジタル数の中で最大のものを出力する
(define (solve-38)
  ;; 9桁の文字列が1-9のパンデジタルか判定する
  (define (pandigital-9? str)
    (and (= (string-length str) 9)
         (not (string-contains? str "0"))
         (= (set-count (list->set (string->list str))) 9)))
  
  ;; 4桁のM(9234から9487)を大きい順に探索
  (let loop ([m 9487])
    (if (< m 9234)
        918273645 ;; 万が一見つからなければ既知のM=9の値を返す
        (let* ([p1 (number->string m)]
               [p2 (number->string (* m 2))]
               [combined (string-append p1 p2)])
          (if (pandigital-9? combined)
              (string->number combined)
              (loop (- m 1)))))))
```

## 参考
- 