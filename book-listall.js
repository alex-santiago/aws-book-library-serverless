'use strict';

const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// list all books
module.exports.list = (event, context, callback) => {
    var params = {
        TableName: process.env.BOOK_TABLE,
        ProjectionExpression: "id, booktitle, bookauthor, bookgenre, submittedAt"
    };

    console.log("Scanning book table.");
    const onScan = (err, data) => {

        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    books: data.Items
                })
            });
        }

    };

    dynamoDb.scan(params, onScan);

};