const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsers)
router.get('/id/:id', userController.getUserByID)
router.get('/email/:email', userController.getUsersByEmail)

module.exports = router;