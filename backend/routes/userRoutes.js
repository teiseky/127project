const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/late-fees', userController.getLateFees);
router.get('/:id', userController.getUserById);

module.exports = router;
