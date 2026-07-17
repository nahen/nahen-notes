---
created: 2026-03-31
modified: 2026-04-06
tags:
  - 📝
aliases:
parents:
title:
---
>[!memo]  [Problem 7](https://projecteuler.net/problem=7) 「10001番目の素数」
素数を小さい方から6つ並べると 2, 3, 5, 7, 11, 13 であり, 6番目の素数は 13 である.  
10001 番目の素数を求めよ.

素数判定を繰り返して、10001回目であればその素数を出力する。それまでの素数は必要ないから、別にリストとして格納しなくてもいいのか？

## 学んだこと
- この処理の重い部分は`prime?`
	- 素数リストの作成有無では処理時間はあまり変わらない
	- ただし[[📝末尾再帰]]になっていないので、スタックオーバーフローの可能性がある
- **5以上の素数は $6n \pm 1$ に存在する可能性がある**
	- Wheel Factorization
	- これを使うと、奇数だけの時よりも素数判定のステップ数を少し減らせる

## 自分が書いたコード
- 素数判定`prime?`は以前書いたコードを流用
- 素数のリストを生成して、最後尾を取得
```racket
;; prime-index : Number -> Number
;; n番目の素数を表示する
(define (prime-index n)
  (define (prime? n)
    (and (> n 1)
         (or (= n 2)
             (and (odd? n)
                  (for/and ([i (in-range 3 (add1 (integer-sqrt n)) 2)])
                    (not (zero? (modulo n i))))))))

  (define (make-list i lst acc)
    (if (= acc n)
        lst
        (if (prime? i)
            (cons i (make-list (+ i 1) lst (add1 acc)))
            (make-list (+ i 1) lst acc))))

  (first (reverse (make-list 2 empty 0))))
```

## LLMによる改善案
- `prime?`の判定式を $6k \pm 1$ 式に置き換え
- ネストした`if`は`cond`に置き換える（Claude）

```racket
;; nth-prime : Number -> Number
;; n番目の素数を表示する
(define (nth-prime n)
  (define (prime? n)
    (cond
      [(<= n 1) false]
      [(<= n 3) true]
      [(or (zero? (modulo n 2)) (zero? (modulo n 3))) false]
      [else
       (for/and ([i (in-range 5 (add1 (integer-sqrt n)) 6)])
         (and (not (zero? (modulo n i)))
              (not (zero? (modulo n (+ i 2))))))]))

  (if (= n 1)
      2
      (let loop ([i 3] [acc 1])
        (cond [(and (prime? i) (= (add1 acc) n) i)]
              [(prime? i) (loop (+ i 2) (add1 acc))]
              [else (loop (+ i 2) acc)]))))
```

## 参考
- [Project Euler Problem 7: 10001st prime \| Grae](https://www.grae.io/post/euler_problem_7/)