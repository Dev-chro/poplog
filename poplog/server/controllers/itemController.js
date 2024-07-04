const Item = require('../models/Item'); // Itemモデルをインポート
const User = require('../models/User'); // Userモデルをインポート

// 項目を取得する機能の実装
exports.getItems = async (req, res) => {
    try {
        // データベースから全ての項目を取得
        const items = await Item.find();
        
        // ユーザーの所有する項目をオブジェクトに変換
        const userItems = req.user.items.reduce((acc, item) => {
            acc[item.classificationNumber] = item;
            return acc;
        }, {});

        // サーバーから取得した項目とユーザーの所有する項目をマージ
        const response = items.map(item => {
            const userItem = userItems[item.classificationNumber] || {};
            return {
                classificationNumber: item.classificationNumber,
                itemName: item.itemName,
                alias: item.alias,
                value: userItem.value || '',
                lastUpdated: userItem.lastUpdated || '',
            };
        });

        res.status(200).json(response); // マージされたデータをJSON形式でレスポンス
    } catch (error) {
        res.status(500).send('Error fetching items'); // エラーレスポンスを送信
    }
};

// 項目を更新する機能の実装
exports.updateItem = async (req, res) => {
    const { classificationNumber } = req.params; // パラメータから分類番号を取得
    const { value, lastUpdated } = req.body; // リクエストボディから値と最終更新日時を取得

    try {
        const user = req.user; // リクエストからユーザー情報を取得
        // ユーザーの項目リストから該当する分類番号の項目を検索
        const itemIndex = user.items.findIndex(item => item.classificationNumber === parseInt(classificationNumber));
        
        if (itemIndex > -1) {
            // 項目が既に存在する場合、値と最終更新日時を更新
            user.items[itemIndex].value = value;
            user.items[itemIndex].lastUpdated = lastUpdated;
        } else {
            // 項目が存在しない場合、新しい項目を追加
            user.items.push({ classificationNumber: parseInt(classificationNumber), value, lastUpdated });
        }

        await user.save(); // ユーザー情報をデータベースに保存
        res.status(200).send('Item updated'); // 更新成功のレスポンスを送信
    } catch (error) {
        res.status(500).send('Error updating item'); // エラーレスポンスを送信
    }
};
