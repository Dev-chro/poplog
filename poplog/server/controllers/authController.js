const bcrypt = require('bcryptjs'); // パスワードのハッシュ化を行うためのbcryptライブラリをインポート
const jwt = require('jsonwebtoken'); // JWTトークンの生成と検証を行うためのjsonwebtokenライブラリをインポート
const User = require('../models/User'); // Userモデルをインポート
const SECRET_KEY = "your_secret_key"; // JWTの秘密鍵を定義

// サインアップ（ユーザー登録）機能の実装
exports.signup = async (req, res) => {
    const { username, password } = req.body; // リクエストボディからユーザー名とパスワードを取得
    const hashedPassword = await bcrypt.hash(password, 10); // パスワードをハッシュ化

    try {
        // 新しいユーザーを作成し、データベースに保存
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User created'); // ユーザー作成成功のレスポンスを送信
    } catch (error) {
        res.status(500).send('Error creating user'); // エラーレスポンスを送信
    }
};

// サインイン（ログイン）機能の実装
exports.signin = async (req, res) => {
    const { username, password } = req.body; // リクエストボディからユーザー名とパスワードを取得

    // データベースからユーザーを検索
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found'); // ユーザーが見つからない場合のエラーレスポンス

    // 入力されたパスワードとデータベースに保存されているハッシュ化されたパスワードを比較
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials'); // パスワードが一致しない場合のエラーレスポンス

    // ユーザーIDをペイロードとしてJWTトークンを生成
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token }); // トークンを含む成功レスポンスを送信
};
