---
created: 2026-05-07
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 21](http://projecteuler.net/problem=21) 「友愛数」
> d(n) を n の真の約数の和と定義する. (真の約数とは n 以外の約数のことである. )  
> もし, d(a) = b かつ d(b) = a (a ≠ b のとき) を満たすとき, a と b は友愛数(親和数)であるという.
> 
> 例えば, 220 の約数は 1, 2, 4, 5, 10, 11, 20, 22, 44, 55, 110 なので d(220) = 284 である.また, 284 の約数は 1, 2, 4, 71, 142 なので d(284) = 220 である.
> 
> それでは10000未満の友愛数の和を求めよ.

整数論の話のように見える。そして高速化にはメモ化が有用。

単純に考えるなら、まずはd(1)〜d(9999)を列挙する。ただし1と素数は絶対に友愛数にならないので除外できる。（素数は1とn以外の約数をもたないため、真の約数が1だけになる）

そのうえで、d(d(n))=nとなる数（友愛数）を見つけ出す。最後まで求めたら、見つけ出した友愛数を足し合わせる。それが答えになる。

nの約数は、nを素因数分解すれば、その素数の組み合わせから求められる。  
$n=8(=2*2*2)$ であれば、 $d(8)=1+2+4= 2^0 + 2^1+2^2$  
$n = 15(=3*5)$であれば、 $d(15)=1+3+5 = 3^0 * 5^0 + 3^1 * 5^0 + 3^0 * 5^1$

ところで、たとえば $n=16$ のとき、$d(16)$ は以下のようにも書ける。
$d(16)=1+2+4+8 = d(8)+ 2^3 = 1 + 2*d(8)$
同じように、$d(8)=1+2+4 = d(4)+4=d(2)+2+4$  
でも、こんな発見をしても、それをどう活かせばいいんだ？→約数の総和を求めるのに使えたわ。

## 学んだこと
- 約数の総和を求める公式（整数 $n$ が $p^a q^b \dots$ と素因数分解できるとする）
	- $(1 + p + p^2 +\dots + p^a)(1 + q + q^2 + \dots + q^b)\dots$
- 篩法
	- そんな分野があるらしい

## 自分が書いたコード
- 1〜10000の真の約数を素因数分解から求める
	- その都度素数一覧を生成するせいで時間がかかる
- 答えは求められるが、10000件だと30秒程度かかる
	- あまりにも時間がかかりすぎる

```racket
;; prime-list: Integer -> (list Integer)
;; 入力値以下の素数の一覧を取得
(define (make-primes limit)
  (define (prime? n)
    (and (> n 1)
         (or (= n 2)
             (and (odd? n)
                  (for/and ([i (in-range 3 (add1 (integer-sqrt n)) 2)])
                    (not (zero? (modulo n i))))))))
  
  (for/list ([i (in-range 2 (add1 limit))]
             #:when (prime? i))
    i))

;; sum-factor Integer Integer -> Integer
;; 入力値を素数で割った場合の約数の総和を出力する
;;（ただし、素数で割れない場合の総和は1と置く）
(define (sum-factor num prime)
  (define (loop n acc)
    (if (zero? (modulo n prime))
        (loop (/ n prime) (+ 1 (* acc prime)))
        (if (> acc 0)
            (+ 1 (* acc prime))
            1)))
  (loop num 0))

;; sum-proper-divisor: Integer -> Integer
;; 入力値を素因数分解して、その結果から真の約数の総和を求める
(define (sum-proper-divisor num)
  (define primes (make-primes num))
  (define sum-divisor
    (for/product ([p primes])
    (sum-factor num p)))
  
  (- sum-divisor num))

;; amicable? : Integer -> Boolean
;; 入力値に友愛数が存在するなら、その友愛数を出力する。それ以外はfalse
(define (amicable? num)
  (let* ([a (sum-proper-divisor num)]
         [b (sum-proper-divisor a)])
    (and (= num b)
         (not (= a b)))))

;; amicable-list : Integer -> (listof Integer)
;; 入力値以内にある友愛数のリストを求める
(define (amicable-list num)
  (for/list ([i (in-range 2 num)]
             #:when (amicable? i))
    i))

;; amicable-numbers : Integer -> Integer
;; 入力値未満の友愛数の和を出力する
(define (amicable-numbers num)
  (apply + (amicable-list num)))
```

## LLMによる改善案
- あらかじめ、約数の和を配列に入れておく解き方
	- 外側のループ：約数の候補（1〜4999）
	- 内側のループ：約数 i の倍数（初期値は2i）
		- 各 i の倍数に、 i を追加していく
	- エラトステネスの篩の応用
		- いやこんなん思いつかんて
- 作った配列から、友愛数の定義を満たす数値を探して足し合わせる

```racket
(define (solve-problem-21 limit)
  ;; 1. 篩(Sieve)を用いて、すべての数の真の約数の和を事前に計算する
  ;; 0からlimit-1までのインデックスを持つベクトルを作成
  (define d-values (make-vector limit 0))
  
  ;; 1はすべての数の約数なので、2以上の倍数に1を足しておく
  (for ([i (in-range 1 (quotient limit 2))])
    (for ([j (in-range (* 2 i) limit i)])
      (vector-set! d-values j (+ (vector-ref d-values j) i))))

  ;; 2. 友愛数の定義に従って集計
  (for/sum ([a (in-range 2 limit)])
    (let ([b (vector-ref d-values a)])
      (if (and (< b limit)       ;; 範囲内か
               (not (= a b))     ;; a ≠ b か
               (= a (vector-ref d-values b))) ;; d(b) = a か
          a
          0))))
```

## 参考
- [約数の総和を求める二つの公式と証明 \| 高校数学の美しい物語](https://manabitimes.jp/math/964)