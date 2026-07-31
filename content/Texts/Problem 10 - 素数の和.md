---
created: 2026-04-08
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 10](https://projecteuler.net/problem=10) 「素数の和」
>10以下の素数の和は 2 + 3 + 5 + 7 = 17 である.  
>200万以下の全ての素数の和を求めよ.

素数を見つけ出す公式といえば、エラトステネスの篩。~~でもここでは、[[Problem 7 - 10001番目の素数|Problem 7]]で作った関数を使えばよさそう。~~ 効率性を考えるなら、エラトステネスの篩を使おう。

## 学んだこと
- 大量の素数（6〜8桁までの全素数）を扱うなら、試し割り法よりもエラトステネスの篩
- `(make-bytes k [b])`
	- 長さ`k`で、初期値がバイト値`b`（整数0〜255）の配列を作る
	- ここでは、1は素数、0はそれ以外の数として使っている

## 自分が書いたコード
- `prime?`は[[Problem 7 - 10001番目の素数]]の流用（試し割り法）
- 素数を`for/sum`で足し合わせただけ

```racket
;; sum-of-primes : Integer -> Integer
;; n以下のすべての素数の和を出力する
(define (sum-of-primes n)
  ;; prime? : Integer -> Boolean
  ;; 入力値が素数か否か
  (define (prime? n)
    (cond [(<= n 1) #f]
          [(<= n 3) #t]
          [(or (zero? (modulo n 2)) (zero? (modulo n 3))) #f]
          [else
           (for/and ([i (in-range 5 (add1 (integer-sqrt n)) 6)])
             (and (not (zero? (modulo n i)))
                  (not (zero? (modulo n (+ i 2))))))]))
  
  (for/sum ([i (in-range 2 (add1 n))]
            #:when (prime? i))
    i))
```

## LLMによる改善案
- エラトステネスの篩を使って素数の配列を作成
	- 配列の添字＝素数になりうる値
	- 初期値: `[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, ...]`
	- p = 2 : `[0, 0, 1, 1, 0, 1, 0, 1, 0, 1, ...]`
		- 2の倍数はすべて0
	- p = 3 : `[0, 0, 0, 0, 0, 1, 0, 1, 0, 0, ...]`
		- 3の倍数はすべて0
	- これを $\sqrt{n}$ まで繰り返す

```racket
(define (sieve-sum n)
  (let ([table (make-bytes (add1 n) 1)])
    (define (mark-as-composite! i) (bytes-set! table i 0))
    (define (prime-at? i) (= (bytes-ref table i) 1))

    (mark-as-composite! 0)
    (mark-as-composite! 1)
    (for ([p (in-range 2 (add1 (integer-sqrt n)))]
          #:when (prime-at? p))
      (for ([i (in-range (* p p) (add1 n) p)])
        (mark-as-composite! i)))
    (for/sum ([i (in-range (add1 n))]
              #:when (prime-at? i))
      i)))
```

## 参考
- [エラトステネスのふるいとは \| アルゴ式](https://algo-method.com/descriptions/64)
- [Jacob Elafandi: Project Euler, Problem 10](https://math.berkeley.edu/~elafandi/euler/p10/)
	- より効率的に解ける「Lucy Hedgehog法（またはLucy-DP）」について言及している
		- 私にはわからなかった
	- [眠れない夜は素数の個数でも数えましょう - えびちゃんの日記](https://rsk0315.hatenablog.com/entry/2021/05/18/015511)
		- 日本語による解説だが、私にはわからなかった
	- [素数の個数や和を高速に計算できるLucy DPをやさしく説明 #Python - Qiita](https://qiita.com/masa0599/items/2704047579eaafb2a322)