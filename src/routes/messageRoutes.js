const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controllers/messageController');

messageRouter.get('/received', messageController.getReceivedMessages);
messageRouter.get('/received/:id', messageController.getReceivedMessage);
messageRouter.get('/sent', messageController.getSentMessages);
messageRouter.get('/sent/:id', messageController.getSentMessage);
messageRouter.post('/', messageController.sendMessage);
// messageRouter.post('/login', messageController.deleteMessage);

module.exports = messageRouter;