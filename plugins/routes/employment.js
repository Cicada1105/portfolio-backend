'use strict';

// Local 
const { mongoClient } = require('../../utils/mongodb.js');

const routes = [
	{
		method: "GET",
		path: "/employment",
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio-cms');

				let employment = await db.collection('employment').find({}).toArray();

				return h.view('employment/list', { employment });
			} catch(err) {
				let { user } = req.auth.credentials

				console.log("Error occured");
				console.log(err);

				return h.view('index', { name: user });
			}
		}
	}
];

module.exports = { EmploymentRoutes: routes }