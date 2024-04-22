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
				let db = client.db('portfolio_cms');

				let education = await db.collection('education').find({}).toArray();

				return h.view('education/list', { education });
			} catch(err) {
				let { user } = req.auth.credentials

				console.log("Error occured");
				console.log(err);

				return h.view('index', { name: user });
			}
		}
	},
	{
		method: 'GET',
		path: '/education/add',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			return h.view('education/add');
		}
	},
	{
		method: "GET",
		path: '/education/edit/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			
			return h.view('education/edit', { id });
		}
	},
	{
		method: "POST",
		path: '/education/delete/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			console.log(`Deleting education with id of ${id}`);
			return h.redirect('/cms/education');
		}
	}
];

module.exports = { EducationRoutes: routes }