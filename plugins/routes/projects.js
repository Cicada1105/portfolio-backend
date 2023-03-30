'use strict';

// Local 
const { mongoClient } = require('../../utils/mongodb.js');

const routes = [
	{
		method: "GET",
		path: "/projects",
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio-cms');

				let projects = await db.collection('projects').find({}).toArray();

				return h.view('projects/list', { projects });
			} catch(err) {
				console.log("Error occured");
				console.log(err);
			}
		}
	}
];

module.exports = { ProjectsRoutes: routes }