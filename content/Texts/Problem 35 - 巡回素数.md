---
created: 2026-06-15
modified: 2026-07-31
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 35](http://projecteuler.net/problem=35) 「巡回素数」
> 197は巡回素数と呼ばれる. 桁を回転させたときに得られる数 197, 971, 719 が全て素数だからである.
> 
> 100未満には巡回素数が13個ある: 2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, および97である.
> 
> 100万未満の巡回素数はいくつあるか?

初めて知る概念、巡回素数。探索範囲は1〜999,999。素数をエラトステネスの篩で見つけたうえで、桁を回転させて得られる数がすべて素数か否かを判定する？

探索範囲が広すぎるので、刈り取る必要がある。パッと思いつくのは、桁のいずれかに0がある素数は確実に巡回素数にはならないことか。（一の位が0の素数は存在しない）

- 素数テーブルを作る関数
- 数字から、桁を回転させて得られる数のリストを作る関数
- 数字が素数テーブルに存在するか判定する関数

## 学んだこと
- 偶数または5を含む値は巡回素数にならない
	- ただし一桁の2と5は除く

## 自分が書いたコード
- 素数テーブルを作ってから、各素数で巡回数を作る
- 作った巡回数がすべて素数なら候補のリストに追加
	- 最後にリストの要素数を数える
- 改善できる余地はある
	- 重複して探索している部分がある

```racket
;; solve-35: Natural -> Natural
;; limit未満の巡回素数の個数を出力する
(define (solve-35 limit)
  (define (make-p-table)
    (define v (make-vector limit #t))
    (define (not-prime! n)
      (vector-set! v n #f))
    ; 0と1は素数ではないので除外
    (not-prime! 0)
    (not-prime! 1)
  
    (for ([i (in-range 2 (add1 (integer-sqrt limit)))]
          #:when (vector-ref v i))
      (for ([j (in-range (* i 2) limit i)])
        (not-prime! j)))
    v)

  (define (circular-list num)
    (define len (sub1 (string-length (number->string num))))
    (define (loop i cir acc)
      (cond [(zero? i) acc]
            [else
             (let* ([max-place (expt 10 len)]
                    [next-one-place-num (quotient cir max-place)]
                    [next-shifted-num (* (- cir (* next-one-place-num max-place)) 10)]
                    [next-cir (+ next-shifted-num next-one-place-num)])
               (loop (- i 1) next-cir (cons next-cir acc)))]))
  
    (loop len num (cons num '())))
  
  (define p-table (make-p-table))
  (define (all-circulars-prime? i)
    (for/and ([c (circular-list i)])
      (vector-ref p-table c)))

  (length
   (for/list ([i (in-range 2 limit)]
             #:when (and (vector-ref p-table i)
                         (all-circulars-prime? i)))
             i)))
```

## LLMによる改善案
- エラトステネスの篩の開始位置を`i*2`から`i*i`に変更
	- `i*2`は2の倍数としてすでに捜査済み
- `loop`内で作る巡回数を商と余りから作る形に変更
	- `next-shifted-num`は作り方がややこしい
	- 割ったときの商と余りを使えば、シンプルに作れる
- `invalid-circular-candidate?`を追加

```racket
;; solve-35: Natural -> Natural
;; limit未満の巡回素数の個数を出力する
(define (solve-35 limit)
  (define (make-p-table)
    (define v (make-vector limit #t))
    (define (not-prime! n)
      (vector-set! v n #f))
    ; 0と1は素数ではないので除外
    (not-prime! 0)
    (not-prime! 1)
  
    (for ([i (in-range 2 (add1 (integer-sqrt limit)))]
          #:when (vector-ref v i))
      (for ([j (in-range (* i i) limit i)])
        (not-prime! j)))
    v)

  (define (circular-list num)
    (define len (sub1 (string-length (number->string num))))
    (define max-place (expt 10 len))
    (define (loop i cir acc)
      (cond [(zero? i) acc]
            [else
             ;; quotient と remainder でシンプルに分解する
             (define-values (high low) (quotient/remainder cir max-place))
             (define next-cir (+ (* low 10) high))
               (loop (- i 1) next-cir (cons next-cir acc))]))
  
    (loop len num (list num)))
  
  (define p-table (make-p-table))

  ;; 早期フィルタリング
  (define (invalid-circular-candidate? n)
    (and (>= n 10)
         (let loop ([num n])
           (cond [(zero? num) #f]
                 [else
                  (define digit (remainder num 10))
                  (if (or (even? digit) (= digit 5))
                      #t
                      (loop (quotient num 10)))]))))
  
  (define (all-circulars-prime? i)
    (for/and ([c (circular-list i)])
      (vector-ref p-table c)))
  
   (for/sum ([i (in-range 2 limit)]
             #:when (vector-ref p-table i)
             #:unless (invalid-circular-candidate? i)
             #:when (all-circulars-prime? i))
             1))
```

## 参考
- [Project Euler 35: Circular primes](https://betaprojects.com/solutions/project-euler/project-euler-problem-035-solution/)