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
	},
	{
		method: 'GET',
		path: '/projects/add',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			return h.view('projects/add');
		}
	},
	{
		method: "GET",
		path: '/projects/edit/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			
			return h.view('projects/edit', { id });
		}
	},
	{
		method: "POST",
		path: '/projects/delete/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			console.log(`Deleting project with id of ${id}`);
			return h.redirect('/cms/projects');
		}
	}
];

module.exports = { ProjectsRoutes: routes }