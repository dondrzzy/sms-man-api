const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Message = require('./message');
mongoose.Promise = global.Promise;

let nameLengthChecker = function(name){
  if(!name){return false}
  else{
    if(name.length<3||name.length>15){
      return false;
    }else{
      return true;
    }
  }
}

let validname = function(name){
  if(!name){ return false; }
  else {
    const regExp = new RegExp(/^[a-zA-Z]+$/);
    return regExp.test(name);
  }
}

let validPhone = function(phone){
  if(!phone){ return false; }
  else {
    const regExp = new RegExp(/^\d{9}$/);
    return regExp.test(phone);
  }
};

let passwordLengthChecker = function(password){
  if(!password){return false}
  else{
      if(password.length<4||password.length>35){
          return false;
      }else{
          return true;
      }
  }
}

let validPassword = function(password) {
  if (!password) {return false;}
  else{
      const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
      return regExp.test(password);
  }
}

const firstNameValidators = [
  { validator:nameLengthChecker, message:'First name must be atleast 3 characters but no more than 15' },
  { validator:validname, message:'First name must not have any special characters' }
];

const lastNameValidators = [
  { validator:nameLengthChecker, message:'Last name must be atleast 3 characters but no more than 15' },
  { validator:validname, message:'Last name must not have any special characters' }
];

const phoneValidators = [
  {validator:validPhone, message:'Phone Number is Invalid'}
];

const passwordValidators = [
  {validator:passwordLengthChecker, message:'password must be atleast 8 characters but no more than 35'},
  {validator:validPassword, message:'Password must have atlease one uppercase, lowercase, special character and number'}
];

const ContactSchema = mongoose.Schema({
  firstName:{type:String, required:true, validate:firstNameValidators}, 
  lastName:{type:String, required:true, validate:lastNameValidators},
  phoneNumber:{type:String, required:true, unique:true, validate:phoneValidators},
  password:{type:String, required:true,  validate:passwordValidators, select:false},
});

//Encrypt passwords before storing them in the database
ContactSchema.pre('save', function(next){
  var contact = this;
  console.log('contact: ', this.password);
  if(!this.isModified('password')) return next();
  bcrypt.hash(this.password, null, null, function(err, hash){
      if(err) return next(err);
      contact.password = hash;
      next();  
  });
  
});

ContactSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

ContactSchema.pre('remove', async function(next) {
  await Message.deleteMany({ sender: this._id });
  await Message.updateMany({ receiver: this._id }, { receiver: null });
  next();
});

module.exports = mongoose.model('Contact', ContactSchema);
