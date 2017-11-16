# Library api deployed to AWS using serverless

A AWS api that inserts books into a dynamoDb table. The api is deployed using serverless.

## Basic operations:

1. Submit book - receives a .json:
	
	```
	{
	  "bookauthor" : "Author Name",
	  "bookgenre" : " Book genre",
    "booktitle" : "Book title" 
	} 
	```.json

2. List all books - returns a .json with book information

3. List a book by id - receives the book id to list

4. Delete a book by id - receives the book id to delete



