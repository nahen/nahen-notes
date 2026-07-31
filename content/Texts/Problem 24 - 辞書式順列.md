---
created: 2026-05-18
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 24](http://projecteuler.net/problem=24) 「辞書式順列」
> 順列とはモノの順番付きの並びのことである. たとえば, 3124は数 1, 2, 3, 4 の一つの順列である. すべての順列を数の大小でまたは辞書式に並べたものを辞書順と呼ぶ. 0と1と2の順列を辞書順に並べると
>
> 012 021 102 120 201 210
>
> になる.
>
> 0,1,2,3,4,5,6,7,8,9からなる順列を辞書式に並べたときの100万番目はいくつか?

候補になる組み合わせは $10! = 3,628,800$ 通り。1番目は0123456789、2番目は0123456798、3番目は0123456879。バカ正直に順列を作らなくても、計算でビタ当てできそうな気がする。

1. 求めたい順列の番号を $n$ と置く。この場合は1,000,000。
2. 上1ケタ目まで固定された場合の組み合わせは、 $9!=362,880$ 通り。
	1.  $(n-1)$ を362,880で割った商が1ケタ目の値になる。この場合は2。
	2. 組み合わせ候補を辞書順に並べたリスト`(0 1 2 3 4 5 6 7 8 9)`の2番目を取り出す。ここでは`2`。
		1. リストの先頭が0番目であることに注意
3. 上2ケタ目まで固定された場合を考える。この組み合わせは $8!=40,320$ 通り。
	1.  $(n-1)$ を362,880で割った余りは、 $(n-1) - (362,880 * 2) = 274,239$ となる。
	2. この274,239を40,320で割った商を求める。この場合は6。
	3. `(0 1 3 4 5 6 7 8 9)`の6番目を取り出す。ここでは`7`。
4. 上3ケタ目まで固定された場合。この組み合わせは $7! = 5,040$ 通り。
	1. 274,239を40,320で割った余りは、32,319。
	2. 32,319を5,040で割った商を求める。この場合は6。
	3. `(0 1 3 4 5 6 8 9)`の6番目を取り出す。ここでは`8`。
5. この流れを最後のケタまで繰り返す。

## 学んだこと
- 階乗進法
	- 10進法の整数を $a_n*n! + a_{n-1} * (n-1)! + \dots + a_1 * 1! + a_0 * 0!$ で表す表記法
- `let`と`define`の使い分け
	- `define`は一般的な、自分の中で意味や名前をもつ概念
	- `let`はtemp的な、まだ自分の中で名前がついていない概念
	- どちらかわからなければ、いったん`let`で宣言
		- 後で再利用できそうなら`define`に置き換えてもいい
- たとえ処理が冗長になっても、一般的な概念を保たせる

## 自分が書いたコード
- 解き方はあってた
	- 再帰部分しか関数化していないので読みづらい

```racket
;; lexicographic-permutation: (listof Integer) Integer -> String
;; listからなる順列を辞書式に並べたときのindex番目を出力する。listは辞書順
(define (lexico-permutation lst index)
  (define (loop loi idx res)
    (cond [(= (length loi) 1) (string-append res (number->string (first loi)))]
          [else
           (let* ([combi (for/product ([i (in-range 1 (length loi))]) i)];(n-1)!を求めたいので(length loi)でOK
                  [q (quotient idx combi)]
                  [r (remainder idx combi)]
                  [str (number->string (list-ref loi q))]
                  [drop-loi (append (take loi q) (drop loi (+ q 1)))])
             (loop drop-loi
                   r
                   (string-append res str)))]))

  (loop lst (- index 1) ""))
```

## LLMによる回答
- いくつかの関数に分けている
	- 階乗を求める`factorial`
	- リストの`i`番目を取り出したうえで残りのリストも返す`remove-at`
	- 末尾まで処理を繰り返す`loop`

```racket
;; nth-permutation : Natural (Listof Integer) -> String
;; numbers の辞書順順列のうち、n 番目 (1-origin) を返す
(define (nth-permutation n numbers)
  ;; Project Euler の問題は 1-origin なので 0-origin に変換
  (define target (sub1 n))
  
  ;; factorial : Natural -> Natural
  ;; n! を求める
  (define (factorial n)
    (for/product ([i (in-range 1 (+ n 1))])
      i))

  ;; remove-at : Natural (Listof X) -> (values X (Listof X))
  ;; index 番目の要素を取り出し、残りのリストを返す
  (define (remove-at index xs)
    (define front (take xs index))
    (define back  (drop xs index))
    (values (first back)
            (append front (rest back))))

  ;; loop : Natural (Listof Integer) Natural String -> String
  (define (loop k remaining acc)
    (if (empty? remaining)
        acc
        (let* ([size (sub1 (length remaining))]
               [block-size (factorial size)]
               [index (quotient k block-size)]
               [next-k (remainder k block-size)])
          (define-values (picked rest)
            (remove-at index remaining))
          (loop next-k
                rest
                (string-append acc (number->string picked))))))

  (loop target numbers ""))
```

## 参考
- [階乗進法，素数階乗進法，e進法 \| 高校数学の美しい物語](https://manabitimes.jp/math/2764)