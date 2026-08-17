---
created: 2026-08-03
modified: 2026-08-05
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 47](http://projecteuler.net/problem=47) 「異なる素因数」
> それぞれ2つの異なる素因数を持つ連続する2つの数が最初に現れるのは:
> $$
> \begin{align}
> 14 = 2 \times 7 \\
> 15 = 3 \times 5 \\
> \end{align}
> $$
> 
> それぞれ3つの異なる素因数を持つ連続する3つの数が最初に現れるのは:
> 
> $$
> \begin{align}
> 644 = 2^2 \times 7 \times 23 \\
> 645 = 3 \times 5 \times 43 \\
> 646 = 2 \times 17 \times 19 \\
> \end{align}
> $$
> 
> 最初に現れるそれぞれ4つの異なる素因数を持つ連続する4つの数を求めよ. その最初の数はいくつか?
> 

素因数が4つとあるけど、正直4つ以上あればOKな気がする。

>[!bug] やらかした失敗
問題文の「素因数」の意味を勘違いした。調べる条件は、4つの異なる**種類**の素数であって、4つの異なる因数ではない。そのせいで、いらないことに時間をかけてしまった。
>
>私の想定では、 $2^{10}$ もまた異なる4つの素因数を持つ数だった。$2^{10} = 2 \times 2^2 \times 2^3 \times 2^4 = 2 \times 4 \times 8 \times 16$と分解できるからだ。しかし、この数の素因数は 2 の1種類しかない。

%%
以下は、そのいらないこと。「4つの異なる素因数」を満たす条件を考える。
- 素因数の種類: 1
	- 素因数の個数: 10個以上（$i, i^2, i^3, i^4$）
- 素因数の種類: 2
	- 片方の素因数が1個のみ
		- 素因数の個数: 7個以上（$i, j, j^2, j^3$）
	- 片方の素因数が2個以上
		- 素因数の個数: 6個以上（$i, j, j^2, ij$）
- 素因数の種類: 3
	- 素因数の個数: 5個以上
- 素因数の種類: 4
	- 素因数の個数: 4個以上
%%

- ある整数を素因数分解したときの素因数の組み合わせを出力する関数
- ある整数が4つの異なる素因数を持つかどうか判定する関数

## 学んだこと
- 単語の意味を理解していないと問題文を誤って読んでしまう

## 自分が書いたコード
- ある連続した整数a, b, c, dが4つの異なる素因数を持つ数か調べる
	- 満たさない整数がある場合、その数+1を次の先頭にする
		- `prime-factors`を重複して実行させないため
	- a, b, c, dがすべて条件を満たす場合のaが答え

```racket
;; solve-47 : -> Natural
;; 4つの異なる素因数を持つ連続する4つの数を探す。見つかったら先頭の数を返す

(define (solve-47)
  
  ;; prime-factors : Natural -> (listof Natural)
  ;; nを素因数分解し、素因数を重複込みのリストとして返す
  (define (prime-factors num)
    (define (loop n acc)
      (cond [(<= n 1) acc]
            [(even? n) (loop (quotient n 2) (cons 2 acc))]
            [else
             ;; sqrt{n}以下の奇数のうち割り切れるものを探す
             (let ([p
                    (for/first ([i (in-range 3 (add1 (integer-sqrt n)) 2)]
                                #:when (zero? (remainder n i)))
                      i)])
               (if p
                   (loop (quotient n p) (cons p acc))
                   (cons n acc)))]))

    (loop num '()))

  ;; candidate? : Natural -> Boolean
  ;; n が4つの異なる素因数を持つかどうか判定する
  (define (candidate? n)
    (= (set-count (list->set (prime-factors n))) 4))
    
  (define (loop n)
    (define-values (a b c d)
      (values n (+ n 1) (+ n 2) (+ n 3)))

    ;; いずれかの整数で異なる4つの素因数の条件を満たさない場合、その整数が範囲外になるまで窓を進める
    (cond [(not (candidate? d)) (loop (+ d 1))]
          [(not (candidate? c)) (loop d)]
          [(not (candidate? b)) (loop c)]
          [(not (candidate? a)) (loop b)]
          ;; a,b,c,dがいずれも異なる4つの素因数を満たす場合、先頭のaが答え
          [else a]))
  
  (loop 1))
```

## LLMによる改善案
- 

```racket

```

## 参考
- 