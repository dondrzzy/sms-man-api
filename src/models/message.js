const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const messageScheme = mongoose.Schema({
  sender: { type:mongoose.Schema.Types.ObjectId, ref:'Contact' },
  receiver: { type:mongoose.Schema.Types.ObjectId, ref:'Contact' },
  text: { type: String, required: true },
  status: { type: String, enum:['sent', 'recieved'], default:'sent' },
  createdAt:{ type:Date, default:Date.now() },
});

module.exports = mongoose.model('Contact', ContactSchema);
