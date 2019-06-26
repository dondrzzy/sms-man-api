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

describe('Contact API routes', () => {

  beforeEach(async () => {
    // clear temporary store before each test runs
    await mockgoose.helper.reset()
    const db = mongoose.connection
    db.modelNames().map(async (model) => {
      await db.models[model].createIndexes();
    });
  });

  const userData = {
    firstName: "peter",
    lastName: "parker",
    phoneNumber: '0711111111',
    password: "#peter@1111"
  };

  const createContact = (data) => {
    return request(app).post('/api/v1/contacts').send(data);
  }

  const loginUser = async () => {
    await createContact(userData);
    const res = await request(app).post('/api/v1/contacts/login')
      .send({phoneNumber: userData.phoneNumber, password: userData.password})
    return res.body;

  }

  describe('Get contacts', () => {
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

  describe('Create contact', () => {
    it('should error if missing required contact attributes', (done) => {
      createContact({})
        .end((err, res) =>  {
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
      userData.phoneNumber = '0711111113';
      createContact(userData)
        .expect(201)
        .end(done);
    });

    it('should error if phone number already exists', (done) => {
      request(app)
        .post('/api/v1/contacts')
        .send(userData)
        .end((err, res) => {
          request(app)
            .post('/api/v1/contacts')
            .send(userData)
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.error).to.be.equal('Phone number already exists');
              done();
            });
        })
    })
  });

  describe('Authenticate contact', () => {
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
    });

    it('should error if phone number is not registered', (done) => {
      request(app)
        .post('/api/v1/contacts/login')
        .send({
          phoneNumber: '0702111111',
          password: '#user@1234'
        })
        .end((err, res) => {
          expect(res.body.error).to.equal('Contact not found');
          done();
        })
    });

    it('should validate contact password', async () => {
      await createContact(userData);
      const res = await request(app).post('/api/v1/contacts/login')
        .send({phoneNumber: userData.phoneNumber, password: 'axaxax'});
      expect(res.body.error).to.equal('Wrong password provided');
    });

    it('should generate vaild token if right credentials are provided',  async () => {
      expect(await loginUser()).to.have.all.keys('token');
    });
  });

  describe('Detele contact', () => {
    // it('should validate token on deleting contact', async () => {
    //   const res = await request(app).delete('/api/v1/contacts/5d10b7423cb18e187fecb215')
    //   expect(res.body.error).to.equal('No token provided');
    // });
    it('should error of contact is not found', async () => {
      let res = await loginUser();
      const token = res.token;
      res = await request(app).delete('/api/v1/contacts/5d10b7423cb18e187fecb215')
        .set('token-x', token)
        expect(res.body.error).to.equal('Contact not found');
      });

    it('should successfully delete contact is authenticated owner deletes', async () => {
      let res = await loginUser();
      const token = res.token;
      res = await request(app).get('/api/v1/contacts');
      const contact = res.body.contacts[0];
      res = await request(app).delete('/api/v1/contacts/'+contact._id)
        .set('token-x', token)
      expect(res.body.message).to.equal('Contact successfully deleted');
    });
  })
});
