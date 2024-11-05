---
created: 2024-07-11
modified: 2024-11-04
tags:
  - 🌐
aliases: 
parents: 
title: 
url: 
---
[[🌐Don’t Build Useless Features]]を自力で日本語に翻訳したものを以下に載せる。

***
%%As a product manager, it’s important to hone the minimum set of activities that allow you to keep a product line moving forward productively. One of the most important core product management skills: the ability to triage unsuccessful products and avoid spending unnecessary effort on products that are destined to be losers.%%
プロダクトマネージャーとして、製造ラインを生産的に前進させ続ける最小セットのアクティビティを磨くことは重要です。最も重要で中核となるプロダクト・マネジメント技術の一つは、失敗した製品をトリアージし、失敗する運命にある製品に不必要な労力を費やさないようにする能力です。
%%In my career, I’ve built several products that wound up being completely useless, wasting time upfront in every case, and frequently wasting a ton of time afterwards when we had to unceremoniously mercy-deprecate our failed features. A few common ways that this can happen:%%
キャリアの中で、私はいくつか製品を作ってきたものの、完全に役立たずになる羽目になり、どんな場合でも事前に費やした時間を無駄にし、その後失敗した機能をいきなり非推奨にしなければならなくなった時に、しばしば膨大な時間を無駄にしました。こんなことが起こる一般的な原因は以下のとおりです。

%%
- Your CEO demands that you build a feature that they’re confident will help you win your market.
- A prospect says that they require a new feature, and they promise / pinky-swear that they’re absolutely going to use it.
- Your head of sales or marketing is pressuring you to tackle a new partnership that they think will up-level your product’s perception in the market.
%%
-  CEOがこの機能が市場での勝利を助けると確信し、機能を開発することを要求する
- 見込み客が新機能が必要だと言い、絶対にその機能を使うと約束する
- 営業またはマーケティング責任者が、市場での製品の認知度を上げると思われる新たな協力関係に取り組むように圧力をかけている

