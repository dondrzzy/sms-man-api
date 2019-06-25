const Contact = require('../models/contact');
const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = {
  getAllContacts: (req, res) => {
    Contact.find((error, contacts) => {
      if (error) {
        return res.status(400).json({error: error});
      }
      res.status(200).json({contacts});
    });
  },
  getContactById: (req, res) => {
    Contact.findById({_id: req.params.token}, (err, contact) => {
      if (err) {
        return res.status(400).json({error: err});
      }
      if (!contact) {
        return res.status(404).json({error: 'Contact not found'});
      }
      res.status(200).json({contact});
    });
  },
  registerContact: (req, res) => {
    if (!req.body.firstName) {
      return res.status(400).json({error: 'Please provide a first name'});
    }
    if (!req.body.lastName) {
      return res.status(400).json({error: 'Please provide a last name'});
    }
    if (!req.body.phoneNumber) {
      return res.status(400).json({error: 'Please provide a phone number'});
    }
    if (!req.body.password) {
      return res.status(400).json({error: 'Please provide a password'});
    }
    var contact = new Contact({
      firstName:req.body.firstName, 
      lastName:req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password
    });
    contact.save(function(err) {
      if (err) {
        const duplicateMsg = 'Phone number already exists';
        res.status(400).json({error: err.code === 11000 ? duplicateMsg : err});
      } else {
        res.status(201).json({'message':'Contact Successfully registered'});
      }
    });     
  },
  loginContact: (req, res) => {
    if(!req.body.phoneNumber){
      return res.status(400).json({error:'You must provide a phone number'});
    }
    if(!req.body.password){
      return res.status(400).json({error:'You must provide a password'});
    }
    Contact.findOne({phoneNumber:req.body.phoneNumber}).select('password').exec(function(err, contact){
      if(err){
        return res.json({error:err});
      }
      if (!contact) {
        res.status(404).json({error:'Contact not found'});
      } else {
        const validPassword = contact.comparePassword(req.body.password);
        if(!validPassword){
          return res.status(400).json({error:'Wrong password provided'});
        }
        const token = jwt.sign({contactId:contact._id}, config.secret, {expiresIn:86400}); 
        res.status(200).json({token:token});                    
      }
    });
  },
  deleteContact: (req, res) => {
    Contact.findOne({_id:req.params.id}, function(err, contact){
      if(err){
        return res.status(400).json({success:false, 'err':err});
      }
      if (!contact) {
        return res.status(404).json({message: 'Contact not found'});
      }
      contact.remove((err, result) => {
        res.status(200).json({messgae: 'Contact successfully deleted'});
      })
    });
  }
}
