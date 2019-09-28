# Single Endpoint RESTful API with Express.js and MongoDB

This is a RESTful API written in Node.js using express framework. 
It serves records data from a MongoDB database with _\_id_ , _key_ , _value_ , _createdAt_ and _counts_ fields. 
It filters the collection using criteria given in request payload in JSON format. 
It returns a JSON response with success code, message and  records array with key, createdAt and totalCount fields. 
totalCount field is the sum of the values in the counts array of the related record.

## Running
Make sure you have Node.js installed. Navigate to the root directory of the project on a terminal or command line. 
There run the command below:

`$ node index.js`

Application will reachable on http://localhost:80 

## Endpoint
Only endpoint of the application is its root endpoint ('/'). 
The endpoint only handles POST requests. 