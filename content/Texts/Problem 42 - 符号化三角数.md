---
created: 2026-07-08
modified: 2026-07-09
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 42](http://projecteuler.net/problem=42) 「符号化三角数」
> 三角数の $n$ 項は $t_n = n(n+1)/2$ で与えられる. 最初の10項は
> 
> 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...
> 
> である.
> 
> 単語中のアルファベットを数値に変換した後に和をとる. この和を「単語の値」と呼ぶことにする. 例えば SKY は $19 + 11 + 25 = 55 = t_{10}$ である. 単語の値が三角数であるとき, その単語を三角語と呼ぶ.
> 
> 16Kのテキストファイル [words.txt](https://projecteuler.net/project/resources/p042_words.txt) 中に約2000語の英単語が記されている. 三角語はいくつあるか?
>

[[Problem 22 - 名前のスコア]]の亜種。

- ファイルを読み取って単語のリストを出力する関数
- 単語から単語の値を出力する関数
	- アルファベットを数値に変換する関数
- 数値が三角数かどうかを判定する関数

## 学んだこと
- 

## 自分が書いたコード
- ファイルを読み込む関数は[[Problem 22 - 名前のスコア]]を流用
- 「三角数かどうかは、O(1)で求められるのでは？」と急に気づいた
	- 三角数 $t$ は $\frac{n(n+1)}{2}$ 、つまり $2t = n(n+1)$ で表せる
	- それなら $n$ に`(integer-sqrt 2t)`を代入して、等式が成り立てば三角数じゃね？
- ただし、`2t = (* root2t (+ root2t 1))`は本当に三角数でしか成立しないのか？　という疑いがある

```racket
;; solve-42 : (listof String) -> Natural
;; 単語のリストに含まれる三角語（単語の値が三角数となるもの）の個数を求める
(define (solve-42 los)
  ;; alphabet->number : Char -> Natural
  ;; アルファベット(大文字)を数値に変換する
  (define (alphabet->number c)
    (- (char->integer c) (sub1 (char->integer #\A))))
  
  ;; word-value : String -> Natural
  ;; 入力した単語から、単語の値を算出する
  (define (word-value s)
    (for/sum ([c s])
      (alphabet->number c)))
  
  ;; triangle? : Natural -> Boolean
  ;; 入力値が三角数かどうかを判定する
  (define (triangle? n)
    (let* ([2n (* 2 n)]
           [root2n (integer-sqrt 2n)])
      (= (* root2n (+ root2n 1)) 2n)))
  
  (for/sum ([s los]
            #:do [(define v (word-value s))]
            #:when (triangle? v))
    1))
```

## LLMによる改善案
- `triangle?`を[二次方程式の解の公式 ](https://ja.wikipedia.org/wiki/%E4%BA%8C%E6%AC%A1%E6%96%B9%E7%A8%8B%E5%BC%8F%E3%81%AE%E8%A7%A3%E3%81%AE%E5%85%AC%E5%BC%8F)を使う形に変更
	- 解の公式：$ax^2 + bx + c = 0$ のとき、 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
	- 今回：$n^2 + n - 2t = 0$ のとき、$n = \frac{-1 + \sqrt{1 + 8t}}{2}$
		- $n > 0$ かつ $t > 0$ なので、$n \neq \frac{-1 - \sqrt{1 + 8t}}{2}$
	- $1 + 8t$ が平方数であれば、 $t$ は三角数
- それ以外はそのまま

```racket
;; triangle? : Natural -> Boolean
;; 入力値が三角数かどうかを判定する
(define (triangle? t)
  ;; 8t+1 が平方数なら t は三角数
  (define discriminant (+ 1 (* 8 t)))
  (define root (integer-sqrt discriminant))
  (= (* root root) discriminant))
```

## 参考
- [Jacob Elafandi: Project Euler, Problem 42](https://math.berkeley.edu/~elafandi/euler/p42/)