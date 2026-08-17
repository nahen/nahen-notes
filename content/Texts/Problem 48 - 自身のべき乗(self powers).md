---
created: 2026-08-05
modified: 2026-08-06
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 48](http://projecteuler.net/problem=48) 「自身のべき乗(self powers)」
> 次の式は,  $1 + 2^2 + 3^3 + \dots + 10^{10} = 10405071317$ である.
> 
> では, $1^1 + 2^2 + 3^3 + \dots + 1000^{1000}$ の最後の10桁を求めよ.

巨大数同士の足し算。これもRacketであれば、最後の10桁どころかすべての桁数を問題なく出力できそう。

## 学んだこと
- 繰り返し二乗法（二分累乗法）
	- 累乗の指数を二進数（1, 2, 4, 8, 16, …）のように分けて計算することで、全体の計算量を減らす手法

## 自分が書いた（身も蓋もない）コード
- 巨大数が扱える言語ならばこれでOK
- 作問者が求めてた解答ではないと思う

```racket
;; solve-48 : Natural -> Natural
;; 自分自身の冪乗の和を 1〜1000 まで求めて、最後の10桁を出力する
(define (solve-48)
  ;; self-powers : Natural -> Natural
  ;; 自分自身の冪乗の和を 1〜limit まで求める
  (define (self-powers limit)
    (for/sum ([i (in-range 1 (add1 limit))])
      (expt i i)))

  (define str (number->string (self-powers 1000)))
  (string->number (substring str (- (string-length str) 10))))
```

## 自分が書いたコード
- 各値で自身の冪乗を計算した後に、末尾10桁を抽出して出力する
	- 1〜1000の総和を求めたあとにも末尾10桁を抽出する

```racket
(define (solve-48)
  (define limit 1000)
  (define expt10 (expt 10 10))
  
  ;; mod-self-powers : Natural -> Natural
  ;; n^n の末尾10桁を出力する
  (define (mod-self-powers n)
    (for/fold ([result 1])
              ([i (in-range 1 (add1 n))])
      (modulo (* result n) expt10)))
  
  (define sum
    (for/sum ([i (in-range 1 (add1 limit))])
      (mod-self-powers i)))
  (modulo sum expt10))
```

## LLMによる改善案
- 繰り返し二乗法で累乗計算を効率化させている
- 例：$17^{17}$ を計算する（底: 17、指数: 17、計算結果: 1）
	1. 指数 17 は奇数→指数から 1 を引いた値 16 を 2 で割る
		1. 底と計算結果に底をかける（底: $17^2$、指数: 8、計算結果: 17）
	2. 指数 8 は偶数→そのまま指数 8 を 2 で割る
		1. 底に底をかける（底: $17^4$、指数: 4、計算結果: 17）
	3. 指数 4 は偶数→指数 4 を 2 で割る
		1. 底に底をかける（底: $17^8$、指数: 2、計算結果: 17）
	4. 指数 2 は偶数→指数 2 を 2 で割る
		1. 底に底をかける（底: $17^{16}$、指数: 1、計算結果: 17）
	5. 指数 1 は奇数→指数から 1 を引いた値 0 を 2 で割る（割れない）
		1. 底と計算結果に底をかける（底: $17^{32}$、指数: 0、計算結果: $17 \times 17^{16}$）
	6. 指数が0になったときの計算結果 $17 \times 17^{16} = 17^{17}$ が求めたい値
	- 17 を 17 回かけるステップが、たった 6 回かけるだけで済む

```racket
(define (solve-48)
  (define limit 1000)
  (define expt10 (expt 10 10))
  
  ;; mod-self-powers : Natural -> Natural
  ;; n^n の末尾10桁を出力する（繰り返し累乗法）
  (define (mod-self-powers n)
    (define expt10 (expt 10 10))
    
    (let loop ([base n][exp n][acc 1])
      (cond [(zero? exp) acc]
            [(odd? exp) (loop (modulo (* base base) expt10)
                              (quotient exp 2)
                              (modulo (* acc base) expt10))]
            [else (loop (modulo (* base base) expt10)
                        (quotient exp 2)
                        acc)])))
  
  (define sum
    (for/sum ([i (in-range 1 (add1 limit))])
      (mod-self-powers i)))
  (modulo sum expt10))
```

## 参考
- [繰り返し二乗法によるべき乗(pow(x,n))の計算のアルゴリズム \| アルゴリズムロジック](https://algo-logic.info/calc-pow/)