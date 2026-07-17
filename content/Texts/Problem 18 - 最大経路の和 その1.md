---
created: 2026-04-29
modified: 2026-04-29
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 18](http://projecteuler.net/problem=18) 「最大経路の和 その1」
> 以下の三角形の頂点から下の行の隣接する数字を通って下まで移動するとき, その数値の和の最大値は23になる. この例では 3 + 7 + 4 + 9 = 23.
> 
> ==3==  
> ==7== 4  
> 2 ==4== 6  
> 8 5 ==9== 3
>
>以下の三角形を頂点から下まで移動するとき, その最大の和を求めよ.
>
> 75  
> 95 64  
> 17 47 82  
> 18 35 87 10  
> 20 04 82 47 65  
> 19 01 23 75 03 34  
> 88 02 77 73 07 63 67  
> 99 65 04 28 06 16 70 92  
> 41 41 26 56 83 40 80 70 33  
> 41 48 72 33 47 32 37 16 94 29  
> 53 71 44 65 25 43 91 52 97 51 14  
> 70 11 33 28 77 73 17 78 39 68 17 57  
> 91 71 52 38 17 14 91 43 58 50 27 29 48  
> 63 66 04 68 89 53 67 30 73 16 69 87 40 31  
> 04 62 98 27 23 09 70 98 73 93 38 53 60 04 23
>
> **注:** ここではたかだか 16384 通りのルートしかないので, すべてのパターンを試すこともできる. [Problem 67](https://odz.sakura.ne.jp/projecteuler/?Problem+67 "Problem 67 (1272d)") は同じ問題だが100行あるので, 総当りでは解けない. もっと賢い方法が必要である.

上から大小比較して大きいルートを選べばいい、というわけではなさそう。木構造のデータを作る手もあるが、作るのが一番面倒くさそう。

意外と、下から大小比較していけばよさそうな気がする。たとえば、頂点の75からのルートは(95, 64)の2通りだが、どちらのルートが最適かはこの時点ではわからない。一方で、下から二層目の左端63からのルートを考えてみる。こちらも(04,62)の2通りだが、それ以降は行き止まり。なので、素直に大小比較して大きい方を選ぶことができる。

というかこれ、以下を繰り返せばいいのでは？
1. リストの中でi番目とi+1番目のペアを作る（(8 5 9 3)→((8 5) (5 9) (9 3))）
2. ペア同士で大小比較をして大きい数を取り出す
	1. すると要素数がn-1個のリストができる（(8 5 9 3)→(8 9 9)）
3. 2のリストとひとつ上の段のリストを足し合わせる（(8 9 9)+(2 4 6)→(11 13 15)）
4. リストの要素数が1より多ければ、1に戻る
	1. ひとつだけになったら、それが三角形の最大の和

## 学んだこと
- `define`でリストを定義すると、`symbol`として扱われる

## 自分が書いたコード
- ボトムアップから解く手法は合ってる
- 三角形のリストは底辺→頂点の向き
- `(first list)`で要素を取り出している
	- `list`そのままだとリストで出力されてしまう
- `max-pairs-list`はLLMに`match`と`for/list`を使う方法を教えてもらった

```racket
;; max-path-sum : (listof (listof Integer)) -> Integer
;; 三角形の頂点から下までの最大の和を求める
(define (max-path-sum lol)
  (define (max-pairs-list loi)
    (match loi
      ['() '()]
      [(list x) (list x)]
      [_ (for/list ([x loi]
                    [y (rest loi)])
           (max x y))]))
  
  (define (sum loi1 loi2)
    (map + loi1 loi2))
  
  (define (loop lol acc)
    (cond [(empty? lol) acc]
          [(empty? acc) (loop (rest lol) (max-pairs-list (first lol)))]
          [else
           (let* ([sum-lst (sum (first lol) acc)]
                  [max-lst (max-pairs-list sum-lst)])
             (loop (rest lol) max-lst))]))

  (first (loop lol '())))
  
(define path1 '((8 5 9 3) (2 4 6) (7 4) (3)));例題の三角形（底辺→頂上）
(check-equal? (max-path-sum path1) 23)
```

## LLMによる改善案
- こちらの三角形のデータは頂点→底辺
	- でも処理中でリストを反転させている
- `max-pairs-list`を`max-pairs`で簡素化
	- `'(8 5 9 3)`を加工したリストを2つ作って、各要素で大小比較
		- `(drop-right '(8 5 9 3) 1)`→`'(8 5 9)`
		- `(rest '(8 5 9 3))`→`'(5 9 3)`
	- そんな簡単な方法があったのか……

```racket
;; triangle は ((3) (7 4) (2 4 6) (8 5 9 3)) のような形式を想定
(define (max-path-sum triangle)
  ;; 隣接する要素のうち大きい方のリストを返す
  ;; (8 5 9 3) -> (8 9 9)
  (define (max-pairs row)
    (for/list ([left (drop-right row 1)]
               [right (rest row)])
      (max left right)))

  ;; 下の行から上の行へ畳み込む
  ;; step: 現在の行 (row) と、その下の行までの計算結果 (acc) を合成する
  (define (step row acc)
    (map + row (max-pairs acc)))

  ;; 三角形が空でないことを前提に、下から上へ処理
  (let ([reversed-tri (reverse triangle)])
    (first (foldl step (first reversed-tri) (rest reversed-tri)))))
```
