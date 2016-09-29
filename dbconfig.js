/**
 * Created by Mortoni on 07/12/13.
 */
var databaseURI = "localhost:27017/logger";
var collections = ["messages"];
var db = require("mongojs").connect(databaseURI, collections);

module.exports = db;

