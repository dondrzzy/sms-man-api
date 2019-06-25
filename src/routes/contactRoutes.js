const express = require('express');
const contactRouter = express.Router();
const contactsController = require('../controllers/contactsController');

contactRouter.get('/', contactsController.getAllContacts);
contactRouter.get('/:id', contactsController.getContactById);
contactRouter.post('/', contactsController.registerContact);
contactRouter.post('/login', contactsController.loginContact);
contactRouter.delete('/:id', contactsController.deleteContact);

module.exports = contactRouter;
