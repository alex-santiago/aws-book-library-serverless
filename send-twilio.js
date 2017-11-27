'use strict';
const AWS = require('aws-sdk'); 
const vars = require('./vars');

// Twilio Credentials
const accountSid = vars.accountSid();
const authToken = vars.authToken(); 

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

// send sms function
module.exports.sendsms = (method, bookid) => {
    const params = {
        to: vars.to(),
        from: vars.from(), 
        body: 'Method: ' + method + ' executed for bookid: ' + bookid,
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
