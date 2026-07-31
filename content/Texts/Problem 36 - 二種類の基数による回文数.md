---
created: 2026-06-17
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 36](http://projecteuler.net/problem=36) 「二種類の基数による回文数」
> $585 = 1001001001_2$ (2進) は10進でも2進でも回文数である.
> 
> 100万未満で10進でも2進でも回文数になるような数の総和を求めよ.
> 
> (注: 先頭に0を含めて回文にすることは許されない.)

- 10進数を2進数に変換する
- 10進数と2進数で回文数か否かを判定する

racketでは意外にも、`number->string`で10進数を2進数に変換できる。

100万未満かつ10進数の回文数は、a, aa, aba, abba, abcba, abccbaの形になる。つまり1〜3桁の数字であるa, ab, abcの組み合わせから作られる。（aaはabに、abaはabcに内包される）

## 学んだこと
- 偶数桁の回文数は11の倍数になる
- 検索対象が整数全域よりも少なければ、その対象を生成する方が処理が速くなる
	- 「探索ではこれ以上改善できなさそう」と思ったら検討する？

## 自分が書いたコード
- 素直に全部の数字を探索して解くやり方
	- 10進数と2進数の数字を文字列に変換する
		- どちらの文字列も回文になっているかを判定する
		- 判定を満たす数値のみを足し合わせる
- 回文判定の`(palindrome? str)`はLLMの知恵を借りた
	- 当初は`(list->string (reverse (string->list str)))`とした
		- 文字列をリスト化したら逆順にして、再度文字列化
		- 実装は楽だけど`reverse`に処理時間がかかった

```racket
;; solve-36 : Natural -> Natural
;; limit未満の範囲で、10進数でも2進数でも回文数となる数字の和を求める
(define (solve-36 limit)
  (define (palindrome? str)
    (define len (string-length str))
    (for/and ([i (in-range (quotient len 2))])
      (char=? (string-ref str i)
              (string-ref str (- len i 1)))))
  
  (for/sum ([i (in-range 1 limit)]
             #:when (palindrome? (number->string i))
             #:when (palindrome? (number->string i 2)))
    i))
```

## LLMによる改善案（全探索）
- `(for/sum)`の探索範囲を`(in-range 1 limit 2)`に変更
	- 2進数の回文数はかならず奇数になる
		- 先頭は1固定なので、末尾も1固定になる
		- これだけで探索範囲が半分に減る
```racket
;; solve-36 : Natural -> Natural
;; limit未満の範囲で、10進数でも2進数でも回文数となる数字の和を求める
(define (solve-36 limit)
  (define (palindrome? str)
    (define len (string-length str))
    (for/and ([i (in-range (quotient len 2))])
      (char=? (string-ref str i)
              (string-ref str (- len i 1)))))
  
  (for/sum ([i (in-range 1 limit 2)]
             #:when (palindrome? (number->string i))
             #:when (palindrome? (number->string i 2)))
    i))
```

## LLMによる別解（回文数の生成）
- 回文数を生成したうえで、条件に一致する回文数を足し合わせる
	- 奇数桁の回文数、偶数桁の回文数を`(in-range 1 1000)`から生成する
	- 生成した回文数が2進数でも回文数かどうかを判定
- 全探索よりもかなり速く処理が終わる
	- 探索範囲がおよそ100万→2000ほどになる

```racket
;; solve-36-alt : Natural -> Natural
;; 100万未満の整数で、10進数でも2進数でも回文数となる数字の和を求める
(define (solve-36-alt)
  ;; 回文数を作る再帰関数
  (define (loop pal x)
    (cond [(zero? x) pal]
          [else
           (let-values ([(q r) (quotient/remainder x 10)])
             (loop (+ (* pal 10) r) q))]))
  ;; 桁数が奇数の回文数
  (define (odd-palindrome n)
    (loop n (quotient n 10)))
  ;; 桁数が偶数の回文数
  (define (even-palindrome n)
    (loop n n))

  (define (binary-palindrome? n)
    (define b (number->string n 2))
    (define len (string-length b))
    (for/and ([i (in-range (quotient len 2))])
      (char=? (string-ref b i)
              (string-ref b (- len i 1)))))
  
  (+
   (for/sum ([i (in-range 1 1000)]
               #:do [(define odd-p (odd-palindrome i))]
               #:when (binary-palindrome? odd-p))
     odd-p)
   (for/sum ([i (in-range 1 1000)]
               #:do [(define even-p (even-palindrome i))]
               #:when (binary-palindrome? even-p))
     even-p)))
```
