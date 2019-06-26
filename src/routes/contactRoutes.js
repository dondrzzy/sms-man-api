const express = require('express');
const contactRouter = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const contactsController = require('../controllers/contactsController');

contactRouter.get('/', contactsController.getAllContacts);
contactRouter.get('/:id', contactsController.getContactById);
contactRouter.post('/', contactsController.registerContact);
contactRouter.post('/login', contactsController.loginContact);
contactRouter.use(function(req, res, next){
  const token = req.headers['token-x'];
  if(!token){
      res.status(400).json({error:'No token provided'});
  }else{
    jwt.verify(token, config.secret, function(err, decoded){
      if (err) {
        res.status(400).json({token: false, error:'token Invalid: '+err});}
      else{
        req.decoded = decoded;
        next(); 
      }
    });
  }
});
contactRouter.delete('/:id', contactsController.deleteContact);

module.exports = contactRouter;
