'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');

const DB_NAME = 'portfolio_cms';
const COLLECTION_NAME = 'employment';

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
				let db = client.db(DB_NAME);

				let employment = await db.collection(COLLECTION_NAME).find({}).toArray();

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
				const db = client.db(DB_NAME);

				let submittedData = req['payload'];
				submittedData['start_year'] = parseInt(submittedData['start_year']);

				if ( 'end_year' in submittedData ) {
					submittedData['end_year'] = parseInt(submittedData['end_year']);
				}

				let result = await db.collection(COLLECTION_NAME).insertOne(submittedData);
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
		handler: async function(req,h) {
			let { id } = req.params;
			
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let result = await db.collection(COLLECTION_NAME).findOne({
					_id: new ObjectId(id)
				})

				return h.view('employment/edit', result);
			} catch(err) {
				console.log(`Error retrieving employment data to edit with id: ${id}`);
				console.log(err);

				let params = new URLSearchParams({
					err: "Error retrieving employment record to edit"
				});

				return h.redirect(`/cms/employment?${params.toString()}`);
			}
		}
	},
	{
		method: "POST",
		path: '/employment/update',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let params;
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let { id, title, employer, description, start_month, start_year } = req['payload'];
				let submittedData = {
					title, 
					employer, 
					description, 
					start_month,
					start_year: parseInt(start_year)
				}

				if ( 'end_month' in req['payload'] ) {
					let { end_month, end_year } = req['payload'];

					submittedData = {
						end_month,
						end_year: parseInt(end_year),
						...submittedData
					}
				}
				else {
					submittedData = {
						end_month: null,
						end_year: null
					}
				}

				const result = await db.collection(COLLECTION_NAME).findOneAndUpdate({
					_id: new ObjectId(id)
				}, {
					$set: submittedData
				});

				params = new URLSearchParams({
					success: `Successfully updated project "${title}"`
				})
			} catch(err) {
				console.log(`Error updating employment record with id: ${id}`);
				console.log(err);

				params = new URLSearchParams({
					err: "Error updating employment record"
				})
			} finally {
				return h.redirect(`/cms/employment?${params.toString()}`);
			}
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
				const db = client.db(DB_NAME);

				let result = await db.collection(COLLECTION_NAME).findOneAndDelete({
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