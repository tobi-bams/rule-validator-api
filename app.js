const express = require('express');
const bodyParser = require('body-parser');
const validator = require('./validator');


const app = express();

app.use(bodyParser.json());

app.post('/validate-rule', (req, res, next) => {
    const receivedData = validator(req.body);
   res.status(receivedData.status).json(receivedData.mainFeedback);
});

app.use('/', (req, res) => {
    const myData = {
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
          "name": "Oluwatobi Pius Bamidele",
          "github": "@tobi-bams",
          "email": "teebams49@gmail.com",
          "mobile": "08146810457",
          "twitter": "@tobi_bams"
        }
      }
    res.status(200).json(myData);
})

module.exports = app;