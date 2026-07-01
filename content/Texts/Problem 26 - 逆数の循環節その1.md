---
created: 2026-05-22
modified: 2026-05-22
tags:
  - 📝
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 26](http://projecteuler.net/problem=26) 「逆数の循環節 その1」
> 単位分数とは分子が1の分数である. 分母が2から10の単位分数を10進数で表記すると次のようになる.  
>> 1/2 = 0.5  
>> 1/3 = 0.(3)  
>> 1/4 = 0.25  
>> 1/5 = 0.2  
>> 1/6 = 0.1(6)  
>> 1/7 = 0.(142857)  
>> 1/8 = 0.125  
>> 1/9 = 0.(1)  
>> 1/10 = 0.1
>
> 0.1(6)は 0.166666... という数字であり, 1桁の循環節を持つ. 1/7 の循環節は6桁ある.
>
> d < 1000 なる 1/d の中で小数部の循環節が最も長くなるような d を求めよ.

循環節を検出するにはどうすればいいんだ？　何をもってすれば循環節をもっているとみなせる？

調べてみると、循環小数になる可能性があるのは、単位分数の分母が素数あるいはその倍数のものらしい。（ただし、1/2と1/5は循環小数にならない）そして、素数 $p$ の逆関数の循環節の長さは、 $10^k ≡ 1 (\mod p)$ となる最小の整数 $k$ と一致するのだとか。本当に？

これを自分で一から考えて実装しろ、なんて言われたら、1週間かけてもできないと思う。私は[[📑The Computer as a Communication Device|インターネットによる知能増幅]]の恩恵にあずかっている。

## 学んだこと
- 

## 自分が書いたコード
- かなりごちゃごちゃしている

```racket
;; longest-digit-recur-cycle Natural -> Natural/false
;; limitより小さい整数の範囲で、小数部の循環節が最も長い整数を求める。存在しない場合はfalse
(define (longest-digit-recur-cycle limit)
  ;; primes: Natural -> (vectorof Boolean)
  ;; 上限値より小さい値(limit > 2)の素数テーブルを求める
  (define (primes limit)
    (define p-table (make-vector limit #t))
    (define (not-prime! idx)
      (vector-set! p-table idx #f))

    (not-prime! 0);0は素数ではない
    (not-prime! 1);1は素数ではない
  
    (for ([p (in-range 2 (add1 (integer-sqrt limit)))]
          #:when (vector-ref p-table p))
      (for ([i (in-range (* p p) limit p)])
        (not-prime! i)))
    p-table)

  ;; digit-recur-cycle: Natural -> Natural
  ;; 入力値(素数)の逆数から循環数の長さを求める
  (define (digit-recur-cycle p)
    (define (loop k)
      (cond [(= (modulo (expt 10 k) p) 1) k]
            [else (loop (add1 k))]))

    (if (or (= p 2) (= p 5))
        0
        (loop 1)))
  
  (cond [(<= limit 2) #f]
        [else
         (define p-table (primes limit))
         (define-values (best-i max-len)
           (for/fold ([current-best-i #f]
                      [current-max-len 0])
                     ([b p-table]
                      [i (in-naturals 0)])
             (if b
                 (let ([len (digit-recur-cycle i)])
                   (if (< current-max-len len)
                       (values i len)
                       (values current-best-i current-max-len)))
                 (values current-best-i current-max-len))))
         best-i]))
```

## LLMによる改善案
- 

```racket

```

## 参考
- 