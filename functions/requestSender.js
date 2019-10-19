var express = require("express"),
    Bottleneck = require("bottleneck"),
    regeneratorRuntime = require("regenerator-runtime"),
    app = express();
    
import { makeApiCall } from './apiReqeusts';
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000
});

const makeRequests = {};

require("isomorphic-fetch");

makeRequests.sendData = (urls) => {
    urls.forEach(async url => {
      try {
            const response = await limiter.schedule(() => fetch(url, {
                'method': 'POST',
                'headers': {
                    'content-type': 'application/x-www-form-urlencoded',
                    'charset': 'utf-8',
                }
            }));
          const counts = limiter.counts();
          console.log(counts);
      } catch(error) {
          console.log(error);
      }
    });
}

module.exports = makeRequests;
