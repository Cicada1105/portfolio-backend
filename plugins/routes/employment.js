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
	},
	{
		method: 'GET',
		path: '/employment/add',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			return h.view('employment/add');
		}
	},
	{
		method: "GET",
		path: '/employment/edit/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			
			return h.view('employment/edit', { id });
		}
	},
	{
		method: "POST",
		path: '/employment/delete/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			console.log(`Deleting employment with id of ${id}`);
			return h.redirect('/cms/employment');
		}
	}
];

module.exports = { EmploymentRoutes: routes }