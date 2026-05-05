---
created: 2026-05-01
modified: 2026-05-01
tags:
  - 📝
aliases:
parents:
title:
---
- 結論
	- TaskWarrior使いたければ、新しいMacbook買え

## `homebrew`でインストールする
- `homebrew install task`
	- コンパイルがうまくいかなかった
		- 容量が足りないらしい
			- ビルドで中間ファイルが多く生成されてしまう
	- 泣く泣く（？）iPhoneのバックアップデータ約30GBぶんを削除
		- 容量128GBのMacBook Airにはカツカツだった

- MacOSが古いせいで注意書きが出る
	- 平たく言えばMacPorts使え
	- バイナリファイル（bottle）用意してるのがSonomaしかねえ
		- [task — Homebrew Formulae](https://formulae.brew.sh/formula/task)
		- 今のMacbookはもう全部Apple Siliconなのか
> Warning: You are using macOS 12.
> We (and Apple) do not provide support for this old version.
> You may have better luck with MacPorts which supports older versions of macOS:
> https://www.macports.org

- バイナリファイルがない場合、Cmakeによるビルドが必要らしい
	- 結局古いMacOSでhomebrewでインストールする場合、ビルドは避けられないらしい
	- このビルドに数時間かかってる
		- `rust`と依存性のある`llvm`がめちゃくちゃ重たいらしい
		- 動いてるかどうかわからん 
	- とりあえず、ビルドがどうなるかで様子を見る

## MacPortsでインストールしようとして挫折
- `sudo port install task`
	- `gnutls`のインストールでうまくいかない
	- 何やってもダメそう
		- `sudo port install gnutls`→ダメ
		- `sudo port install gnutls configure.cflags="-Wno-error"`→ダメ
```
sudo port install gnutls configure.cflags="-Wno-error" 
---> Upgrading already installed dependencies of gnutls 
---> Computing dependencies for gnutls 
---> Fetching archive for gnutls
Attempting to fetch https://packages.macports.org/gnutls/gnutls-3.8.13_0.darwin_21.x86_64.tbz2 
Attempting to fetch https://kmq.jp.packages.macports.org/gnutls/gnutls-3.8.13_0.darwin_21.x86_64.tbz2 
Attempting to fetch http://jog.id.packages.macports.org/macports/packages/gnutls/gnutls-3.8.13_0.darwin_21.x86_64.tbz2 
---> Building gnutls Error: Failed to build gnutls: command execution failed 
Error: See /opt/local/var/macports/logs/_opt_local_var_macports_sources_rsync.macports.org_macports_release_tarballs_ports_devel_gnutls/gnutls/main.log for details. 
Error: Follow https://guide.macports.org/#project.tickets if you believe there is a bug.
Error: Processing of port gnutls failed
```