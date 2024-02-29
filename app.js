const http = require("node:http");                      // Node.js standard library for handling client/server features
const { send } = require("node:process");
const MongoClient = require("mongodb").MongoClient;     // MongoDB Node.js Driver module for handling the database features

// initialization of MongoDB server properties (in accordance to the MongoDB config file)
const dbHostname = "127.0.0.1"; 
const dbPort = 27017;
const dbServerUrl = "mongodb://" + dbHostname + ":" + dbPort + "";
const dbClient = new MongoClient(dbServerUrl);      // initialization of an object, representing the connection to the configured MongoDB database

// initialization of the Database and Collection names on the MongoDB server, and user for any data handling within the context of this project
const dbName = "tnm115-lab";
const dbCollectionArtists = "artists"; 

// initialization of HTTP server properties
const hostname = "127.0.0.1";
const port = 3000;
const serverUrl = "http://" + hostname + ":" + port + "";

const server = http.createServer((req,res) => {
    
    const requestUrl = new URL(serverUrl + req.url);
    const pathComponents = requestUrl.pathname.split("/");
    let artistID = "NoArtist";

    if(pathComponents.length>2){
        artistID = pathComponents[2];
    } 

    if(req.method == "GET"){

        switch(pathComponents[1])
        {
            case "artists":
                sendAllArtists(res);
                break;
            case "artist":
                sendArtist(res, artistID);
                break;
            default:
                sendResponse(res, 200, "text/plain", "shit idk?");
                break;
        }
    }
    else if (req.method == "OPTIONS"){
        sendResponse(res, 204, null, null);
    }

});

// start up of the initialized (and configured) server
server.listen(port, hostname, () => {
    console.log("The server running and listening at\n" + serverUrl);
});

function sendResponse(res, statusCode, contentType, data){
    
    res.statusCode = statusCode;
    if (contentType != null) res.setHeader("Content-Type", contentType);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    
    if (data != null) res.end(data);     // data in HTTP message body
    else res.end();                      // empty HTTP message body
}

async function sendAllArtists(res){
    
    await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                             // (2) select a specified database on the server
    const dbCollection = db.collection(dbCollectionArtists);       // (3) select a specified (document) collection in the database
 
    const projectionQuery= { _id : 1, name : 1, nameVariation: 1 };  // genres?             // findQuery {} for selecting all documents in the collection
    const sortQuery = { name : 1 };

    const findAllResult = await dbCollection.find().sort(sortQuery).project(projectionQuery).toArray();        

    const jsonResult = findAllResult;
    const jsonResultAsString = JSON.stringify(jsonResult);
 
    sendResponse(res, 200, "application/json", jsonResultAsString);
}

async function sendArtist(res, artistID){

    await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                             // (2) select a specified database on the server
    const dbCollection = db.collection(dbCollectionArtists);       // (3) select a specified (document) collection in the database
 
    const findQuery = { _id : Number(artistID) };                        // findQuery {} for selecting all documents in the collection

    const findAllResult = await dbCollection.find(findQuery).toArray();        
     
    const jsonResult = findAllResult[0];
    console.log(jsonResult);
    const jsonResultAsString = JSON.stringify(jsonResult);
 
    sendResponse(res, 200, "application/json", jsonResultAsString);
 
}

