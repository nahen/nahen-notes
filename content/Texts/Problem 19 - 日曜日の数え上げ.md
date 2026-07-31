---
modified: 2026-07-31
created: 2026-05-02
tags:
  - 📝
aliases:
parents: "[[🌐Project Euler]]"
title:
---
>[!memo] [Problem 19](http://projecteuler.net/problem=19) 「日曜日の数え上げ」
> 次の情報が与えられている.
> 
> - 1900年1月1日は月曜日である.
> - 9月, 4月, 6月, 11月は30日まであり, 2月を除く他の月は31日まである.
> - 2月は28日まであるが, うるう年のときは29日である.
> - うるう年は西暦が4で割り切れる年に起こる. しかし, 西暦が400で割り切れず100で割り切れる年はうるう年でない.
>
> 20世紀（1901年1月1日から2000年12月31日）中に月の初めが日曜日になるのは何回あるか?

よくある日付を求める問題。でも「月の初めが日曜日は何回か？」は初めて取り組む問題かも。

初期値が設定されていて、かつ曜日は7日周期。なので、理論的には求められる。ただ、面倒くさい点が2つある。ひとつは、2月の日数が変わる点。もうひとつは、初期値は1900年1月1日だが、求めたい範囲の開始年月日は1年後の1901年1月1日である点。

- 1月、3月、5月、7月、8月、10月、12月：31日
- 4月、6月、9月、11月：30日
- 2月：28日、ただしうるう年ならば29日

初期値である「1月1日(月)」を1と置けば、曜日は日数を7で割った余りで求められる。

| 日数を7で割った余り | 曜日  |
| ---------- | --- |
| 1          | 月   |
| 2          | 火   |
| 3          | 水   |
| 4          | 木   |
| 5          | 金   |
| 6          | 土   |
| 0          | 日   |

月初めの日は、元の日数に各月の日数（定数）を足し合わせれば求められる。ただし2月だけは変動する。
- 1月1日(1)+1月の日数(31)＝2月1日(32)
- 2月1日(32)+1900年2月の日数(28)=3月1日(50)

月の初めとなる日を求めて、その日の曜日が日曜日となる日を数え上げればいい。

## 学んだこと
- ツェラーの公式

## 自分が書いたコード
- 力技で解決している
	- Project Eulerの想定解ではない
	- 1901年1月1日〜2000年12月31日までの毎日が対象になっている
		- 月初だけでいいのに、加えて30日近くムダに計算している
- 日付や時刻に関するライブラリ`(rakcet/date)`を使用
	- うるう年や曜日の判定はライブラリに任せている

```racket
(require racket/date)

(define SECONDS-PER-DAY (* 24 60 60))

;; counting-sundays: Time Time -> Integer
;; 期間内で月初が日曜日となる回数を数え上げる
(define (counting-sundays start-sec end-sec)
  (for/sum ([current-s (in-range start-sec (add1 end-sec) SECONDS-PER-DAY)]
            #:when (and (= (date-day (seconds->date current-s)) 1)
                        (= (date-week-day (seconds->date current-s)) 0)))
    1))
```

## [ツェラーの公式](https://ja.wikipedia.org/wiki/%E3%83%84%E3%82%A7%E3%83%A9%E3%83%BC%E3%81%AE%E5%85%AC%E5%BC%8F#%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E3%81%A7%E3%81%AE%E8%A8%88%E7%AE%97)を使った別解
- 1901年1月〜2000年12月の月初だけが対象になっている
- 処理がめちゃくちゃ早い

```racket
;; counting-sundays-zeller : Void -> Integer
;; 1901年〜2000年で月初が日曜日となる回数を数え上げる
(define (counting-sundays-zeller)
  (define (zeller y m d)
    (let* ([is-jan-or-feb? (< m 3)]
           [year (if is-jan-or-feb? (sub1 y) y)]
           [month (if is-jan-or-feb? (+ m 12) m)])
      (modulo (- (+ year
                    (quotient year 4)
                    (quotient year 400)
                    (quotient (+ (* 13 month) 8) 5)
                    d)
                 (quotient year 100)) 7)))

  (for*/sum ([year (in-range 1901 2001)]
             [month (in-range 1 13)]
             #:when (zero? (zeller year month 1)))
    1))
```
