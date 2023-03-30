'use strict';

// Local 
const { mongoClient } = require('../../utils/mongodb.js');

const routes = [
	{
		method: "GET",
		path: "/contact",
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio-cms');

				let contactMethods = await db.collection('contact').find({}).toArray();

				return h.view('contact/list', { contactMethods });
			} catch(err) {
				let { user } = req.auth.credentials

				console.log("Error occured");
				console.log(err);

				return h.view('index', { name: user });
			}
		}
	}
];

module.exports = { ContactRoutes: routes }