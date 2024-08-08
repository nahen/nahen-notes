---
created: 2024-07-03
modified: 2024-08-01
tags:
  - 💭
aliases: 
parents: 
title: 
---
プログラミングにおいても、[[📝Active recall]]による勉強法が通用するかもしれない。たとえば、[[🧰Anki]]で以下のような設問カード[^この設問はアトミックではない]を多く搭載したデッキをつくる。

そのデッキを暇があるときに繰っていけば、表面にある状況で書くべきコードがすぐさま出力できるようになれるかもしれない。

- 表面
```
C#にて、特定の年月の1日～月末までの日付をコンソールに出力するにはどのようなコードを書けばよいか？
```
- 裏面
```C#
int year = 2023; // 対象の年
int month = 8; // 対象の月

DateTime startDate = new DateTime(year, month, 1);
DateTime endDate = startDate.AddMonths(1).AddDays(-1);

for (DateTime date = startDate; date <= endDate; date = date.AddDays(1)) {
	Console.WriteLine(date.ToString("yyyy-MM-dd")); 
}
```

[^この設問はアトミックではない]: この例題はややアトミックではない。適切な設問にするにはもう少し分割する必要があるかも。たとえば、この例題は以下３つの設問に分割できる。この3問+複合させた問題の計4問という形が適切だろう。  
	1. 文字列をコンソールに出力するコードは？
	2. 特定の年月の月末を取得するコードは？
	3. DateTime型をループするコードは？