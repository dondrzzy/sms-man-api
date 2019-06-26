const expect = require('chai').expect;
const request = require('supertest');
var mongoose = require('mongoose')
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  process.env.NODE_ENV = 'testing';
}

const conn = require('../../../config/database');
const app = require('../../../app');

describe('Messages API routes', () => {

  beforeEach(async () => {
    // clear temporary store before each test runs
    await mockgoose.helper.reset()
    const db = mongoose.connection
    db.modelNames().map(async (model) => {
      await db.models[model].createIndexes();
    });
  });
  const john = {
    firstName: "john",
    lastName: "doe",
    phoneNumber: '0711111112',
    password: "#john@1111"
  }

  const peter = {
    firstName: "peter",
    lastName: "parker",
    phoneNumber: '0711111111',
    password: "#peter@1111"
  };

  const createContact = (data) => {
    return request(app).post('/api/v1/contacts').send(data);
  }

  const loginUser = async (phoneNumber='', password='') => {
    await createContact(peter);
    const res = await request(app).post('/api/v1/contacts/login')
      .send({
        phoneNumber: phoneNumber ? phoneNumber: peter.phoneNumber,
        password: password ? password : peter.password
      })
    return res.body;
  }

  const sendMessage = async (text, receiver, token) => {
    return await request(app).post('/api/v1/messages')
      .send({text, receiver})
      .set('token-x', token)
  }

  const getReceivedMessages = async (token) => {
    return await request(app).get('/api/v1/messages/received')
      .set('token-x', token)
  }

  const getReceivedMessage = async (token, id) => {
    return await request(app).get('/api/v1/messages/received/'+id)
      .set('token-x', token)
  }

  const getSentMessages = async (token) => {
    return await request(app).get('/api/v1/messages/sent')
      .set('token-x', token)
  }

  describe('Get messages', () => {
    it('should error if not authenticated', async () => {
      const res = await request(app).get('/api/v1/messages');
      expect(res.body.error).to.equal('No token provided');
    });

    it('should return contact messages if authenticated', async () => {
      // create another contact to receive message - john
      await createContact(john);
      
      // login default parker user to send message to john
      let loginRes = await loginUser();

      const text = 'hey there!';
      const receiver = '0711111112'

      // send message to john
      await sendMessage(text, receiver, loginRes.token)

      // login john to check message
      _loginRes = await loginUser(john.phoneNumber, john.password);
      const res = await getReceivedMessages(_loginRes.token);
      expect(res.body.messages.length).to.be.greaterThan(0);
    });
  });

  describe('Get message', () => {
    it('should error if id is unknown', async () => {
      let loginRes = await loginUser();
      const res = await getReceivedMessage(_loginRes.token, '5d10b7423cb18e187fecb215');
      expect(res.body.error).to.equal('Message not found');
    });

    it('should return contact message if authenticated', async () => {
      // create another contact to receive message - john
      await createContact(john);
      
      // login default parker user to send message to john
      let loginRes = await loginUser();

      const text = 'hey there again!';
      const receiver = '0711111112'

      // send message to john
      const msgRes = await sendMessage(text, receiver, loginRes.token)

      // login john to check message
      _loginRes = await loginUser(john.phoneNumber, john.password);
      const res = await getReceivedMessage(_loginRes.token, msgRes.body.message._id);
      expect(res.body.message.text).to.equal(text);
    });
  })

});