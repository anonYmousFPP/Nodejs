const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// CRUD Routes
router.get('/items', itemController.getAllItems);
router.get('/items/:id', itemController.getItem);
router.post('/items', itemController.createItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;