const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, itemController.getItems);
router.put('/:classificationNumber', authMiddleware, itemController.updateItem);

module.exports = router;
