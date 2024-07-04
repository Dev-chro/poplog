const jwt = require('jsonwebtoken'); // JWTトークンの生成と検証を行うためのjsonwebtokenライブラリをインポート
const User = require('../models/User'); // Userモデルをインポート
const SECRET_KEY = "your_secret_key"; // JWTの秘密鍵を定義

// 認証ミドルウェアの実装
const authMiddleware = async (req, res, next) => {
    try {
        // リクエストヘッダーからトークンを取得
        const token = req.headers.authorization.split(' ')[1];
        
        // トークンを検証し、デコードされたペイロードを取得
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // デコードされたユーザーIDを使用してユーザー情報をデータベースから取得し、リクエストオブジェクトに追加
        req.user = await User.findById(decoded.userId);
        
        // 次のミドルウェアまたはルートハンドラーに制御を渡す
        next();
    } catch (error) {
        // トークンの検証が失敗した場合、認証エラーを返す
        res.status(401).send('Unauthorized');
    }
};

module.exports = authMiddleware; // ミドルウェアをエクスポート
