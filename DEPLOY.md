# GitHub Pagesへのデプロイ手順

このガイドでは、推し活トークテーマアプリをGitHub Pagesにデプロイする方法を説明します。

## 📋 前提条件

- GitHubアカウント（無料）
- Gitがインストール済み（または GitHub Desktop を使用）

---

## 🚀 デプロイ手順

### 方法1: GitHub Desktopを使用（簡単・推奨）

#### Step 1: GitHub Desktopをインストール

1. [GitHub Desktop](https://desktop.github.com/) をダウンロードしてインストール
2. GitHubアカウントでサインイン

#### Step 2: リポジトリを作成

1. GitHub Desktopを開く
2. `File` → `New repository...`
3. 以下を入力：
   - **Name**: `oshikatsu-talk-app`
   - **Local path**: `c:\Users\kimi4\`（既存フォルダを選択）
   - **Initialize this repository with a README**: チェックを外す
4. `Create repository` をクリック

#### Step 3: ファイルをコミット

1. 左側に変更されたファイル一覧が表示される
2. 下部の Summary に「Initial commit」と入力
3. `Commit to main` をクリック

#### Step 4: GitHubにプッシュ

1. 上部の `Publish repository` をクリック
2. **Keep this code private** のチェックを外す（公開アプリの場合）
3. `Publish repository` をクリック

#### Step 5: GitHub Pagesを有効化

1. ブラウザで GitHub.com にアクセス
2. リポジトリ `oshikatsu-talk-app` を開く
3. `Settings` タブをクリック
4. 左メニューから `Pages` を選択
5. **Source** で `Deploy from a branch` を選択
6. **Branch** で `main` を選択、フォルダは `/ (root)` を選択
7. `Save` をクリック

#### Step 6: デプロイ完了を待つ

- 数分待つとデプロイが完了
- `https://<あなたのユーザー名>.github.io/oshikatsu-talk-app/` でアクセス可能

---

### 方法2: Git コマンドを使用

```bash
# 1. プロジェクトフォルダに移動
cd c:\Users\kimi4\oshikatsu-talk-app

# 2. Gitリポジトリを初期化
git init

# 3. すべてのファイルを追加
git add .

# 4. コミット
git commit -m "Initial commit: 推し活トークテーマアプリ"

# 5. GitHubでリポジトリを作成後、リモートを追加
git remote add origin https://github.com/<あなたのユーザー名>/oshikatsu-talk-app.git

# 6. プッシュ
git branch -M main
git push -u origin main
```

その後、GitHub.com でリポジトリの Settings → Pages で有効化

---

## 🌐 公開URLの確認

デプロイが完了すると、以下のURLでアクセス可能：

```
https://<あなたのユーザー名>.github.io/oshikatsu-talk-app/
```

このURLを：
- スマートフォンのブラウザで開く
- 友達とシェア
- PWAとしてホーム画面に追加

---

## 📱 スマートフォンでの確認

1. スマートフォンのブラウザで公開URLにアクセス
2. **iOS (Safari)**:
   - 共有ボタン → 「ホーム画面に追加」
3. **Android (Chrome)**:
   - メニュー → 「ホーム画面に追加」

---

## 🔄 アプリの更新方法

ファイルを変更した後：

### GitHub Desktopの場合

1. 変更が自動的に検出される
2. Summary に変更内容を入力（例：「質問を追加」）
3. `Commit to main` をクリック
4. 上部の `Push origin` をクリック
5. 数分でGitHub Pagesに反映

### Git コマンドの場合

```bash
git add .
git commit -m "質問を追加"
git push
```

---

## ⚠️ トラブルシューティング

### デプロイ後404エラーが出る

- GitHub Pagesの設定でブランチが `main` で `/` (root) になっているか確認
- 数分待ってから再度アクセス

### ファイルが更新されない

- ブラウザのキャッシュをクリア
- シークレットモードで確認

### Service Workerが古いバージョンをキャッシュ

`sw.js` の `CACHE_NAME` を変更：
```javascript
const CACHE_NAME = 'oshikatsu-talk-v2'; // バージョン番号を上げる
```

---

## 🎉 完了！

これでスマートフォンからいつでもアクセス可能になりました！

**公開URL**: `https://<あなたのユーザー名>.github.io/oshikatsu-talk-app/`
