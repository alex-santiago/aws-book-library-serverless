'use strict';
const AWS = require('aws-sdk'); 
const vars = require('./vars');

// Twilio Credentials
const accountSid = vars.accountSid(); //'AC2d1f7df5b2bc7aee939c7ef7d18bb39f';
const authToken = vars.authToken(); //'776572943bd915ed52be62f3514ab931';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

// send sms function
module.exports.sendsms = (method, bookid) => {
    const params = {
        to: vars.to(), //'+12367778191',
        from: vars.from(), //'+16043052913',
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
