const expect = require('chai').expect;
const request = require('supertest');

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
 
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  process.env.NODE_ENV = 'testing';
}

const conn = require('../../../config/database');
const app = require('../../../app');

describe('contact API routes', () => {

  describe('GET contacts', () => {
    it('should return response with expected keys', (done) => {
      request(app)
        .get('/api/v1/contacts')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.contain.property('contacts');
          done();
        })
    });
  });

  describe('create contact', () => {
    it('should error if missing required contact attributes', (done) => {
      const body = {};
      request(app)
        .post('/api/v1/contacts')
        .send(body)
        .end((err, res) =>  {
          console.log('res: ', Object.keys(res.body.errors))
          expect(res.status).to.equal(400);
          expect(res.body.errors)
            .to.have.all.keys(
              'firstName',
              'lastName',
              'phoneNumber',
              'password'
            );
          done();
        });
    });
    it('should create a new contact', (done) => {
      const body = {
        firstName: "peter",
        lastName: "parker",
        phoneNumber: 711111113,
        password: "#peter@1111"
      };
      request(app)
        .post('/api/v1/contacts')
        .send(body)
        .expect(201)
        .end(done);
    });
    it('should error if phone number already exists', (done) => {
      const body = {
        firstName: "peter",
        lastName: "parker",
        phoneNumber: 711111111,
        password: "#peter@1111"
      };
      request(app)
        .post('/api/v1/contacts')
        .send(body)
        .end((err, res) => {
          request(app)
            .post('/api/v1/contacts')
            .send(body)
            .expect(400)
            .end(done)
        })
    })
  });
  describe('authenticate contact', () => {
    it('should check required body params', (done) => {
      request(app)
        .post('/api/v1/contacts/login')
        .send({})
        .end((err, res) => {
          expect(res.body.errors)
            .to.have.all.keys(
              'phoneNumber',
              'password'
            );
          done();
        })
    })
  })
});
