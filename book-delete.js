'use strict';

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
const sendsms = (method, bookid) => {
  const params = {
      to: process.env.MY_PHONE, 
      from: process.env.TWILLIO_PHONE, 
      body: 'Method: ' + method + ' executed. Deleted book with id: ' + bookid,
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

// list one book
module.exports.deletebook = (event, context, callback) => {
  const params = {
    TableName: process.env.BOOK_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify('Book deleted.'),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t delete book.'));
      return;
    });
    
  console.log('Sending sms'); 
  sendsms('Delete book', event.pathParameters.id);
};