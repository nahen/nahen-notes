---
created: 2026-06-19
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 37](http://projecteuler.net/problem=37) 「切り詰め可能素数」
> 3797は面白い性質を持っている. まずそれ自身が素数であり, 左から右に桁を除いたときに全て素数になっている (3797, 797, 97, 7). 同様に右から左に桁を除いたときも全て素数である (3797, 379, 37, 3).
> 
> 右から切り詰めても左から切り詰めても素数になるような素数は11個しかない. 総和を求めよ.
> 
> 注: 2, 3, 5, 7を切り詰め可能な素数とは考えない.

……どうして11個だけなんだ？　素数は無限に存在するのでは？　どこかで上限があるということ？　あるいは、11個見つかったらそこで探索を打ち切っていいということか？

素数の見つけ方といえばエラトステネスの篩。しかし今回は上限値がわからない。となると、試し割り法になるのだろうか？

切り詰め可能素数について考える。まず、切り詰め可能素数は上1桁・下1桁がどちらも3, 7のいずれかになる。それ以外の数だと素数にならない。そして、2桁かつ1桁目が3, 7のいずれかになる素数は以下の11つ。
- 13, 17, 23, 37, 43, 47, 53, 67, 73, 83, 97
	- 二桁の切り詰め可能素数は、23, 37,  53, 73の4通り

3桁の切り詰め可能素数は以下の4通り。
- 313, 317, 373, 797

ここまでで、切り詰め可能素数の候補には以下の前提がありそうに見える。
- 2桁以上
- 先頭と末尾は3, 7のいずれか
- 隣り合った桁（1桁目と2桁目、2桁目と3桁目）で数字が重複しない
- 3桁以上の場合、すべての桁が奇数

いったん、奇数だけを探索候補にして実装してみる。
- エラトステネスの篩による素数テーブル
- 数字を切り詰める関数
- 数字の素数判定

## 学んだこと
- 探索よりも生成の方が処理時間がとても速い
	- 探索する個数＞生成する個数の場合

## 自分が書いたコード
- 100万までに切り詰め可能素数が11個存在すると勝手に仮定している
	- 100万までに存在する素数テーブルを作る
- `(primes)`に条件式を追加
	- すでに素数でないと判定された数は無視する

```racket
;; solve-37 : -> Natural
;; 切り詰め可能な素数の総和を求める
(define (solve-37)
  ;; primes : Natural -> (vectorof Boolean)
  ;; 上限値未満の素数テーブルを作る
  (define (primes limit)
    (define v (make-vector limit #t))
    (define (not-prime n)
      (vector-set! v n #f))
    (not-prime 0)
    (not-prime 1)
    (for* ([i (in-range 2 (add1 (integer-sqrt limit)))]
           [j (in-range (* i i) limit i)]
           #:when (vector-ref v i))
      (not-prime j))
    v)
  (define p-table (primes 1000000))
  ;; 素数判定
  (define (prime? n)
    (vector-ref p-table n))
  
  ;; all-truncates-prime? : Natural -> Boolean
  ;; 入力値を1文字ずつ切り詰めた数字がすべて素数かどうか判定する
  (define (all-truncates-prime? n)
    ;; truncate-right : Natural[10,) -> Natural
    ;; 数字(>10)から右1文字を切り詰めた数字を出力する
    (define (truncate-right num)
      (quotient num 10))

    ;; truncate-left : Natural[10,) -> Natural
    ;; 数字(>10)を左1文字ぶん切り詰めた数字を出力する
    (define (truncate-left num)
      (remainder num (expt 10 (sub1 (string-length (number->string num))))))
  
    (define (loop fn i)
      (cond [(< i 10) (prime? i)]
            [(prime? i) (loop fn (fn i))]
            [else #f]))
  
    (and (loop truncate-left n)
         (loop truncate-right n)))

  (for/sum ([i (in-range 11 1000000 2)]
             #:when (all-truncates-prime? i))
    i))
```

## LLMによる改善案（全検索）
- `p-table`を作るコードを修正
	- `let`を使えばよかったのね
- それ以外は特に変更なし

```racket
;; solve-37 : -> Natural
;; 切り詰め可能な素数の総和を求める
(define (solve-37)
  (define limit 800000)
  ;; primes : Natural -> (vectorof Boolean)
  ;; 上限値未満の素数テーブルを作る
  (define p-table
    (let ([v (make-vector limit #t)])
      (vector-set! v 0 #f)
      (vector-set! v 1 #f)
      (for* ([i (in-range 2 (add1 (integer-sqrt limit)))]
             #:when (vector-ref v i)
             [j (in-range (* i i) limit i)])
        (vector-set! v j #f))
      v))
…
```

## LLMによる別解（候補を生成）
- まずは右側から切り詰め可能な素数を生成する
	- `right-truncatables`
	- `(2 3 5 7)`の右側にそれぞれ`(1 3 7 9)`を付け加える
	- 付け加えた数字が素数かどうかを判定
		- 素数であれば候補に入る
	- 候補がない（どの数字を右に付けても素数にならない）場合にループを停止
- 右詰め可能素数のうち、左側からも切り詰め可能な素数を抽出する
	- `left-truncatable?`
- 最後に総和を求める
- 全探索よりもかなり速い

```racket
;; solve-37 : -> Natural
;; 右から切り詰めても左から切り詰めても素数になるような素数の総和を求める
(define (solve-37)
  ;; right-truncatables : -> (listof Natural)
  ;; 右側での切り詰め可能素数のリストを出力する
  (define (right-truncatables)
    (define (candidate-list lst)
      (for*/list ([l lst]
                  [i (list 1 3 7 9)]
                  #:do [(define n (+ (* l 10) i))]
                  #:when (prime? n))
        n))
  
    (define (loop lst)
      (let ([c-list (candidate-list lst)])
        (if (empty? c-list)
            lst
            (append lst
                    (loop c-list)))))
  
    (loop (candidate-list (list 2 3 5 7))))

  ;; left-truncatable? : Natural -> Boolean
  ;; 左側を削り続けてできる数がすべて素数かどうか判定する
  (define (left-truncatable? n)
    (define (find-divisor div)
      (if (< n (* div 10))
          div
          (find-divisor (* div 10))))
    (define (loop m div)
      (cond [(< m 10) (prime? m)]
            [(prime? m)
             (loop (remainder m div) (quotient div 10))]
            [else #f]))
    (loop n (find-divisor 1)))
  
  (for/sum ([i (filter left-truncatable? (right-truncatables))])
    i))
```
