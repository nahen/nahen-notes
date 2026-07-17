---
created: 2026-04-02
modified: 2026-04-06
tags:
aliases:
parents: "[[📝Project Euler]]"
title:
---
>[!memo] [Problem 8](https://projecteuler.net/problem=8) 「数字列中の最大の積」
>次の1000桁の数字のうち, 隣接する4つの数字の総乗の中で, 最大となる値は, 9 × 9 × 8 × 9 = 5832である.  
>
>7316717653133062491922511967442657474235534919493496983520312774506326239578318016984801869478851843858615607891129494954595017379583319528532088055111254069874715852386305071569329096329522744304355766896648950445244523161731856403098711121722383113622298934233803081353362766142828064444866452387493035890729629049156044077239071381051585930796086670172427121883998797908792274921901699720888093776657273330010533678812202354218097512545405947522435258490771167055601360483958644670632441572215539753697817977846174064955149290862569321978468622482839722413756570560574902614079729686524145351004748216637048440319989000889524345065854122758866688116427171479924442928230863465674813919123162824586178664583591245665294765456828489128831426076900422421902267105562632111110937054421750694165896040807198403850962455444362981230987879927244284909188845801561660979191338754992005240636899125607176060588611646710940507754100225698315520005593572972571636269561882670428252483600823257530420752963450
>
>この1000桁の数字から13個の連続する数字を取り出して, それらの総乗を計算する. では、それら総乗のうち、最大となる値はいくらか.

パッと思いつくのは、「先頭から末尾まで、隣接する数字13桁の積を計算し続けてmaxを探す」方法。でも、文字のリストを数値に変換って、どうやるんだ……？

## 学んだこと
- 数字だからといって無理にNumberにしなくてもいい
	- 数値そのものを扱わないなら、Stringでもいい
	- この問題はスライスを扱うので、Stringで取り込むほうが楽
- スライディング・ウィンドウ
- `(take lst pos)`
	- リストから`pos`ぶんの要素を取り出す
- `(apply proc lst)`
	- リストの各要素に式を適用する

## 自分が書いたコード
- `(max lst)`は不要
	- `(apply max lst)`でよかった
	- 車輪の再発明をしている
- `number->list`はLLMに助けてもらった
	- `(- (char->integer c) (char->integer #\0)))`
		- `char`型の`#\0`は、`integer`型で48
		- `#\0`〜`#\9`は48、49、50、…と連続している
		- `(char->integer #\(1桁の数字)）)`から`(char->integer #\0)`を引けば、`integer`型の数字が得られる
	- 文字列の数値判定を飛ばせるぶん、処理が高速化する（らしい）

```racket
;; largest-product-in-a-series : Number Number -> Number
;; 特定の数字から、隣接するn桁の数字の最大積を取得する
(define (largest-product-in-a-series num digit)
  ;; sliding-window : (listof Number) Number -> (listof (listof Number))
  ;; リストからn個の要素ごとに分割したリストを作る
  (define (sliding-window lst n)
    (let loop ([remaining lst])
      (if (< (length remaining) n)
          empty
          (cons (take remaining n)
                (loop (rest remaining))))))

  ;; number->list : Number -> (listof Number)
  ;; 数値を1桁ごとのリストに変換する
  (define (number->list num)
    (map (lambda (c) (- (char->integer c) (char->integer #\0)))
         (string->list (number->string num))))
  
  ;; max : (listof Number) -> Number
  ;; 数字のリストの最大値を取り出す
  (define (max lst)
    (let loop ([remaining lst]
               [max 0])
      (cond [(empty? remaining) max] 
            [else (if (< max (first remaining))
                      (loop (rest remaining) (first remaining))
                      (loop (rest remaining) max))])))
  
  (let ([lst (sliding-window (number->list num) digit)])
    (max
     (map (lambda (l)
            (for/product ([i (in-list l)]) i))
          lst))))
```

## LLMによる改善案
- ネストが少ないぶん、すっきりして見える
- 新たに`(max lst)`を作らなくても、既存関数`(max ...)`で対応できる
```racket
(define (max-product num window-size)
  (define digits
    (map (λ (c) (- (char->integer c) (char->integer #\0)))
         (string->list (number->string num))))
  
  (define (sublist lst start len)
    (take (drop lst start) len))

  (define (product lst)
    (apply * lst))
  
  (for/fold ([max-val 0])
            ([i (in-range 0 (- (length digits) window-size -1))])
    (max max-val
         (product (sublist digits i window-size)))))
```

## 参考
- [4.3 Function Calls](https://docs.racket-lang.org/guide/application.html#%28part._apply%29)