const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

// Check if the mongodb uri exists in the local env
if (!process.env.MONGO_URI) {
	throw new Error("Missing MONGODB_URI environment variable");
}

const mongoURI = process.env.MONGO_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };

let mongoClient = new MongoClient(mongoURI, options);

module.exports = { 
	ObjectId,
	mongoClient
}