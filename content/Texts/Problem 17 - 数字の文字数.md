---
created: 2026-04-27
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 17](http://projecteuler.net/problem=17) 「数字の文字数」
> 1 から 5 までの数字を英単語で書けば one, two, three, four, five であり, 全部で 3 + 3 + 5 + 4 + 4 = 19 の文字が使われている.  
> では 1 から 1000 (one thousand) までの数字をすべて英単語で書けば, 全部で何文字になるか.
> 
> **注**: 空白文字やハイフンを数えないこと. 例えば, 342 (three hundred and forty-two) は 23 文字, 115 (one hundred and fifteen) は20文字と数える. なお, "and" を使用するのは英国の慣習.

プログラミングの問題。数値を文字列に変換するテーブルをつくって、できあがった文字数を数える。あるいは間の文字列を省いて、文字数にすぐ変換してもいいかも。

1〜1000の数字の英単語は以下の組み合わせでできている。ただし2桁区切り文字は無視できる。
- 0-9（one, two, three, ..., nine）
- 11-19（eleven, twelve, thirteen, ... nineteen）
- 2桁の10の倍数（ten, twenty, thirty, ..., ninety）
- 2桁区切り文字（ハイフン）
- 3桁区切り文字（hundred）
- 接続文字（and）
- 1000（one thousand）

## 学んだこと
- `vector`を使おう

## 自分が書いたコード
- `number-letter-counts`で合計値を出す
	- 各数値の文字数を`letter-count`で出す
- 値は千の位、百の位、その余りの3つに分ける
	- 千の位が1ならば、"one thousand"と置く
	- 百の位と余りがどちらも0より大きければ、"and"をつける
	- 余りは3通りで場合分け
		- 0〜9、11〜19、それ以外
- テーブルの作り方がわからなかった
	- テーブルを使えば`letter`や`teen`を作る必要はない

```racket
;; letter: Integer[1-9] -> Integer
;; 1-9の数値を文字数に変換する（0の文字数は0とする）
(define (letter num)
  (cond [(= num 0) 0]
        [(= num 1) 3];one
        [(= num 2) 3];two
        [(= num 3) 5];three
        [(= num 4) 4];four
        [(= num 5) 4];five
        [(= num 6) 3];six
        [(= num 7) 5];seven
        [(= num 8) 5];eight
        [(= num 9) 4]));nine

;; teen : Integer[11-19] -> Integer
;; 11-19の数値を文字数に変換する
(define (teen num)
  (cond [(= num 11) 6];eleven
        [(= num 12) 6];twelve
        [(= num 13) 8];thirteen
        [(= num 14) 8];fourteen
        [(= num 15) 7];fifteen
        [(= num 16) 7];sixteen
        [(= num 17) 9];seventeen
        [(= num 18) 8];eighteen
        [(= num 19) 8]));nineteen

;; ty : Integer[20,30,...,90] -> Integer
;; 10の倍数を文字数に変換する
(define (ty num)
  (cond [(= num 10) 3];ten
        [(= num 20) 6];twenty
        [(= num 30) 6];thirty
        [(= num 40) 5];forty
        [(= num 50) 5];fifty
        [(= num 60) 5];sixty
        [(= num 70) 7];seventy
        [(= num 80) 6];eighty
        [(= num 90) 6]));ninety

;; letter-count : Integer -> Integer
;; 入力値の文字数を出力する
(define (letter-count num)
  (define t (quotient num 1000))
  (define h (quotient (remainder num 1000) 100))
  (define n (remainder num 100))

  (define demil
    (if (and (> h 0) (> n 0)) 3 0));and

  (define hundred-count
    (cond [(zero? h) 0]
          [else (+ (letter h) 7)]));hundred
  
  (define two-digit-count
    (cond [(<= n 0) 0]
          [(and (<= 1 n) (<= n 9)) (letter n)]
          [(and (<= 11 n) (<= n 19)) (teen n)]
          [else
           (let ([q (quotient n 10)]
                 [r (remainder n 10)])
             (+ (ty (* q 10)) (letter r)))]))

  (cond [(> t 0) (+ 3 8)];one thousand
        [else (+ hundred-count demil two-digit-count)]))

;; number-letter-counts : Integer -> Integer
;; 1〜入力値までの文字数の合計値を出力する
(define (number-letter-counts num)
  (for/sum ([i (in-range 1 (add1 num))])
    (letter-count i)))
```

## LLMによる改善案
- `number-letter-counts`で合計値を出すところは同じ
- テーブルを3種類つくる
	- 1〜10、11〜19、十の位
- マジックナンバーを定数に置き換え

```racket
;; ================================
;; データ定義
;; ================================

;; 1〜9
(define digit-table
  #(0 3 3 5 4 4 3 5 5 4))

;; 10〜19
(define teen-table
  #(3 6 6 8 8 7 7 9 8 8))
;; index = 数値 - 10

;; 20,30,...,90
(define tens-table
  #(0 0 6 6 5 5 5 7 6 6))
;; index = tens digit (2〜9)

;; 定数
(define HUNDRED 7)
(define THOUSAND 8)
(define AND 3)

;; ================================
;; 基本変換関数
;; ================================

(define (digit-count n)
  (vector-ref digit-table n))

(define (teen-count n)
  (vector-ref teen-table (- n 10)))

(define (tens-count n)
  (vector-ref tens-table n))

;; ================================
;; 2桁の処理(データ駆動のコア)
;; ================================

(define (two-digit-count n)
  (cond
    [(zero? n) 0]
    [(< n 10) (digit-count n)]
    [(< n 20) (teen-count n)]
    [else
     (let ([t (quotient n 10)]
           [r (remainder n 10)])
       (+ (tens-count t)
          (digit-count r)))]))

;; ================================
;; 3桁・4桁の合成ルール
;; ================================

(define (three-digit-count n)
  (let* ([h (quotient n 100)]
         [rest (remainder n 100)]
         [hundred-part
          (if (zero? h)
              0
              (+ (digit-count h) HUNDRED))]
         [and-part
          (if (and (> h 0) (> rest 0))
              AND
              0)])
    (+ hundred-part
       and-part
       (two-digit-count rest))))

(define (letter-count n)
  (cond
    [(= n 1000)
     (+ (digit-count 1) THOUSAND)] ; one thousand
    [else
     (three-digit-count n)]))

(define (number-letter-counts limit)
  (for/sum ([i (in-range 1 (add1 limit))])
    (letter-count i)))
```
