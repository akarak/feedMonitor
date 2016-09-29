//Load the request module
var request = require('request');
var xml2json = require("node-xml2json");

/*
    Simple reed feed and print to see what they contain...
*/

//Lets configure and request
var url = 'http://modulus.io';
url = 'http://www.parkrun.org.uk/osterley/results/latestresults/';
url = 'http://orig-stage-elections.news.sky.com/query/elections/10/region/overview.json';
url = 'http://scoring.mstworld.tv/content/rydercup.xml';
url = 'http://storyskynews.never.no/xml/feed/story_dev.json';

request({
    url: url, //URL to hit
    qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'GET', //Specify the method
    headers: { //We can define headers too
        'Content-Type': 'MyContentType',
        'Custom-Header': 'Custom Value'
    }
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
//         var json = xml2json.parser( body );
//    //     var event = JSON.parse(json);
//         console.log(json);
//     //    console.log( json.event.tournament.tournid );
//    //     var course = json.event.tournament.courses;
//    //     console.log(course);
//         var thisround = json.event.round;
//         console.log(thisround.matches.match[0]);  
//         console.log(thisround.matches.match.length);  
//         console.log(getMatch(thisround.matches.match[0]));
    }
});

var getMatch = function(m) {
    return( 
        {
            "match":m.no,
            "matchtype": m.matchtype,
            "teetime": m.teetime,
            "players": [ 
                { 
                    "player": m.player[0].orderinmatch,
                    "surname": m.player[0].lastname
                },
                { 
                    "player": m.player[1].orderinmatch,
                    "surname": m.player[1].lastname
                },
                { 
                    "player": m.player[2].orderinmatch,
                    "surname": m.player[2].lastname
                },
                { 
                    "player": m.player[3].orderinmatch,
                    "surname": m.player[3].lastname
                }
            ]
        }
    )};