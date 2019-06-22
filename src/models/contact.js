const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let validname = function(name){
  if(!name){ return false; }
  else {
    const regExp = new RegExp(/^[a-zA-Z]+$/);
    return regExp.test(username);
  }
}

let validPhone = function(phone){
  if(!phone){ return false; }
  else {
    const regExp = new RegExp(/^\d{9}$/);
    return regExp.test(phone);
  }
};

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

const ContactSchema = mongoose.Schema({
  firstName:{type:String, required:true, validate:firstNameValidators}, 
  lastName:{type:String, required:true, validate:lastNameValidators},
  phoneNumber:{type:String, required:true, unique:true, validate:phoneValidators},
});

module.exports = mongoose.model('Contact', ContactSchema);
