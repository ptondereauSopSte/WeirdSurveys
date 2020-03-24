var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID
router.use(bodyParser.json());
var mongoose = require('mongoose');

router.get('/', function (req, res) {
    console.log("Request /surveys/")
    db.collection('Surveys').find().toArray(function(err, results) {
        console.log("found "+results.length+" surveys")
        res.json(results);
    })
});

router.post('/post', function (req, res) {
    console.log("Request /surveys/post");
    db.collection('Surveys').insertOne(req.body);
    res.send(req.body);
});


module.exports = router;