%%Building bad products is an [unforced product management error](https://staysaasy.com/management/2020/10/05/unforced-errors.html). You didn’t have to build these products – you chose to do it. By checking on a product’s value well before it launches, you’ll be able to save hundreds of hours of work building, nurturing, and ultimately deprecating a fundamentally unviable product.%%
悪い製品を作ることは、自分の責任によるプロダクト・マネジメントのエラーです。それらの製品を作る必要はなかったのですがーーあなたは作ることを選んだのです。製品の販売よりずっと前にその価値を確認することで、根本的に実現不可能な製品を開発・育成し、最終的には非推奨にするために費やす何百時間もの作業を節約することができるでしょう。

%%In my opinion in today’s age of SaaS products and Zoom meetings there is no excuse to ever ship a high effort feature that entirely flops. When Google builds things that nobody cares about, it’s an inert, victimless crime. When your high growth company commits the sin of building something that nobody gives a crap about, you’re stealing valuable resources from other projects that matter. At a high-growth company with product/market fit, you will always have more good ideas than you can act upon. Everything you build should add value.%%
個人的には、今日のSaaS製品やZoomミーティングの時代において、労力をかけて完全な失敗である機能をリリースする口実はありません。Googleが誰も気に留めないものを作ったら、それは無気力であり、犠牲者なき犯罪です。あなたのいる高成長企業が、どうでもいいものを作るという罪を犯した場合、他の重要なプロジェクトから貴重なリソースを盗んでいることになります。製品と市場が一致する高成長企業では、実行できる以上の良いアイデアが常にあります。あなたが作るものはすべて、価値を加えなければなりません。

%%Luckily, avoiding worthless products is really easy for SaaS companies. In consumer tech you often need to guess at which products will work and which won’t. But in SaaS, customers pay you for the pleasure of using your product, and you can literally check whether functionality will bring value before you invest significant effort. Here are a few of the most efficient techniques and tactics that you can use:%%
幸いなことに、価値のない製品を避けるのはSaaS企業にとってとても簡単なことです。消費者向けテクノロジーでは、どの製品が機能し、どの製品が機能しないかを推測する必要がしばしばあります。しかしSaaS企業では、顧客は製品を使う楽しみのためにお金を払う上、かなりの労力を費やす前に、機能が価値をもたらすかどうかを文字通り確認できます。ここでは、あなたが使える最も効果的な技術と戦術をいくつか紹介します。
%%
- Launch products iteratively as you add functionality. Release first to 10 customers, then 50, then 200. If you can’t get meaningful adoption at any stage OR the product isn’t looking vital for an important subset of your customers, cut the feature. You don’t want to support it. Really live the M in MVP – launch minimal offerings and triple down on the ones that work. For example, if you’re considering a new reporting feature, try pulling data out of your data warehouse and “building” the UI in an Excel chart that you show to your customers before you actually write a single line of code. Your minimum viable product may literally not be a product at all.
- Don’t launch a product until you’ve put a prototype in front of a few customers and gotten feedback. Make sure that they say that they’ll find value in it – key questions include things like “how would you use this feature?” “how useful would this feature be on a scale of 1-10?” “how are you solving this problem today?” For the best ideas, customers will usually react very positively and have consistent strong opinions on how they would use the product in real life.
- Even better, try to sell a product before you build it. Get to the point where you have a clickable prototype and put it in front of a few of your customers. See if you can get any of them to say that they would buy it before you build it.
- Put extra scrutiny on features that none of your competitors have built yet. Recognize that your competitors are (usually) smart – if there’s an obvious-seeming feature out there that none of them have built yet there can only be a few reasons why: It’s really hard to build, you have some unique advantage that makes it valuable for your product but not others, it’s really not obvious (ie you have some unique insight), or it’s not useful. If you’re going to build something that nobody else has, be intellectually honest with yourself about why that is.
%%
- 機能を追加しながら、製品を繰り返しリリースすること。最初は10人の顧客にリリースし、次は50人、次は200人にリリースしましょう。もしどの段階でも意義のある採択が得られない場合、または製品が顧客の重要な小集団にとって必要不可欠に見えない場合は、機能を削ぎましょう。あなたはその機能をサポートしたくないのです。MVP[^MVP]の"M"を真に活かしましょうーー最小の製品をリリースして、機能するものに3倍賭けするのです。例えば、新しいレポート機能を検討しているのであれば、実際にコードを一行書く前に、データウェアハウスからデータを取得して、顧客に見せるUIをExcelのグラフで作ってみましょう。実用最小限の製品は、文字通りまったく製品ではない可能性があります。
- プロトタイプを数人の顧客の前に置いてフィードバックを受けるまでは、製品をリリースしないこと。この製品には価値があると顧客が言えるようにしましょうーー重要な質問には以下の内容を含んでいます。「この機能をどのように使いますか？」「この機能の便利さは10段階でどれぐらいですか？」「今日はこの問題をどんな風に解決していますか？」一番いいアイデアに対して、顧客は通常とてもポジティブに反応して、実際にどのように製品を使うかについて一貫した強い意見を持つでしょう。
- さらに良いのは、製品を作る前に製品を売ってみること。クリックできるプロトタイプを作り、数人の顧客の前に置きます。製品を作る前に、顧客に製品を買いたいと言わせられるかどうかを確認しましょう。
- 競合他社がまだ作っていない機能をさらに精査すること。競合他社は（通常）賢いとみなしましょう。明白に見える機能をまだ誰も作っていない場合、そこにはいくつかの理由があります。作るのが本当に難しいか、自分達の製品には価値があるが他の製品には価値のない独自の利点があるか、（あなたに独自の洞察がある場合は）実は明らかになっていないか、役に立たないか、です。誰も作っていないものを作ろうとしている場合は、誰も作っていない理由について自分自身に知的に正直になりましょう。

[^MVP]: Minimum Viable Product（実用最小限の製品）の意。実用上、最小限の機能のみを実装した製品。私は読み始めた当初、Most Valuable Player（スポーツ等の最優秀選手）だと勘違いした。

%%The steps above are really easy to do – so easy that they may seem useless. I promise that they’re not. If you start to actually run these experiments at the start of new projects, you’ll be able to cut unviable initiatives before anyone gets emotionally attached and does something stupid like finishing them. If you’re a new PM on a team, one of the quickest ways that you can add value is to run these sorts of checks on any in-flight projects to make sure that you aren’t already embarking on a mission to nowhere.%%
上記の手順はとても簡単にできます。簡単すぎて役に立たなさそうに思えるほどです。そんなことはないと約束します。新規プロジェクトの開始時にこれらの実験を実際に行い始めると、誰かが感情的になって、プロジェクトを完成させる等のバカらしいことをする前に、実現不可能な計画を省くことができるでしょう。あなたがチームの新しいPMである場合、価値を加えられる一番早い方法の一つは、実施中のプロジェクトにこれらのチェック項目を調査して、まだ目的のないミッションを開始していないかを確かめることです。

%%While cutting unneeded features from your roadmap won’t inherently drive your business forward, it delivers significant value fast: and it frees up time for you to find the products that actually will lead you to the promised land. Don’t delay – cut your worthless projects now.%%
ロードマップから必要のない機能を省くことが、本質的にはビジネスを前進させるわけではありません。しかし重要な価値を素早く提供し、実際に約束の地へと導くであろう製品を見つけるための時間を確保できます。先延ばしにせず、価値のないプロジェクトを省きましょう。