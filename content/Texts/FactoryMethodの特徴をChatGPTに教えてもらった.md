---
created: 2023-07-29
modified: 2024-08-01
tags: []
aliases: []
---
「Factory Method（ファクトリーメソッド）」は、プログラムのデザインパターンの一つであり、オブジェクトの生成を行うメソッドを専用のクラスに委任することで、柔軟性を持ったオブジェクトの生成を可能にする手法です。初学者にもわかりやすく説明するため、以下の例を通じて具体的に説明します。

例えば、あなたがゲームを開発していて、異なるキャラクターを作成する必要があるとします。各キャラクターは共通のインターフェース（たとえば、"Character" クラス）を持ち、キャラクターの種類ごとに異なるクラス（例えば、"Warrior" クラス、"Wizard" クラス、"Archer" クラスなど）が存在します。

通常の方法でキャラクターオブジェクトを作成すると、以下のようなコードになるでしょう：

```python
class Character:
    def attack(self):
        pass

class Warrior(Character):
    def attack(self):
        print("Warrior attacks with a sword!")

class Wizard(Character):
    def attack(self):
        print("Wizard casts a spell!")

class Archer(Character):
    def attack(self):
        print("Archer shoots an arrow!")

# ゲーム内でキャラクターを生成する
warrior = Warrior()
wizard = Wizard()
archer = Archer()

# 各キャラクターの攻撃メソッドを呼び出す
warrior.attack()
wizard.attack()
archer.attack()
```

しかし、もしゲーム内で新しいキャラクターを追加する場合、毎回クラスを追加して上記のコードを修正する必要があります。ここで、「Factory Method」を使うと、より柔軟にキャラクターオブジェクトを生成できます。

「Factory Method」を適用した例を示します：

```python
class Character:
    def attack(self):
        pass

class Warrior(Character):
    def attack(self):
        print("Warrior attacks with a sword!")

class Wizard(Character):
    def attack(self):
        print("Wizard casts a spell!")

class Archer(Character):
    def attack(self):
        print("Archer shoots an arrow!")

class CharacterFactory:
    def create_character(self, character_type):
        if character_type == "Warrior":
            return Warrior()
        elif character_type == "Wizard":
            return Wizard()
        elif character_type == "Archer":
            return Archer()
        else:
            raise ValueError("Invalid character type!")

# ゲーム内でキャラクターを生成する
factory = CharacterFactory()
warrior = factory.create_character("Warrior")
wizard = factory.create_character("Wizard")
archer = factory.create_character("Archer")

# 各キャラクターの攻撃メソッドを呼び出す
warrior.attack()
wizard.attack()
archer.attack()
```

ここで `CharacterFactory` クラスがFactory Methodを持ちます。このクラスの `create_character` メソッドを使って、新しいキャラクターを生成できるようになりました。新しいキャラクターを追加する場合も、`CharacterFactory` クラスの内部を修正するだけで済むため、ゲームの拡張が容易になります。

「Factory Method」は、オブジェクトの生成を別のクラスに委譲することで、プログラムの拡張性や保守性を向上させるデザインパターンです。初学者の段階では難しく感じるかもしれませんが、上記の例をよく理解し、実際の開発シナリオで活用することでその有用性を理解することができるでしょう。

---
*前者のコードから後者のコードにすることで何が得するのか私にはわかりません。後者のコードの利点を詳しく教えてください。*
___
後者のコード（Factory Methodを使用したコード）の利点を詳しく説明します：

1. 拡張性と柔軟性: 新しいキャラクターを追加する場合、新しいクラスを作成し、それを`CharacterFactory`クラスの`create_character`メソッドに追加するだけで済みます。既存のコードを修正する必要がなく、システム全体に影響を及ぼすリスクが低くなります。これにより、ゲームの拡張が容易になります。
2. カプセル化: キャラクターオブジェクトの生成ロジックを`CharacterFactory`クラスに隠蔽しています。他の部分のコードからは、具体的なキャラクタークラスがどのように生成されるかを気にする必要がありません。これにより、コードの見通しが良くなります。
3. コードの重複排除: 通常の方法では、各箇所でキャラクターオブジェクトを生成するためのコードが重複しています。それに対して、Factory Methodを使用することで、キャラクターの生成ロジックを一箇所にまとめることができます。これにより、コードの重複を排除し、メンテナンスが容易になります。
4. テスト容易性: Factory Methodを使うと、キャラクターの生成ロジックが一箇所に集約されるため、ユニットテストなどのテストが簡単になります。新しいキャラクターを追加する際も、そのキャラクターのクラス自体のテストに集中することができます。
5. 疎結合: 後者のコードでは、クライアントコード（キャラクターを生成するコード）が具体的なキャラクタークラスと直接的に結びついていません。代わりに、`CharacterFactory`クラスを介してキャラクターの生成を行っています。これにより、クライアントコードとキャラクタークラスの間の依存関係が疎結合になります。疎結合な設計は、システム全体の保守性や拡張性を向上させます。

これらの利点により、Factory Methodを使用したコードは、新しい機能の追加や既存の機能の変更に対して堅牢で柔軟な設計を提供します。また、チームでの開発においても、役割分担を明確にしやすくなります。デザインパターンは初めは抽象的に感じられることもありますが、実際にプロジェクトに適用することでその価値を理解しやすくなるでしょう。

>[!info]
>クラス生成処理をクライアント側ではなく、ファクトリーメソッド側で一挙にまとめられる、というのが利点と受け取った。
>たとえば、`Warrior`クラス生成が複数のクライアントにあると、`Warrior`クラスの名称変更を各クライアントコード内でやる必要が出てくるが、ファクトリーメソッドが一手に引き受けていると、その一か所を変えるだけでOKになる。