---
created: 2026-04-17
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 14](http://projecteuler.net/problem=14) 「最長のコラッツ数列」
> 正の整数に以下の式で繰り返し生成する数列を定義する.  
>> _n_ → _n_/2 (_n_ が偶数)  
>> _n_ → 3_n_ + 1 (_n_ が奇数)
>
> 13からはじめるとこの数列は以下のようになる.  
> 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
>
> 13から1まで10個の項になる. この数列はどのような数字からはじめても最終的には 1 になると考えられているが, まだそのことは証明されていない(コラッツ問題)
>
 >さて, 100万未満の数字の中でどの数字からはじめれば最長の数列を生成するか.  
> **注意**: 数列の途中で100万以上になってもよい

コラッツ数列なんてのがあるんやね。

例えば12なら、「12→6→3→10→5→16→8→4→2→1」で10項。つまり、値が2の累乗になった瞬間、そこから1へと収束する。

素直に考えるなら、ひとつずつコラッツ数列を求めることになる。でもそれだと100万回数列を求めることになる。もっと手軽な方法がある気がする。~~メモ化が使えるかもしれないが、素直に計算し続けてもよさそう。~~ メモ化を使えるようにしようね。

~~または、1から木構造を作るように逆方向から生成していく。100万未満の数字はすべて1になるという仮定が必要になるが、重複計算を省ける。なのでこちらの方が時間はかからないと思う。~~ 良くない。探索空間の指数的な爆発が起こる。

## 学んだこと
- 

## 自分が書いたコード
- 1〜100万まで愚直にコラッツ数列を作り続ける
- 最長の数列を内部で保持し続ける
	- 最後にそのリストの先頭要素（＝最初の数字）を出力する
	- めちゃくちゃ時間がかかる

```racket
;; longest-collatz-seq : Integer -> Integer
;; 入力値未満の数字でコラッツ数列が最長となる数字を出力する
(define (longest-collatz-seq limit)
  (define (collatz-seq n)
    (define (next-collatz n)
      (cond [(<= n 1) 0]
            [(odd? n) (+ (* n 3) 1)]
            [else (/ n 2)]))
  
    (cond [(< n 1) empty]
          [else (cons n (collatz-seq (next-collatz n)))]))
  
  (define (loop i longest-list)
    (cond [(< i 0) longest-list]
          [else
           (let* ([collatz (collatz-seq i)]
                  [new-max? (< (length longest-list) (length collatz))]
                  (max-seq (if new-max? collatz longest-list)))
             (loop (sub1 i) max-seq))]))

  (first (loop (sub1 limit) '())))
```

## LLMによる改善案
- メモ化を使う
- コラッツ数列を求めず、その列の長さだけを保持する
- 計算時間が1/8に削減

```racket
;; longest-collatz : Integer -> Integer
;; limit 未満で最長のコラッツ列を生成する数を返す
(define (longest-collatz limit)

  ;; memo[i] = i のコラッツ列の長さ(0なら未計算)
  (define memo (make-vector limit 0))
  (vector-set! memo 1 1)

  ;; next-collatz : Integer -> Integer
  (define (next-collatz n)
    (if (even? n)
        (quotient n 2)
        (+ (* 3 n) 1)))

  ;; collatz-length : Integer -> Integer
  ;; メモ化付きで長さを計算
  (define (collatz-length start)
    (let loop ([n start] [steps 0])
      (cond
        [(and (< n limit) (> (vector-ref memo n) 0))
         (+ steps (vector-ref memo n))]
        [else
         (loop (next-collatz n) (add1 steps))])))

  ;; メインループ
  (let loop ([i 1] [best-n 1] [best-len 1])
    (cond
      [(= i limit) best-n]
      [else
       (define len (collatz-length i))
       (when (< i limit)
         (vector-set! memo i len))
       (if (> len best-len)
           (loop (add1 i) i len)
           (loop (add1 i) best-n best-len))])))
```

## 参考
- [My C++ solution for Project Euler 14: Longest Collatz sequence](https://euler.stephan-brumme.com/14/)