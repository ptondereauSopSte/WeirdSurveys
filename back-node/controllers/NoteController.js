var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID
router.use(bodyParser.json());
var mongoose = require('mongoose');

/*

Exemples

router.get('/', function (req, res) {
    console.log("Request /Notes/")
    db.collection('Notes').find().toArray(function(err, results) {
        console.log("found "+results.length+" results")
        res.json(results);
    })
});

router.post('/post', function (req, res) {
    console.log("Request /notes/post");
    db.collection('Notes').insertOne(req.body);
    res.send(req.body);
});

*/

module.exports = router;