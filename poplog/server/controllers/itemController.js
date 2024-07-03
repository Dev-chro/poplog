const Item = require('../models/Item');
const User = require('../models/User');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        const userItems = req.user.items.reduce((acc, item) => {
            acc[item.classificationNumber] = item;
            return acc;
        }, {});

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

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send('Error fetching items');
    }
};

exports.updateItem = async (req, res) => {
    const { classificationNumber } = req.params;
    const { value, lastUpdated } = req.body;

    try {
        const user = req.user;
        const itemIndex = user.items.findIndex(item => item.classificationNumber === parseInt(classificationNumber));
        if (itemIndex > -1) {
            user.items[itemIndex].value = value;
            user.items[itemIndex].lastUpdated = lastUpdated;
        } else {
            user.items.push({ classificationNumber: parseInt(classificationNumber), value, lastUpdated });
        }

        await user.save();
        res.status(200).send('Item updated');
    } catch (error) {
        res.status(500).send('Error updating item');
    }
};
