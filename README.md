# Lance Up

ITエンジニア向けフリーランス相談の集客LPです。無料チェック後にLINEまたはメールで連絡を続けられます。問い合わせ情報をDBへ保存せず、運営者にはSMTPで通知します。

## セットアップ

```bash
npm install
copy .env.example .env.local
npm run dev
```

`.env.local` のSMTP項目と通知先を設定すると、フォームの正常送信時に問い合わせ番号付きの日本語通知メールが送られます。Googleタグは `NEXT_PUBLIC_GOOGLE_TAG_ID` が空でも動作します。

LINE連携では `NEXT_PUBLIC_LINE_OA_ID` に公式アカウントのBasic IDまたはPremium ID（`@`を含む）を設定します。送信完了画面のボタンから、問い合わせ番号と氏名が入力されたLINEトーク画面を開けます。PC版LINEでは公式のURLスキームが動作しないため、主にスマートフォン向けです。`NEXT_PUBLIC_LINE_ADD_FRIEND_URL` は予備の友だち追加URLとして使用します。

## コマンド

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 公開前の確認

- `.env.local` またはホスティング環境へ本番URL、SMTP、通知先、Googleタグ、LINE公式アカウントIDを設定
- `/privacy` と `/terms` の `【...（公開前に置換）】` を実際の運営者情報へ置換
- 実際の通知先でテスト送信し、迷惑メール判定やFromドメイン認証を確認
