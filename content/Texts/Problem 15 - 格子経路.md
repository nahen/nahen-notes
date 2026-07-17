---
created: 2026-04-21
modified: 2026-04-21
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 15](http://projecteuler.net/problem=15) 「格子経路」
> 2×2 のマス目の左上からスタートした場合, 引き返しなしで右下にいくルートは 6 つある.  
> 
> [![](https://projecteuler.net/project/images/p015.png)](https://projecteuler.net/project/images/p015.png)
>
>では, 20×20 のマス目ではいくつのルートがあるか.

ルートは右か下の2種類。ただし、下端からのルートは右のみ、右端からのルートは下のみになる。つまり、右も下もそれぞれマス目ぶんしか選べない。（→→↓↓、→↓→↓、→↓↓→、↓→→↓、↓→↓→、↓↓→→）

たぶん、これは単純な組み合わせ問題だと思う。マス目が2x2なら、$_4\mathrm{ C }_2 = \frac{4 \cdot 3}{2 \cdot 1} = 6$。マス目が20x20なら、$_{40}\mathrm{C}_{20} = \frac{40 \cdot 39 \cdot ... \cdot 21}{20 \cdot 19 \cdot ... \cdot 1} = 137,846,528,820$。

ところで、これは力任せに解くとどういうコードになるんだ……？　~~それとも組み合わせで解くことがブルートフォースなのか……？~~　再帰や動的計画法で解く方法があるらしい。

## 学んだこと
- 二項係数
	- $\binom{ n }{ k }$ および $_n \mathrm C _r$ のこと
- パスカルの三角形
	- この問題を動的計画法で解くと、この形になるらしい
- 知っていればすぐに解けるが、知らないとずっとわからない
	- 熟練者は解法を思い出せるが、初心者は解法を思いつかないといけない（[[📝認知負荷]]）

## 自分が書いたコード
- 組み合わせの数式 $_n \mathrm{C}_r$ をそのまま実装
	- 一気に掛けて、一気に割る
- 途中式で巨大数が生まれてしまうのが難点
	- $40 \cdot 39 \cdot ... \cdot 21 = 335,367,096,786,357,081,410,764,800,000$
		- およそ33穣（$10^{28}$）

```racket
;; lattice-paths : Integer -> Integer
;; (入力値)x(入力値)の正方形のマス目で、左上から右下へ行くルートの数を出力する。
(define (lattice-paths n)
  (let ([n (for/product ([i (in-range (add1 n) (add1 (* n 2)))]) i)]
        [r (for/product ([i (in-range 1 (add1 n))]) i)])
    (/ n r)))
```

## LLMによる改善案
- 割り算と掛け算を交互に行っている
	- 巨大数が生まれない

```racket
(define (lattice-paths n)
  (for/fold ([result 1])
            ([k (in-range 1 (add1 n))])
    (/ (* result (+ n k)) k)))
```
