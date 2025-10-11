---
created: 2025-10-10
modified: 2025-10-10
author: Centre for Education Statistics and Evaluation
publisher:
parents: "[[🗺️035_学習MOC]]"
aliases:
tags:
  - 📑
title: 📑Cognitive load theory in practice（認知負荷理論の実践）
url: https://education.nsw.gov.au/about-us/education-data-and-research/cese/publications/practical-guides-for-educators/cognitive-load-theory-in-practice
---
[[📝認知負荷]]を調節するための手順を教える冊子。2018年にCentre for Education Statistics and Evaluation[^1]が発行。

## 認知負荷への対応戦略

| No. | 戦略          | 関連する項目                         |
| --- | ----------- | ------------------------------ |
| 1   | ちょうどよい負荷にする | Element interactivity          |
| 2   | 手取り足取り教える   | [[📝解法つき例題]]                   |
| 3   | 学習者に任せる     | [[📝熟達化反転効果]]                  |
| 4   | いらない情報を省く   | Redundancy effect（冗長効果）        |
| 5   | 一つの図にまとめる   | Split-attention effect（分割注意効果） |
| 6   | 視覚と聴覚を使う    | Modality effect（モダリティ効果）       |
| 7   | イメージを思い浮かべる | Imagination effect             |

## 認知負荷管理のフローチャート
```mermaid
flowchart TD

s1 --> q1
q1 -->|難しそう| s2
q1 -->|簡単そう| s3_7
s2 --> q2
q2 -->|理解できる| s4
q2 -->|理解できない| s5_6 


s1["#1: ちょうどよい負荷にする"]
q1{この問題は難しそうか？}
s2["#2: 手取り足取り教える"]
s3_7["`#3: 学習者に任せる
#7: イメージを思い浮かべる`"]
q2{この問題だけで理解できそうか？}
s4["#4: いらない情報を省く"]
s5_6["`#5: 一つの図にまとめる
#6: 視覚と聴覚を使う`"]

```

[^1]: オーストラリアのニューサウスウェールズ州にある教育機関と思われる。同州の教育省が管轄している組織？
