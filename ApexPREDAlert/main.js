/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var http= require('http');
var server = http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("Hello Azure!");
});
var port = process.env.PORT || 1337;
server.listen(port);
console.log("Server running at http://localhost:%d", port);
var client = require("mongodb").MongoClient;
client.connect("mongodb://apex-db:xBVVJs84DgyIxctZqgSfTfHJ48B8RgsNJk7uZLkwlikRv5PSaZ6pXmKcHva7OKJ4f2lJUE65SNhdSKVDibOZCA%3D%3D@apex-db.documents.azure.com:10255/?ssl=true", function (err, client) {
  client.close();
});
var a = document.getElementsByName("addressofSighting");
var n = document.getElementsByName("NameofPerson");
var t = document.getElementsByName("timeofday");
document.onload = client.connect();
document.getElementById("Submit Sighting").onclick = doverb();
const db = client.db('Preds');
const collection = db.collection('Predator');
function doverb(){
    collection.insertOne({name: n}, {address: a}, {time: t}, (err, result) => {});
}

