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
			let success = req.query['success'];
			let error = req.query['err'];

			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio_cms');

				let projects = await db.collection('projects').find({}).toArray();
				
				return h.view('projects/list', { projects, success, error });
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
		method: 'POST',
		path: '/projects/create',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let client;
			try {
				client = await mongoClient.connect();
				let db = client.db('portfolio_cms');

				let submittedData = req['payload'];
				let newProject = {
					title: submittedData['title'],
					description: submittedData['description'],
					github_url: submittedData['github_url'],
					live_url: submittedData['live_url']
				}

				let result = await db.collection('projects').insertOne(newProject);

				let successParam = new URLSearchParams({
					success: "Successfully created new project"
				})
				return h.redirect(`/cms/projects?${successParam.toString()}`);
			} catch(err) {
				console.log("Error creating project");
				console.log(err);

				let errParam = new URLSearchParams({
					err: "Error creating project"
				});
				return h.redirect(`/cms/projects?${errParam.toString()}`);
			} finally {
				client.close();
			}
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