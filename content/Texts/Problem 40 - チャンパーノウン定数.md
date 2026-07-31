---
created: 2026-07-01
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 40](http://projecteuler.net/problem=40) 「チャンパーノウン定数」
> 正の整数を順に連結して得られる以下の10進の無理数を考える:
>
> 0.12345678910==1==112131415161718192021...
> 
> 小数第12位は1である.
> 
> $d_n$ で小数第 n 位の数を表す. $d_1 \times d_{10} \times d_{100} \times d_{1000} \times d_{10000} \times d_{100000} \times d_{1000000}$ を求めよ.

初めて聞く単語、チャンパーノウン定数。本来は無理数だけれど、100万位までを上限（下限？）とする定数と考えてよさそう。

この問題は以下のように、定数を文字列として扱えば楽かも。
- 定数0.12345… = 文字列"12345…"
- 小数第 n 位 = n 文字目

- ~~チャンパーノウン定数を作り出す関数~~
	- ~~カウントアップする数字を100万文字になるまで末尾に加えていく関数~~
	- 100万文字の生成に10秒以上かかったので使わないことにした
- チャンパーノウン定数の小数第 n 位を取得する関数

## 学んだこと
- まず探索より始めよ
	- 「数学的な解法から始めた方が効率的だろ」という気持ちもわかるが
- 数学的解法を学んだあとは、その解法を思い出せるようにしよう
	- この習慣づけができていない……

## 自分が書いたコード
- チャンパーノウン定数の小数第 n 位を取得する関数を使って、積を出す

```racket
;; solve-40 : -> Natural
;; チャンパーノウン定数の小数第1, 10, 100, 1000, 10000, 100000, 1000000位の積を出力する
(define (solve-40)
  ;; champernowne : Natural -> Natural
  ;; チャンパーノウン定数から小数第 n 位を出力する
  (define (champernowne n)
    (define-values (cham cnt)
      (for/fold ([cham "0"]
                 [count n])
                ([i (in-naturals 1)]
                 #:break (<= count 0))
        (let* ([s (number->string i)]
               [current-count (- count (string-length s))])
          (cond [(<= current-count 0)
                 (values (string-ref s (+ (sub1 (string-length s)) current-count)) current-count)]
                [else (values cham current-count)]))))
  
    (- (char->integer cham) (char->integer #\0)))
  
  (let loop ([n 1] [acc 1])
    (if (= n 1000000)
        (* acc (champernowne n))
        (loop (* n 10)
              (* acc (champernowne n))))))
```

## LLMによる改善案
- `(champernowne n)`を`(digit-at n)`に変更
	- チャンパーノウン定数から小数第 n 位を数学的に取り出す
		- 小数第 n 位に位置する正の整数が何桁の数字かを調べる
			- 小数第1〜9位：1桁の整数
			- 小数第10〜189位：2桁の整数
			- 小数第190〜2889位：3桁の整数 
		- 桁がわかったら以下の2つを求める
			- 該当桁の整数のうち何番目の整数か（桁数で商）
			- 整数の何の位か（余り）
- `(let loop ...)`を`(for/fold ...)`に置き換え
	- こちらの方が読みやすいかも
- 繰り返す回数が減るので処理がかなり速い

```racket
;; solve-40 : -> Natural
;; チャンパーノウン定数の小数第1, 10, 100, 1000, 10000, 100000, 1000000位の積を出力する
(define (solve-40)
  ;; digit-at : Natural -> Natural
  ;; チャンパーノウン定数から小数第 n 位の値を出力する
  (define (digit-at n)
    (let loop ([digits 1] [cnt (sub1 n)])
      (let* ([base (expt 10 (sub1 digits))]
             [max-count (* 9 base digits)])
        (cond [(< cnt max-count)
               (define-values (q r) (quotient/remainder cnt digits))
               (let ([target-num (+ base q)]
                     [rem-digits (- digits r 1)])
                 (remainder (quotient target-num (expt 10 rem-digits)) 10))]
              [else (loop (add1 digits) (- cnt max-count))]))))
  
  (for/fold ([acc 1])
            ([i (in-range 0 7)])
    (* acc (digit-at (expt 10 i)))))
```

## 参考
- [チャンパーノウン定数 \| 高校数学の美しい物語](https://manabitimes.jp/math/2281)