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
			let success = req.query['success'];
			let error = req.query['err'];

			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio_cms');

				let employment = await db.collection('employment').find({}).toArray();

				return h.view('employment/list', { employment, success, error });
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
		method: 'POST',
		path: '/employment/create',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let client;
			try {
				client = await mongoClient.connect();
				let db = client.db('portfolio_cms');

				let submittedData = req['payload'];
				submittedData['start_year'] = parseInt(submittedData['start_year']);

				if ( 'end_year' in submittedData ) {
					submittedData['end_year'] = parseInt(submittedData['end_year']);
				}

				let result = await db.collection('employment').insertOne(submittedData);
				let successParam = new URLSearchParams({
					success: "Successfully created new employment"
				});
				return h.redirect(`/cms/employment?${successParam.toString()}`);	
			} catch(e) {
				console.log("Error creating employment record");
				console.log(err);

				let errParam = new URLSearchParams({
					error: "Error creating employment record"
				});

				return h.redirect(`/cms/employment?${errParam.toString()}`);
			} finally {
				client.close();
			}
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