const express = require('express');

const app = express();
const port = 3000; //The server will run on port 3000

app.use(express.json());

var MongoClient = require('mongodb').MongoClient

app.post('/', (req, res) => {

    let criteria = {};

    //Get the filter criteria from request body
    criteria.startDate   =   req.body.startDate;
    criteria.endDate     =   req.body.endDate;
    criteria.minCount    =   req.body.minCount;
    criteria.maxCount    =   req.body.maxCount;

    MongoClient.connect('mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study', function (err, client) {
        if (err) throw err;

        var db = client.db('getir-case-study');

        db.collection('records').find(
            {
                createdAt: {
                    //createdAt field of the record should be greater than the specified start date
                    $gt: new Date(criteria.startDate),

                    //createdAt field of the record should be less than the specified end date
                    $lt: new Date(criteria.endDate)}
            }
        ).toArray(function (err, result) {
            if (err) throw err;

            let code    =   0;

            let totalCount;

            //Array to store record objects that match the criteria
            let data    =   [];

            if (result.length>0){
                //The case where records withing specified date range are found
                result.map((record)=>{
                    //Sum of the values in the counts array of the record
                    totalCount  =   record.counts.reduce((a, b) => a + b, 0);

                    //Check if the sum is between the specified limits
                    if (totalCount > criteria.minCount && totalCount < criteria.maxCount){
                        //Create the record object with necessary members and push it in the records array of the response
                        data.push(
                            {
                                key: record.key,
                                createdAt: record.createdAt,
                                totalCount: totalCount
                            }
                        );
                    }
                });
            }else{
                //The case where records withing specified date range are NOT found
                code    =   1;
            }

            //The case where records withing specified count range are NOT found
            if (code===0 && data.length===0)  code    =   2;

            let message;
            //Set the message depending on the code
            switch (code) {
                case 0:
                    message =   "Success";
                    break;
                case 1:
                    message =   "No records within specified date range";
                    break;
                case 2:
                    message =   "No records within specified count range";
                    break;
            }

            //Create the response body with the code, message and actual data
            let responseBody    =   {
                code: code,
                msg: message,
                records: data
            };

            res.json(responseBody);

        });
    });
});

app.listen(port, () => console.log(`Application listening on port ${port}!`));