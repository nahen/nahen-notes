---
created: 2024-11-21
modified: 2024-11-21
tags:
  - 🦾
aliases: 
parents: 
title: 
---
Gitでリモートリポジトリにプッシュしようとしたら、以下のエラーが表示されてプッシュできなかった。

```
Git: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
```

エラー文をGoogleで調べたところ、`http.postBuffer`の値を変更すればよいとのこと。[^cite]そこで上限値をデフォルト（1MiB[^mib]）から150MiBに変更したところ、無事プッシュできるようになった。

[^cite]: [【備忘録】Git - push時のエラーの解消](https://zenn.dev/hiro8_hiro8/articles/d63b3bfbe2c86e)を参考にした。
[^mib]: ≒1MB。[MiB(メビバイト)](https://kotobank.jp/word/%E3%82%81%E3%81%B3%E3%81%B0%E3%81%84%E3%81%A8-644259#w-644259)は2進接頭辞）

```
git config --global http.postBuffer 157286400
```

ただし後述のとおり、`http.postBuffer`の値を変更することはあまり良い解決方法ではないらしい。なので、無事にプッシュできた後は、デフォルト値に戻しておいた方がいいかもしれない。

## `http.postBuffer`とは？
>[!cite]
>**http.postBuffer**  
>Maximum size in bytes of the buffer used by smart HTTP transports when POSTing data to the remote system. For requests larger than this buffer size, HTTP/1.1 and Transfer-Encoding: chunked is used to avoid creating a massive pack file locally. Default is 1 MiB, which is sufficient for most requests.  
>リモートシステムにデータを POST するときにスマートHTTPトランスポートで使われるバッファの最大サイズ(バイト単位)。このバッファサイズよりもリクエストが大きい場合、ローカルで大規模なパックファイルが作成されないように、HTTP/1.1および [Transfer-Encoding](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Transfer-Encoding): chunked（データをチャンク（塊）の連続で送ること）が使われます。デフォルトは1MiBで、ほとんどのリクエストにはこれで十分です。
>
>Note that raising this limit is only effective for disabling chunked transfer encoding and therefore should be used only where the remote server or a proxy only supports HTTP/1.0 or is noncompliant with the HTTP standard. Raising this is not, in general, an effective solution for most push problems, but can increase memory consumption significantly since the entire buffer is allocated even for small pushes.  
>この上限値を上げることが効果的なのは、[チャンク転送エンコーディング](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)を無効にする場合だけであることに注目してください。そのため、リモートサーバーまたはプロキシがHTTP/1.0しかサポートしていない場合か、HTTP標準に準拠していない場合にのみ使われるべきです。通常、上限値を上げることは、ほとんどのプッシュ問題に対する効果的な解決策ではありませんが、小さなプッシュでもバッファ全体が割り当てられるため、メモリ消費量が大幅に増加する可能性があります。
>
>\- [Git - git-config Documentation](https://git-scm.com/docs/git-config#Documentation/git-config.txt-httppostBuffer) 

結局のところ、「デカいファイルを一度にコミットしようとするな」ということかもしれない。コミットはひとつずつ、ひとつずつ。