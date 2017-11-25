'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

// twilio process #############
// Twilio Credentials
const accountSid = process.env.ACCOUNTSID; 
const authToken = process.env.AUTHTOKEN; 

// AWS.config.setPromisesDependency(require('twilio')(accountSid, authToken));

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

// send sms function
const sendsms = (method, bookauthor) => {
  const params = {
      to: process.env.MY_PHONE, 
      from: process.env.TWILLIO_PHONE, 
      body: 'Method: ' + method + ' executed. Add book for author: ' + bookauthor,
    };

  client.messages
  .create(params)
  .then(result => console.log(result.sid))
  .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t send message.'));
      return;
  });
};

// twilio process END #############

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// submit books
module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const booktitle = requestBody.booktitle;
  const bookauthor = requestBody.bookauthor;
  const bookgenre = requestBody.bookgenre;

  if (typeof booktitle !== 'string' || typeof bookauthor !== 'string' || typeof bookgenre !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit book because of validation errors.'));
    return;
  }

  submitbookP(bookInfo(booktitle, bookauthor, bookgenre))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted book with bookauthor ${bookauthor}`,
          bookId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit book with bookauthor ${bookauthor}`
        })
      })
    });
  console.log('Sending sms'); 
  sendsms('Submit book', bookauthor);
};


const submitbookP = book => {
  console.log('Submitting book');
  const bookInfo = {
    TableName: process.env.BOOK_TABLE,
    Item: book,
  };
  return dynamoDb.put(bookInfo).promise()
    .then(res => book);
};

const bookInfo = (booktitle, bookauthor, bookgenre) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    booktitle: booktitle,
    bookauthor: bookauthor,
    bookgenre: bookgenre,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

