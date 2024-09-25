'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');

const DB_NAME = 'portfolio_cms';
const COLLECTION_NAME = 'projects';

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
				let db = client.db(DB_NAME);

				let projects = await db.collection(COLLECTION_NAME).find({}).toArray();
				
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
			let params;
			
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let submittedData = req['payload'];
				let newProject = {
					title: submittedData['title'],
					description: submittedData['description'],
					github_url: submittedData['github_url'],
					live_url: submittedData['live_url']
				}

				let result = await db.collection(COLLECTION_NAME).insertOne(newProject);

				params = new URLSearchParams({
					success: "Successfully created new project"
				})
			} catch(err) {
				console.log("Error creating project");
				console.log(err);

				params = new URLSearchParams({
					err: "Error creating project"
				});
			} finally {
				return h.redirect(`/cms/projects?${params.toString()}`);
			}
		}
	},
	{
		method: "GET",
		path: '/projects/edit/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let { id } = req.params;
			
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let result = await db.collection(COLLECTION_NAME).findOne({
					_id: new ObjectId(id)
				});

				return h.view('projects/edit',result);
			} catch(err) {
				console.log(`Error retrieving details to edit project with id: ${id}`);
				console.log(err);

				let params = new URLSearchParams({
					err: "Error retrieving data to be editted"
				});

				return h.redirect(`/cms/projects?${params.toString()}`);
			}
		}
	},
	{
		method: "POST",
		path: '/projects/update',
		options: {
			auth: 'customAuth'
		}, 
		handler: async function(req,h) {
			let { id, title, description, github_url, live_url } = req['payload'];

			let params;
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let result = await db.collection(COLLECTION_NAME).findOneAndUpdate({
					_id: new ObjectId(id)
				},{
					$set: {
						title,
						description,
						github_url,
						live_url	
					}
				});

				console.log(result);

				params = new URLSearchParams({
					success: `Successfully updated project "${title}"!`
				});
			} catch(err) {
				console.log(`Error updating project with id: ${id}`);
				console.log(err);

				params = new URLSearchParams({
					err: "Error updating project"
				});
			} finally {
				return h.redirect(`/cms/projects?${params.toString()}`);
			}
		}
	},
	{
		method: "POST",
		path: '/projects/delete/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let { id } = req.params;

			let params;
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let { value: { title } } = await db.collection(COLLECTION_NAME).findOneAndDelete({
					_id: new ObjectId(id)
				});

				params = new URLSearchParams({
					success: `Successfully deleted project "${title}"`
				});
			} catch(err) {
				console.log(`Error deleting project with id: ${id}`);
				console.log(err);

				params = new URLSearchParams({
					err: "Error deleting project"
				});
			} finally {
				return h.redirect(`/cms/projects?${params.toString()}`);
			}
		}
	}
];

module.exports = { ProjectsRoutes: routes }