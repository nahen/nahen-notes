---
created: 2026-04-10
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 11](http://projecteuler.net/problem=11) 「格子内の最大の積」
>上の 20×20 の格子のうち, 斜めに並んだ4つの数字が赤くマークされている.
>
> 08 02 22 97 38 15 00 40 00 75 04 05 07 78 52 12 50 77 91 08  
> 49 49 99 40 17 81 18 57 60 87 17 40 98 43 69 48 04 56 62 00  
> 81 49 31 73 55 79 14 29 93 71 40 67 53 88 30 03 49 13 36 65  
> 52 70 95 23 04 60 11 42 69 24 68 56 01 32 56 71 37 02 36 91  
> 22 31 16 71 51 67 63 89 41 92 36 54 22 40 40 28 66 33 13 80  
> 24 47 32 60 99 03 45 02 44 75 33 53 78 36 84 20 35 17 12 50  
> 32 98 81 28 64 23 67 10 ==26== 38 40 67 59 54 70 66 18 38 64 70  
> 67 26 20 68 02 62 12 20 95 ==63== 94 39 63 08 40 91 66 49 94 21  
> 24 55 58 05 66 73 99 26 97 17 ==78== 78 96 83 14 88 34 89 63 72  
> 21 36 23 09 75 00 76 44 20 45 35 ==14== 00 61 33 97 34 31 33 95  
> 78 17 53 28 22 75 31 67 15 94 03 80 04 62 16 14 09 53 56 92  
> 16 39 05 42 96 35 31 47 55 58 88 24 00 17 54 24 36 29 85 57  
> 86 56 00 48 35 71 89 07 05 44 44 37 44 60 21 58 51 54 17 58  
> 19 80 81 68 05 94 47 69 28 73 92 13 86 52 17 77 04 89 55 40  
> 04 52 08 83 97 35 99 16 07 97 57 32 16 26 26 79 33 27 98 66  
> 88 36 68 87 57 62 20 72 03 46 33 67 46 55 12 32 63 93 53 69  
> 04 42 16 73 38 25 39 11 24 94 72 18 08 46 29 32 40 62 76 36  
> 20 69 36 41 72 30 23 88 34 62 99 69 82 67 59 85 74 04 36 16  
> 20 73 35 29 78 31 90 01 74 31 49 71 48 86 81 16 23 57 05 54  
> 01 70 54 71 83 51 54 69 16 92 33 48 61 43 52 01 89 19 67 48
>
>それらの数字の積は 26 × 63 × 78 × 14 = 1788696 となる.
>
>上の 20×20 の格子のうち, 上下左右斜めのいずれかの方向で連続する4つの数字の積のうち最大のものはいくつか?

Racketで二次元配列ってどうやって定義するんだ……？　いったんは二次元リストで考えた方がいいかも？  
→結局インデックスでリストの読み取り・操作をするんだから、`list`よりも`vector`のほうがよかったかも。

愚直に考えるならば、以下のサブリストを作って、それぞれのサブリストで最大となる積を求める。あとは縦・横・斜め右下・斜め左下から最大値を選べばいい。~~でも、もっとカンタンな方法があると思う。~~ なかったわ。
- 縦方向のサブリスト
- 横方向のサブリスト
- 斜め右下方向のサブリスト
- 斜め左下方向のサブリスト

## 学んだこと
- 二次元配列をつくるなら`vector`形式にする
- この問題は数学というより、プログラミングの実装知識を問われてる

## 自分が書いたコード
- あまりにも力技すぎる
	- ネストが酷すぎる
	- でも考え方は合っている
```racket
;; largest-product-in-grid : (listof (listof Integer)) -> Integer
;; 上下左右斜めのいずれかで連続する4つの数字の積で最大のものを出力する
(define (largest-product-in-grid grid)
  (define LENGTH (length GRID))
  (define (at x y)
    (list-ref (list-ref grid y) x))
  ;; 横方向の走査（初期値(0,0)、末尾(16,19)）
  (define (row-sub-list)
    (for/list ([x (in-range 0 (- LENGTH 3))])
      (for/list ([y (in-range 0 LENGTH)])
        (take (drop (list-ref GRID y) x) 4))))
  ;; 縦方向の走査(初期値(0,0)、末尾(19,16))
  (define (col-sub-list)
    (for/list ([x (in-range 0 LENGTH)])
      (for/list ([y (in-range 0 (- LENGTH 3))])
        (list (at x y) (at x (+ y 1)) (at x (+ y 2)) (at x (+ y 3))))))
  ;; 斜め方向（右下）の走査（初期値(0,0)、末尾(16,16)）
  (define (diag-sub-list)
    (for/list ([x (in-range 0 (- LENGTH 3))])
      (for/list ([y (in-range 0 (- LENGTH 3))])
        (list (at x y) (at (+ x 1) (+ y 1)) (at (+ x 2) (+ y 2)) (at (+ x 3) (+ y 3))))))
  ;; 斜め方向(左下)の走査(初期値(0,4)、末尾(20,16))
  (define (diag-sub-list-2)
    (for/list ([x (in-range 3 LENGTH)])
      (for/list ([y (in-range 0 (- LENGTH 3))])
        (list (at x y) (at (- x 1) (+ y 1)) (at (- x 2) (+ y 2)) (at (- x 3) (+ y 3))))))
  ;; サブリストの中から積の最大値を取得
  (define (max-sub-list lst)
    (apply max
           (for/list ([l lst])
             (apply max
                    (for/list ([ls l])
                      (apply * ls))))))
  
  (max (max-sub-list (row-sub-list))
       (max-sub-list (col-sub-list))
       (max-sub-list (diag-sub-list))
       (max-sub-list (diag-sub-list-2))))
```

## LLMによる改善案
- `list`で定義したグリッド`grid-list`を`vector`に変換
	- `vector`で定義しているなら、`grid`はいらない
- 開始地点`(x, y)`と走査方向`diretions`をもとに、方向4マスの数値を取得
	- 走査する関数を`product-at`ひとつに凝縮してる

```racket
(define (largest-product-in-grid-v2 grid-lists)
  ;; 1. リストをベクターのベクターに変換して高速化 (O(1)アクセス)
  (define grid (apply vector (map list->vector grid-lists)))
  (define rows (vector-length grid))
  (define cols (vector-length (vector-ref grid 0)))

  ;; 安全にグリッドの値を取得するヘルパー
  (define (get x y)
    (vector-ref (vector-ref grid y) x))

  ;; 特定の開始点 (x, y) から指定方向 (dx, dy) への4つの積を計算
  (define (product-at x y dx dy)
    (for/fold ([prod 1])
              ([i (in-range 4)])
      (* prod (get (+ x (* i dx))
                   (+ y (* i dy))))))

  (define (in-bounds? x y)
    (and (<= 0 x (sub1 rows))
         (<= 0 y (sub1 cols))))

  ;; 2. 全ての方向を定義
  (define directions
    '((1 0)  ; 横
      (0 1)  ; 縦
      (1 1)  ; 右下斜め
      (1 -1))) ; 右上斜め (元コードの左下相当)

  ;; 3. for/fold を使って、リストを作らずに最大値を追跡
  (for*/fold ([max-prod 0])
             ([y (in-range rows)]
              [x (in-range cols)]
              [dir directions])
    (let ([dx (car dir)]
          [dy (cadr dir)])
      ;; 範囲外チェック
      (let ([end-x (+ x (* 3 dx))]
            [end-y (+ y (* 3 dy))])
        (if (in-bounds? end-x end-y)
            (max max-prod (product-at x y dx dy))
            max-prod)))))
```

## 参考
- 