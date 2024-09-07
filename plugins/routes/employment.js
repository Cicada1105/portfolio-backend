'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');

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
			let params;

			try {
				const client = await mongoClient.connect();
				const db = client.db('portfolio_cms');

				let submittedData = req['payload'];
				submittedData['start_year'] = parseInt(submittedData['start_year']);

				if ( 'end_year' in submittedData ) {
					submittedData['end_year'] = parseInt(submittedData['end_year']);
				}

				let result = await db.collection('employment').insertOne(submittedData);
				params = new URLSearchParams({
					success: "Successfully created new employment"
				});
			} catch(err) {
				console.log("Error creating employment record");
				console.log(err);

				params = new URLSearchParams({
					err: "Error creating employment record"
				});
			} finally {
				return h.redirect(`/cms/employment?${params.toString()}`);	
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
		handler: async function(req,h) {
			let { id } = req.params;
			let params;

			try {
				const client = await mongoClient.connect();
				const db = client.db('portfolio_cms');

				let result = await db.collection('employment').findOneAndDelete({
					_id: new ObjectId( id )
				});

				params = new URLSearchParams({
					success: "Successfully removed employment record"
				});
			} catch(err) {
				console.log(`Error removing employment record with id: ${ id }`)
				console.log(err);

				params = new URLSearchParams({
					err: "Error removing employment record"
				});
			} finally {
				return h.redirect(`/cms/employment?${params.toString()}`);
			}
		}
	}
];

module.exports = { EmploymentRoutes: routes }