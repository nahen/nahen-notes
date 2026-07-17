---
created: 2024-01-02
modified: 2024-07-30
tags:
  - 📑
aliases: 
parents: 
---
松尾研究室の岩沢有祐氏がサマーキャンプで発表したスライドを年末に公開してくれていた。

LLMの基礎知識を身につけるために、自分の言葉に変換してメモにまとめる。
最下部にLLMの各仕組みへのリンクを載せている。

## 言語モデル(Language Models)とは？
![[言語モデルとは.png]]

ある単語列（x1, x2, x3, …）の並び順（≒文章）の発生しやすさを、生成確率pで表せるようにモデル化したもの。
$$p(x_1, x_2, …, x_L)$$
言語タスクは、この生成確率を推定する問題とも言い換えられる。ではその生成確率を求めるためのモデルをどのようにして求めるのか？

## 自己回帰言語モデル
上記の言語モデルを条件分布の積として表現する。
$$p(x_1, x_2, …,x_L)=p(x_1)p(x_2|x_1)…p(x_L|x_1, x_2,…,x_{L-1})$$
このように確率の連鎖律で分解したモデルを特に自己回帰言語モデルと呼ぶ。  
[条件付き確率の連鎖律(chain rule)について | 機械学習と情報技術](https://disassemble-channel.com/chain-rule-of-conditional-probabilities/)

![[条件付き確率を求めれば生成できる.png|]]

[[📝条件付き確率]]がわかると、後に続く文字列を生成することができる。  
（毎回生成確率が最大のものを取ることはGreedy Decodingと呼ばれる）  
（毎回最大のものを取らずに、いくつか候補を取っておく方法もある。推定した生成確率そのままではなく、温度Tにより分布をなめらかにすることもある）

では[[📝条件付き確率]]はどうやって求めるか？

## ニューラル言語モデル
![[ニューラル言語モデル.png]]

条件付き確率をなんらかのニューラルネットで推定したモデル。
他の学習と同様、[[尤度]]（ゆうど、最もらしさ）を最大化するように訓練。（[[誤差逆伝播]]）

## Next Token Prediction
![[NextTokenPrediction.png]]

自己教師あり学習の一種。
学習用のテキストデータを使って、LMの答えと正しい答えが合うようにモデルを調節する。これにより正しいトークンの生成確率が高まるようにする。

![[NextTokenPrediction2.png]]

## Transformer
Googleを中心とした研究チームが2017年に発表。  
Self Attentionを中心としたネットワーク構造。

## Generative Pre-training Transformer(GPT)
OpenAIにより2018年に発表された言語モデル。  
事前学習にTransformerを使っている。  
具体的には、次に来る単語をTransformerで予想するように学習する。  
GPT, GPT-2, GPT-3とバージョンアップするごとに学習データ数やモデルサイズが増加。

## なぜ今LLMを学ぶのか？

### 1. Scaling and Emergence

### 2. 汎用性（Prompting / In-Context Learning）


## 概観
- 第2回: [[📑Prompting and Augmented Language Model]]
	- モデルのパラメータを変えずにLLMの性能を引き出す技術を会得する
- 第3回: [[Pre-training Pipeline]]
	- Transformerとその事前学習の仕組みを理解する
- 第4回: [[Scaling Pre-training]]
	- モデルをスケールする理由を知る
	- モデルのスケールにおける課題を知る
- 第5回: [[Parameter Efficient Fine-Tuning]]
	- LLMの性能改善を実現するためのファインチューニングについて理解する
- 第6回: [[RLHF (Advanced Topic for Tuning Pre-trained Models)]]
	- RLHFとは何か、その仕組みや必要性を理解する
- 第7回: [[Going Beyond LLM]]
	- LLMの最前線（2023年11月時点？）を知る
