---
created: 2026-08-19
modified: 2026-08-21
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 50](http://projecteuler.net/problem=50) 「連続する素数の和」
> 素数41は6つの連続する素数の和として表せる:
> 
> 41 = 2 + 3 + 5 + 7 + 11 + 13.
> 
> 100未満の素数を連続する素数の和で表したときにこれが最長になる.
> 
> 同様に, 連続する素数の和で1000未満の素数を表したときに最長になるのは953で21項を持つ.
> 
> 100万未満の素数を連続する素数の和で表したときに最長になるのはどの素数か?

素数の上限値が100万と指定されているので、ここでも[[📝エラトステネスの篩]]が使えそう。あとは、連続する素数を足していって、その和が素数かどうか判定する？

ところで素数は2以外奇数である。そのため、和に含まれる素数の個数は以下のどちらかになる。
- 初期値が2ならば、個数は必ず偶数（偶数+奇数は奇数）
- 初期値が2以外ならば、個数は必ず奇数（奇数+奇数は偶数）

ざっくりな作り方はこんな感じ？
- エラトステネスの篩で素数一覧を作る
- 初期値2〜50万でループ(`for/fold`)
	- 足し合わせる値3〜50万付近の素数でループ
		- 総和が100万より大きければbreak
		- 総和が素数であれば、現在の最長値と比較する
			- 現在の最長値よりも長ければ、最長値を更新する

- 入力値が素数かどうか判定する関数

## 学んだこと
- 累積和
	- 数列の先頭部分を足し合わせて求められる総和の数列
		- 自然数（1, 2, 3, …）の累積和は三角数（1, 3, 6, …）

## 自分が書いたコード
- とにかく答えを出すことを優先
	- 初期値から素数を順に足していって、その和が素数か否か判定する
		- 素数であればその値を「このループの総和」「このループの最長値」として保存
	- 和が上限値（100万）を超えた場合
		- 「このループの最長値」が「現在の最長値」より大きい場合
			- 「現在の最長値」と「現在の総和」を更新する
		- その後初期値を一つ先の素数に進めて、もう一度ループ
- 答えが出るまで数秒かかる

```racket
(define (solve-50)
  (define LIMIT 1000000)
  ;; エラトステネスの篩で100万未満の素数一覧を作る
  (define p-table
    (let ([v (make-vector LIMIT #t)])
      (define (not-prime! n) (vector-set! v n #f))
      (not-prime! 0)
      (not-prime! 1)

      (for* ([i (in-range 2 (add1 (integer-sqrt LIMIT)))]
             [j (in-range (* i i) LIMIT i)])
        (not-prime! j))
      v))

  (define (prime? n)
    (vector-ref p-table n))

  (define-values (result-sum result-cnt)
    (for/fold ([result-sum 0]
               [result-cnt 0])
              ([a (in-range 2 LIMIT)]
               #:when (prime? a))
      (define-values (sum cnt max-sum max-cnt)
        (for/fold ([sum 0]
                   [cnt 0]
                   [max-sum 0]
                   [max-cnt 0])
                  ([i (in-range a LIMIT)]
                   #:when (prime? i)
                   #:do [(define s (+ i sum))]
                   #:break (>= s LIMIT))
          (values (+ i sum)
                  (add1 cnt)
                  (if (prime? s) (+ i sum) max-sum)
                  (if (prime? s) (add1 cnt) max-cnt))))
      (if (> max-cnt result-cnt)
          (values max-sum max-cnt)
          (values result-sum result-cnt))))
  result-sum)
```

## LLMによる改善案（累積和）
- エラトステネスの篩に、`#:when`を追加
	- `i`が素数のときだけ実行する
	- これだけで処理時間がだいぶ減った
- 累積和を使った解法

```racket
(define (solve-50)
  (define LIMIT 1000000)

  ;; エラトステネスの篩で100万未満の素数一覧を作る
  (define p-table
    (let ([v (make-vector LIMIT #t)])
      (define (not-prime! n) (vector-set! v n #f))
      (not-prime! 0)
      (not-prime! 1)

      (for* ([i (in-range 2 (add1 (integer-sqrt LIMIT)))]
             #:when (vector-ref v i)
             [j (in-range (* i i) LIMIT i)])
        (not-prime! j))
      v))
  
  (define (prime? n)
    (vector-ref p-table n))

  ;; 素数のリストを作る
  (define primes
    (for/vector ([p (in-range 0 LIMIT)]
               #:when (prime? p))
      p))

  ;; 累積和を作る
  (define prefix
    (let ([v (make-vector (add1 (vector-length primes)) 0)])
      (for ([i (in-range (vector-length primes))])
        (vector-set! v
                     (add1 i)
                     (+ (vector-ref v i)
                        (vector-ref primes i))))
      v))
  ;; 連続する素数を2から足し続けて、LIMIT未満になる最大長を求める
  (define max-length
    (for/first ([i (in-range (vector-length prefix))]
                #:when (>= (vector-ref prefix i) LIMIT))
      i))
  
  (define (find-sum len)
    (for/first ([i (in-range 0 (add1 (- (vector-length primes) len)))]
                #:when (if (= i 0)
                           (even? len)
                           (odd? len))
                #:do [(define sum (- (vector-ref prefix (+ len i)) (vector-ref prefix i)))]
                #:break (>= sum LIMIT)
                #:when (prime? sum))
      sum))
  
  ;; 長い順に探索
  (for/first ([len (in-range max-length 0 -1)]
              #:do [(define res (find-sum len))]
              #:when res)
    res))
```

## 参考
- 