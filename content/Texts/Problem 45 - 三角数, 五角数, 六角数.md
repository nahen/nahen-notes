---
created: 2026-07-28
modified: 2026-07-28
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 45](http://projecteuler.net/problem=45) 「三角数, 五角数, 六角数」
> 
> 三角数, 五角数, 六角数は以下のように生成される.
> 
> |   |   |   |
> |---|---|---|
> |三角数|$T_n=n(n+1)/2$|1, 3, 6, 10, 15, ...|
> |五角数|$P_n=n(3n-1)/2$|1, 5, 12, 22, 35, ...|
> |六角数|$H_n=n(2n-1)$|1, 6, 15, 28, 45, ...|
> 
> $T_{285} = P_{165} = H_{143} = 40755$ であることが分かる.
> 
> 次の三角数かつ五角数かつ六角数な数を求めよ.

素直に探索で解く。 $T_{285} = P_{165} = H_{143}$ がわかっているので、そこから探索を始めればいい。

- 次の数値を出力する関数
	- 三角数 $T_n$
	- 五角数 $P_n$
	- 六角数 $H_n$
- 現在の三角数、五角数、六角数がすべて一致しているかどうか判定する関数
	- 一致していなければ、その中で最小の数値を次の数値にする

## 学んだこと
- 六角数 $H_n$ はすべて三角数 $T_{2n-1}$ に置き換えられる
	- $H_n = n(2n-1) = \frac{2n(2n-1)}{2} = T_{2n-1}$
	- なので、三角数の値は調べなくていい
		- 六角数でない三角数はこの問題に不適だから
		- まったく気づかなかった

## 自分が書いたコード
- 三角数、五角数、六角数が一致するまでループを回す
	- すべて一致すれば、その数が答え
	- 一致しなければ、3つのうちの最小値を次の数にする
- 初期値は$P_{286}, P_{165}, H_{144}$ 

```racket
(define (solve-45)
  ;; 三角数、五角数、六角数
  (define (triangular n) (quotient (* n (+ n 1)) 2))
  (define (pentagonal n) (quotient (* n (- (* 3 n) 1)) 2))
  (define (hexagonal n) (* n (- (* 2 n) 1)))
  
  (define (loop n m l)
    ;; 現在の三角数、五角数、六角数が同じ値か確認する
    (let ([t (triangular n)]
          [p (pentagonal m)]
          [h (hexagonal l)])
      (if (= t p h)
          t
          (let ([min (min t p h)])
            (cond [(= min t) (loop (add1 n) m l)]
                  [(= min p) (loop n (add1 m) l)]
                  [(= min h) (loop n m (add1 l))])))))

  ;; 問題文から、T_285 = P_165 = H_143 = 40755がわかっている。
  ;; 次の T_n, P_m, H_lを求めたいので、それぞれを+1した値を初期値とする
  (loop (add1 285) (add1 165) (add1 143)))
```

## LLMによる改善案
- 自分のコードから、三角数の記述を削除
	- 五角数と六角数の比較だけでOK

```racket
(define (solve-45)
  ;; 五角数、六角数
  (define (pentagonal n) (quotient (* n (- (* 3 n) 1)) 2))
  (define (hexagonal n) (* n (- (* 2 n) 1)))
  
  (define (loop n m)
    ;; 現在の五角数、六角数が同じ値か確認する
    (let ([p (pentagonal n)]
          [h (hexagonal m)])
      (if (= p h)
          p
          (let ([min (min p h)])
            (cond [(= min p) (loop (add1 n) m)]
                  [(= min h) (loop n (add1 m))])))))

  ;; 次の P_m, H_lを求めたいので、それぞれを+1した値を初期値とする
  (loop (add1 165) (add1 143)))
```

## LLMによる別解
- 六角数をひたすらループする
	- 現在の六角数が五角数でもあるかどうか判定する
		- 五角数でもあるなら、それが答え
- [[Problem 44 - 五角数]]から、`square?`と`penta?`を再利用する
- この解法が一番早く処理が終わる

```racket
(define (solve-45)
  ;; 六角数
  (define (hexagonal n) (* n (- (* 2 n) 1)))

  ;; square? : Natural -> Boolean
  ;; 入力値が平方数かどうかを判定する
  (define (square? n)
    (let ([i-sq (integer-sqrt n)])
      (= (* i-sq i-sq) n)))

  ;; penta? : Natural -> Boolean
  ;; 入力値が五角数かどうか判定する
  (define (penta? x)
    (let ([d (+ (* 24 x) 1)])
      (and (square? d)
           (zero? (modulo (+ (integer-sqrt d) 1) 6)))))

  (for/first ([n (in-naturals (add1 143))]
              #:do [(define h (hexagonal n))]
              #:when (penta? h))
    h))
```


## 参考
- [Jacob Elafandi: Project Euler, Problem 45](https://math.berkeley.edu/~elafandi/euler/p45/)