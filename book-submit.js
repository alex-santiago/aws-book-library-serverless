'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

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

