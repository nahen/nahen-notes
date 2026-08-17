---
created: 2026-08-07
modified: 2026-08-08
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 49](http://projecteuler.net/problem=49) 「素数数列」
> 項差 3330 の等差数列 1487,  4817,  8147 は次の2つの変わった性質を持つ.
> - (i)3つの項はそれぞれ素数である.  
> - (ii)各項は他の項の置換で表される.  
>
> 1, 2, 3桁の素数にはこのような性質を持った数列は存在しないが, 4桁の増加列にはもう1つ存在する.
> 
> それではこの数列の3つの項を連結した12桁の数を求めよ.

4桁の素数を[[📝エラトステネスの篩]]で洗い出して、一覧にする。そして4桁の素数 $P_n$ において、$P_n + \frac{P_{n+2} + P_n}{2} = P_{n+1}$ が成り立つ素数を探せばいい。……と思っていざ実行してみたら、当てはまる候補がめちゃくちゃ出てきた。

- エラトステネスの篩で4桁の素数を洗い出す
- 4桁で最小の素数 $P_n$ から昇順でループ（1009〜？）
	- 4桁で最大の素数 $P_{n+2}$ から降順でループ（9973〜？）
		- $P_n +\frac{P_{n+2}-P_n}{2}$が素数かどうか判定する
		- 素数であれば、$P_n, \frac{P_{n+2}-P_n}{2}, P_{n+2}$を文字列として連結して出力する

問題文をあらためて確認すると、問題文を誤読していたことに気づく。

> - (i)3つの==項==はそれぞれ素数である.
> - (ii)各==項==は他の==項==の置換で表される.

(i)の"項"と(ii)の"項"って違う言葉なんかい！　(i)は数列の項のことだけど、(ii)は数字の一の位とか十の位のことなんかい！　英語の問題文読むまで意味がわからなかったわ！

## 学んだこと
- 

## 自分が書いたコード
- 4桁の素数の一覧をエラトステネスの篩で作る
	- 素数判定のためにBoolean配列も残している
- 順列判定`(all-correct?)`は以下の手順
	- 数値を1桁ずつ区切ってリストに変換したうえで、昇順にソート
	- ソートした3つのリストで要素と順序がすべて一致していれば、順列と判定
- 処理時間は早いが、コードがやっつけ

```racket
(define (solve-49)
  ;; 4-digits-primes
  ;; 4桁の素数の一覧を出力する
  (define 4-digits-primes-v
    (let* ([LIMIT 10000]
           [v (make-vector LIMIT #t)])
      (define (not-prime! n) (vector-set! v n #f))
      (not-prime! 0)
      (not-prime! 1)
  
      (for* ([i (in-range 2 (integer-sqrt LIMIT))]
             [j (in-range (* i i) LIMIT i)])
        (not-prime! j))
      v))

  (define primes
    (for/list ([i (in-range 1000 10000)]
               #:when (vector-ref 4-digits-primes-v i))
      i))
  
  ;; number->list
  (define (number->list n)
    (define (loop n lst)
      (cond [(>= 10 n) (cons n lst)]
            [else (loop (quotient n 10)
                        (cons (remainder n 10) lst))]))
    (loop n '()))

  (define (all-correct? la lb lc)
    (for/and ([a la]
              [b lb]
              [c lc])
      (= a b c)))

  (for/fold ([res 0])
            ([p-max (reverse primes)])
    (define current-res
      (for/first ([p-min primes]
                  #:break (= p-min p-max)
                  #:do [(define p-mid (+ p-min (quotient (- p-max p-min) 2)))]
                  #:break (< p-mid 1000)
                  #:when (vector-ref 4-digits-primes-v p-mid)
                  #:do [(define p-min-lst (sort (number->list p-min) <))
                        (define p-mid-lst (sort (number->list p-mid) <))
                        (define p-max-lst (sort (number->list p-max) <))]
                  #:when (all-correct? p-min-lst p-mid-lst p-max-lst))
        (+ (* p-min 100000000) (* p-mid 10000) p-max)))
    (cond [(false? current-res) res]
          [(or (= current-res 148748178147) (= current-res res)) res]
          [else current-res])))
```

## LLMによる改善案
- 

```racket

```

## 参考
- 