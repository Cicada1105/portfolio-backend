'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');

const routes = [
	{
		method: "GET",
		path: "/education",
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let success = req.query['success'];
			let error = req.query['err'];

			try {
				let client = await mongoClient.connect();
				let db = client.db('portfolio_cms');

				let education = await db.collection('education').find({}).toArray();

				return h.view('education/list', { education, success, error });
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
		method: 'POST',
		path: '/education/create',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let params;

			try {
				const client = await mongoClient.connect();
				const db = client.db('portfolio_cms');

				let submittedData = req['payload'];

				submittedData = {
					...submittedData,
					start_year: parseInt(submittedData['start_year'])
				}

				if ( 'end_year' in submittedData ) {
					submittedData['end_year'] = parseInt(submittedData['end_year']);
				}

				let result = await db.collection('education').insertOne(submittedData);
				params = new URLSearchParams({
					success: "Successfully created new institution"
				});
			} catch(err) {
				console.log("Error creating education record");
				console.log(err);

				params = new URLSearchParams({
					err: "Error creating education record"
				});
			} finally {
				return h.redirect(`/cms/education?${params.toString()}`);	
			}
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
		handler: async function(req,h) {
			let { id } = req.params;
			let params;

			try {
				const client = await mongoClient.connect();
				const db = client.db('portfolio_cms');

				let result = await db.collection('education').findOneAndDelete({
					_id: new ObjectId( id )
				});

				params = new URLSearchParams({
					success: "Successfully removed institution"
				});
			} catch(err) {
				console.log(`Error removing education institution with id: ${ id }`)
				console.log(err);

				params = new URLSearchParams({
					err: "Successfully removed institution"
				});
			} finally {
				return h.redirect(`/cms/education?${params.toString()}`);
			}
		}
	}
];

module.exports = { EducationRoutes: routes }