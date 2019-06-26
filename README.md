[![Build Status](https://travis-ci.com/dondrzzy/sms-man-api.svg?branch=master)](https://travis-ci.com/dondrzzy/sms-man-api)
[![Coverage Status](https://coveralls.io/repos/github/dondrzzy/sms-man-api/badge.svg?branch=master)](https://coveralls.io/github/dondrzzy/sms-man-api?branch=master)


# Sms-Man-Api
This is an SMS management API that enables users to register their contacts, send and receive messages.


>Application UI

The application API is live [here](https://sms-man-api.herokuapp.com).This is a `node express` API.

> Pivotal Tracker with user stories

The user stories for the project are [here](https://www.pivotaltracker.com/n/projects/2356157).

## requirements

- [Node (stable)](https://nodejs.org/en/)

- [MongoDB](https://www.mongodb.com/)

- [Postman](https://www.getpostman.com/)



## Installation and setup

1. Clone the repository.

```
git clone git@github.com:dondrzzy/sms-man-api.git
```

2. cd into the application

```
cd <application folder>
```

3. Install the application dependencies

```
npm install
```

4. Set up some environment variables

```
Create a .env file at the root of the application and add the following env variables
- DB_NAME
- DB_URI=
- NODE_ENV=development  # leave as development for development environment and testing for testing environment
- SECRET_KEY
```

5. Start you mongodb service, in your terminal run

```
mongod
```

6. Spin up the server with

```
npm start or install nodemon with npm i nodemon and run nodemon
```

7. Use postman or anyother REST API tool to make API calls.


## Main API features

- can register contact.
- can get all contacts
- can login contact
- can delete contact --  this inturn deletes all messages sent by the contact
- can send message to another contact
- can view sent messages
- can view sent message
- can view received messages
- can view received message


## End points

| Endpoint                 | payload              | headers     | Method |
| -------------------------| -------------------- | ----------- | ------ |
| `/api/v1/contacts`       | [Contact](#Contact)  | [header1](header1) | `POST` |
| `/api/v1/contacts`       |                      |             | `GET`  |
| `/api/v1/contacts/login` | [loginPayload](loginPayload)  | [header1](header1) | `POST` |
| `/api/v1/contacts/contactId` |           | [header2](header2) | `DELETE` |
| `/api/v1/messages` | [messagePayload](messagePayload)  | [header2](header2) | `POST` |
| `/api/v1/messages/received` |            | [header2](header2) | `GET` |
| `/api/v1/messages/received/messageId` |            | [header2](header2) | `GET` |
| `/api/v1/messages/sent` |            | [header2](header2) | `GET` |
| `/api/v1/messages/sent/messageId` |            | [header2](header2) | `GET` |


## API samples

#### header1

```
- Application/json
```

#### header2

```
- Application/json
- token-x
```

#### Contact

```
{
    "firstName": "peter",
	"lastName": "parker",
	"phoneNumber": "0711111113",
	"password": "#peter@1234"
}

```

#### Message 

```
{
    "status": "sent",
    "createdAt": "2019-06-26T14:21:08.283Z",
    "_id": "5d137f787b193c24b322aa77",
    "sender": "5d137f567b193c24b322aa75",
    "receiver": "5d120c7dd37b6a3a25d1a1ad",
    "text": "hey yah!!!",
}
```

#### loginPayload

```

{
	"phoneNumber": "711111112",
	"password": "#user@1234"
}

```

#### messagePayload

```
{
	"receiver": "711111112",
	"text": "hey yah!!!"
}
```
