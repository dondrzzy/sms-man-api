const Message = require('../models/message');
const Contact = require('../models/contact');

module.exports = {
  getReceivedMessages: (req, res) => {
    Message.
      find({receiver: req.decoded.contactId}).
      populate('sender').
      populate('receiver').
      exec((err, messages) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        return res.status(200).json({messages});
      });
  },
  getReceivedMessage: (req, res) => {
    Message.findOne({_id: req.params.id, receiver:req.decoded.contactId}).
      populate('sender').
      populate('receiver').
      exec((err, message) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        if (!message) {
          return res.status(404).json({error: 'Message not found'});
        }
        return res.status(200).json({message});
      })
  },
  getSentMessages: (req, res) => {
    Message.find({sender: req.decoded.contactId}).
      populate('sender').
      populate('receiver').
      exec((err, messages) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        return res.status(200).json({messages});
      });
  },
  getSentMessage: (req, res) => {
    Message.findOne({_id: req.params.id, sender:req.decoded.contactId}).
      populate('sender').
      populate('receiver').
      exec((err, message) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        if (!message) {
          return res.status(404).json({error: 'Message not found'});
        }
        return res.status(200).json({message});
      });
  },
  sendMessage: (req, res) => {
    if (!req.body.receiver) {
      return res.status(400).json({error: 'receiver is required'});
    }
    if (!req.body.text) {
      return res.status(400).json({error: 'Text is required'});
    }
    Contact.findOne({phoneNumber: req.body.receiver}, (err, receiver) => {
      if (err) {
        return res.status(400).json({error: err})
      }
      if (!receiver) {
        return res.status(400).json({error: 'receiver phone number not found'});
      }
      if (receiver._id.equals(req.decoded.contactId)) {
        return res.status(400).json({error: 'Oops, looks like you are trying to send yourself a message'})
      }
      const message = new Message({
        sender: req.decoded.contactId,
        receiver: receiver._id,
        text: req.body.text,
      });
      message.save((err, message) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        return res.status(201).json({message});
      });
    });
  },
  deleteSentMessage: (req, res) => {
    Message.remove({_id: req.params.id, sender:req.decoded.contactId}).
      populate('sender').
      populate('receiver').
      exec((err, message) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        if (!message) {
          return res.status(404).json({error: 'Message not found'});
        }
        return res.status(200).json({message});
      });
  }
}