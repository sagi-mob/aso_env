var express = require("express"),
functions = require("../functions"),
request = require("request"),
app = express();

var router = express.Router();

// =====================
// API Link Creator
// =====================

var getAPIresponse = function(url, cb) {
    var request = require('request');
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            // console.log(body); // WORKS PERFECTLY
        } else {
            console.log("Error: "+ error);
        }
        cb(error, body);
    });
};

router.get('/', function (req, res) {
    var URL = "https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
    var body =  getAPIresponse(URL, function(err, body) {
    // This is run in a callback once the request is done.    
    var apps = functions.sortAppByOS(JSON.parse(body));
      res.render("API/index",{apps:apps}); 
    });
});




module.exports = router;