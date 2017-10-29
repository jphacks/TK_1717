# HouseMate
![](https://jphacks.tk/for_github/02.png?time=1)
![](https://jphacks.tk/for_github/03.png)

- デモ動画: https://youtu.be/WWrXkgGdlis
- 発表スライド: https://goo.gl/NRU866

## デモサイト: https://jphacks.tk/
1. 地図上を移動すると現れる青い点をクリックすると募集物件情報が表示される
2. 募集物件の「JOIN CHAT!」をクリックすると、物件ごとのチャットルームにアクセスできる
3. 名前を入力して部屋に入室
    - チャットルームはスマホからの閲覧を想定しています
    - 名前の入力は1度だけ求められます
    - ビデオの権限が求められる場合もあります
4. ビデオやテキストチャットでシャアメイト候補とコミュニケーションをとる
    - ビデオチャットは他の入室者がいる場合のみ利用可能です
    - セキュリティの都合上、デモサイト上ではログは残らないようになっています

## 製品概要
### Lifestyle x Tech
### 製品説明（具体的な製品の説明）
シャアハウスを始めたい人を応援するアプリケーションサービスです。
見やすいマップ上から自分にピッタリの家を選ぶと、同じ家に興味を持った他のユーザーとつながることができます。
ビデオチャット・テキストチャットを通じてコミュニケーションを取ることができ、物件とルームメイトともに妥協のないルームシェア生活を簡単に始められます。

### 背景（製品開発のきっかけ、課題等）
チームメンバーの一人がシェアハウスをしているという話題から、他のチームメンバーも皆シェアハウスに漠然と憧れはあるものの、ハードルの高さに実現していないという問題に気付いたことが製品開発のきっかけです。シェアメイトを探そうとしても、身近に同時期・同エリアに転居したいという人を見つけるのはなかなか容易でなく、さらに折角仲間を見つけて物件を選ぼうとしても、物件によって入居条件や部屋の数などによってさらに様々な制約が生じ、なかなか実現するまで至りません。

唯一シェアハウスをしているチームメンバーも、結局自分で始めるのは諦めてWebで募集していたコンセプトシェアハウスに参加していますが、Web等で募集しているような企業運営のシェアハウスでは賃料などでのシェアメリットが低い場合も多く、そうでないところから先居者との相性や立地・設備などの条件を満たすものを見つけるのは容易ではありません。

こうした「物件探し」「シェアメイト探し」という2つの問題を、逆に1つにまとめてシステムにすることで、シェアハウスのハードルを下げられるのではないかという着想で開発したのが今回の製品です。

### 特長

#### 1. 特長1
マップ上にてピッタリの物件を見つけ、必要情報を見つけることができる。

#### 2. 特長2
ビデオ・テキストチャットにてルームメイトになるかもしれない人と親交を深められる

### 解決出来ること
この製品を利用することでシェアハウス利用への妥協とハードルを下げる事ができる。

### 今後の展望
- ソーシャルログイン連携をして、知人に限定したシェアメイト探しなどもできるようにする
- エリア・物件やシェアメイトに対する希望・条件、個人の趣味関心などから、シェアメイトのレコメンドを行う
- 物件情報から、シェアハウスに有用な情報を抽出して提示する（シェア利用の可非、個室数など）

## 開発内容・開発技術
### 活用した技術
#### API・データ
- LIFULL HOME'S API
- WebRTC

#### フレームワーク・ライブラリ・モジュール
- Sinatra (Ruby)
- Google Map
- SimpleWebRTC: https://github.com/andyet/SimpleWebRTC

### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
個人参加者の初対面チームなので、事前開発や研究背景などはありません。企画から実装まで全てHackDay中に行いました。
