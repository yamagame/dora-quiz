# Dora Quiz

[DoraEngine](https://github.com/yamagame/dora-engine)用プレゼンテーションページのソースコードです。
ビルドしたファイルを DoraEngine の public フォルダに配置します。[create-react-app](https://github.com/facebook/create-react-app)を使っています。

## 機能

- 画像表示
- クイズ出題
- クイズ集計
- ２択アンケート、リアルタイム集計
- 簡易メッセージ表示
- 出題者用と参加者用の２種類のページ

## 準備

```
$ npm i
```

## 開発方法

package.json の proxy をドラエンジンが起動しているラズベリーパイのホスト名に変更し、以下のコマンドを実行します。

```
$ npm start
```

## ビルド方法

```
$ npm run build
```

## License

[MIT](LICENSE)
