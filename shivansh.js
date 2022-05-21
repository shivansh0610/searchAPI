const { MongoClient, ObjectID }= require("mongodb");
const Express = require("express");
const Cors= require("cors");
const BodyParser = require("body-parser");
const client = new MongoClient("mongodb+srv://shivansh:<password>@cluster0.ji6fk.mongodb.net/?retryWrites=true&w=majority");
const server = Express();
server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use (Cors());
var collection;
server.get("/search", async (request, response) => {
try {
let result = await collection.aggregate([
{
"$search": {
"autocomplete": {
"query":'${request.query.term}',
"path": "name",
"fuzzy": {
"maxEdits": 2
}
}
}
}
]).toArray();
response.send(result);
} catch (e) {
response.status (500).send({ message: e.message });
}
});
server.get("/get/:id", async (request, response) => {
    try{
        let result = await collection.findOne({"_id": ObjectID(request.params.id)});
        response.send(result);
    }catch(e){
response.status (500).send({ message: e.message });
    }
})
server.listen ("3000", async () => {
    try {
    await client.connect();
    collection = client.db("API").collection ("user");
} catch (e) {
    console.error(e);
    }
    });