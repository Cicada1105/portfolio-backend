'use strict';

// Local 
const { mongoClient } = require('../../utils/mongodb.js');

const routes = [
	{
		method: "GET",
		path: "/education",
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio-cms');

				let education = await db.collection('education').find({}).toArray();

				return h.view('education/list', { education });
			} catch(err) {
				let { user } = req.auth.credentials

				console.log("Error occured");
				console.log(err);

				return h.view('index', { name: user });
			}
		}
	}
];

module.exports = { EducationRoutes: routes }