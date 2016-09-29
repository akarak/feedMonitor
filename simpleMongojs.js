/**
 * Created by Mortoni on 07/12/13.
 */
var config = require('./config.js');
var mongojs = require("mongojs");
var request = require('request');
var xml2json = require("node-xml2json");
var diff = require('rus-diff').diff


// console.log(diff(a, b))


var databaseURI = config.databaseURI;
var collections = config.collections;
var db = mongojs(databaseURI, collections);

var feedNo = 1;
var feed = config.feeds[1];
var jsonObj;
var jsonDiff;
var jsonLast = [];
jsonLast[0] = {temp:"start"};
jsonLast[1] = {temp:"start"};
var quiet = true;
var counter = 0;
process.stdout.write('...starting');

var myVar = setInterval(function(){ myTimer() }, 10000);
// jsonObj.time = getDateTime();

//log2db(jsonObj);

function myTimer() {
    counter++;
    feedNo = 1 - feedNo;
    feed = config.feeds[feedNo];
    if (counter == 6) {
        console.log(getDateTime());
        counter = 0;
    } else {
        process.stdout.write('.');
    }
    request({
        url: feed.url, //URL to hit
        qs: {from: 'feed example', time: +new Date()}, //Query string data
        method: 'GET', //Specify the method
        headers: { //We can define headers too
            'Content-Type': 'MyContentType',
            'Custom-Header': 'Custom Value'
        }
    }, function(error, response, body){
        // console.log("...returned", error);
        if(error) {
            console.log("Feed err: ", error);
        } else {
            if (response.statusCode !== 200) {
                console.log("Status code: ", response.statusCode);
            } else {
       //         if (!quiet) console.log(body);
                if (feed.type == "xml") {
                    jsonObj = xml2json.parser( body );
                } else {
                    jsonObj = JSON.parse(body);
                }
                jsonDiff = diff(jsonLast[feedNo], jsonObj);
                jsonLast[feedNo] = jsonObj;

    //            if (!quiet) console.log(jsonObj);
                jsonObj.logTime = getDateTime();
                log2db(jsonObj, quiet);
                if (jsonDiff) {
                    jsonDiff.logTime = getDateTime();
                    log2diff(jsonDiff, quiet);
                    console.log(feedNo, ":::", jsonDiff);
                }
            }
        }
    });
}

// db.close();

//////////////////
function log2db(message, quiet) {
    db.messages.save(message, function(err, saved) {
        if( err || !saved ) console.log("Message not saved", err);
        else {
            if (!quiet) console.log("Message saved"); 
        }
    });
}

function log2diff(message, quiet) {
    db.diffs.save(message, function(err, saved) {
        if( err || !saved ) console.log("Diff not saved", err);
        else {
            if (!quiet) console.log("Diff saved"); 
        }
    });
}

function test() {
    db.messages.save({type: "random", date: getDateTime(), command: "iLoveMongo"}, function(err, saved) {
        if( err || !saved ) console.log("Message not saved");
        else console.log("Message saved");
    });

    db.messages.find({type: "random"}, function(err, mess) {
        if( err || !mess) console.log("No messages found");
        else mess.forEach( function(msg) {
            console.log(msg);
        } );
    });

    db.messages.update({type: "random"}, {$set: {command: "iReallyLoveMongo"}}, function(err, updated) {
        if( err || !updated ) console.log("Not updated");
        else console.log("Updated");

    });
}


function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
