---
created: 2024-08-08
modified: 2024-08-11
tags:
  - 💎
aliases: 
parents: 
title: 
---
Obsidianには脚注をつける機能がある。

![[🧰マークダウン記法#脚注]]

Obsidianで作ったメモをQuartzで公開したい場合は、脚注につけるID名は半角英数字で入力すること。日本語（あるいはマルチバイト文字全般）でID名をつけると、脚注の参照がうまくいかなくなる。  
逆に、脚注IDを半角英数字で名付けた場合は、脚注が問題なく参照できる。

## なぜうまくいかないのか？
自分でもよくわからない。

Quartzは脚注ID名をHTMLタグのID名として使っている。  脚注要素の固定ID`user-content-fn-`の末尾に、URLエンコード化した脚注ID名を加えた形。

anchorタグが指すリンク先にも、脚注のHTMLタグのID名にも同じ文字列が入っている。それなのに参照がうまくいかない。なんで？