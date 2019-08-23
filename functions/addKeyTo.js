var express = require("express"),
    request = require("request"),
    convertFromTo = require("../functions/convertFromTo.js"),
    makeRequests = require('../lib/index'),
    sortKeys = require('../functions/sortingKeywords.js'),
    apiRequestHandler = require('../functions/apiReqeusts.js'),
    app = express();


var addKeyTo = {

    // The "appstore-keyword-ranking" api call returns slightly different keys for the keywords objects
    // such as "chance" (Stands for "traffic") instead of "ownIphoneChance"
    // In order to be able to use this function to sort keywords from this kind of API, the function checks the structure of the keyword
    // object arg, that is passed to the it.
    // API: https://www.mobileaction.co/docs/api#appstore-keyword-ranking

    // if "ownIphoneChance" is one of the object keys, that means it was transferred from the "AppStore Keyword Metadata" API
    // https://www.mobileaction.co/docs/api#appstore-keyword-metadata
    mobileAction: function(mmpId, keywords, countries) {
        countries.forEach(function(country){
            apiRequestHandler.getAppKeysInMa(mmpId, country, function(err, keysObj){
                if(!err){
                    var keys = sortKeys.duplicatesRemoved(keywords, keysObj.keywords);
                    console.log(country);
                    console.log(keysObj.keywords.length);
                    console.log(keys.length);
                    
                    var urls = createURLs(mmpId, keys, country, country == 'US' ? 200 : 100);
                    makeRequests.sendData(urls);
                }

            });
        });
    }

}


function createURLs(mmpId, keywords, country, limit){
    
    var urls = [];
    if (keywords) { // If the input is not empty, than it will try to convert the csv string to array
        var convertedArr = convertFromTo.arrToSubArrays(keywords, limit); // break apart the big arr to two-dimensional array
        let c = 0;
        while(convertedArr.length>0){
            var words = convertedArr.pop();
            let encodedWords = encodeURIComponent(words.toString());
            var URL = "https://api.mobileaction.co/keywords/" + mmpId + "/" + country + "?keywords=" + encodedWords + "&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
            urls.push(URL);
        }
    }
    
    return urls;
}

module.exports = addKeyTo;