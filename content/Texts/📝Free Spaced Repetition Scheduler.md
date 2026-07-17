---
created: 2024-04-11
modified: 2024-07-30
tags:
  - 📝
aliases:
  - FSRS
parents: 
---
[[Jarrett Ye]]氏が提唱した、Anki用の間隔学習アルゴリズム。オープンソースで公開されている。  
AnkiのデフォルトであるSM-2アルゴリズムよりも高性能だと謳っている。

FSRSは[Three component model of memory](https://supermemo.guru/wiki/Three_component_model_of_memory)に基づいている。以下3つの変数（$R, S, D$）の設定とAnkiでの評価結果から、単語帳の次回スケジュールを忘却曲線に沿って設定する。この3つの変数を総称して「Memory State」と呼び、各カードに各々の$R, S, D$値を持っている。
- $R$ : Retrievability（想起確率）
	- ある時間にある情報を思い出せる確率
- $S$ : Stability（$R$が90%に減少するまでにかかる日数）
	- ex. $S = 365$ のとき、ある情報を思い出せる確率が約1年後に90％になる
	- $S_{T}^{'}$ : 思い出した後の次の間隔
	- $S_{f}^{'}$ : 忘れた後の次の間隔
- $D$ : Difficulty（難度）（$1 \leq D \leq 10$）
	- 思い出すまでの難しさ
- $G$ : Grade（Ankiでの評価）
	- 1: もう一度
	- 2: 難しい
	- 3: 覚えた
	- 4: 簡単