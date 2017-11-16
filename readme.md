# Library api deployed to AWS using serverless

An AWS api that inserts books into a dynamoDb table. The api is deployed using the [serverless](https://serverless.com/) framework.

## Basic operations:

1. Submit book - receives a .json:
	
	```.json
	{
	  "bookauthor" : "Author Name",
	  "bookgenre" : " Book genre",
	  "booktitle" : "Book title" 
	} 
	```

2. List all books - returns a .json with book information

3. List a book by id - receives the book id to list

4. Delete a book by id - receives the book id to delete



