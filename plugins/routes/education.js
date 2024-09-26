'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');

const DB_NAME = 'portfolio_cms';
const COLLECTION_NAME = 'education';

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
				let db = client.db(DB_NAME);

				let education = await db.collection(COLLECTION_NAME).find({}).toArray();

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
				const db = client.db(DB_NAME);

				let submittedData = req['payload'];

				submittedData = {
					...submittedData,
					start_year: parseInt(submittedData['start_year'])
				}

				if ( 'end_year' in submittedData ) {
					submittedData['end_year'] = parseInt(submittedData['end_year']);
				}

				let result = await db.collection(COLLECTION_NAME).insertOne(submittedData);
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
		handler: async function(req,h) {
			let { id } = req.params;
			
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let result = await db.collection(COLLECTION_NAME).findOne({
					_id: new ObjectId(id)
				});

				return h.view('education/edit',result);
			} catch(err) {
				console.log(`Error retrieving education record to edit with id: ${id}`);
				console.log(err);

				let params = new URLSearchParams({
					err: 'Error retrieving education data to udpate'
				});

				return h.rediret(`/cms/education?${params.toString()}`);
			}
		}
	},
	{
		method: "POST",
		path: '/education/update',
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let { id, institution, degree_type, start_month, start_year } = req['payload'];
			let params;

			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let submittedData = {
					institution,
					degree_type,
					start_month,
					start_year: parseInt(start_year)
				};

				if ( 'end_month' in req['payload'] ) {
					let { end_month, end_year } = req['payload'];

					submittedData = {
						...submittedData,
						end_month,
						end_year: parseInt(end_year)
					}
				}
				else {
					submittedData = {
						...submittedData,
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
					success: `Successfully updated education record "${institution}"`
				});
			} catch(err) {
				console.log(`Error updating education record with id: ${id}`);
				console.log(err);

				params = new URLSearchParams({
					err: "Error updating education data."
				});
			} finally {
				return h.redirect(`/cms/education?${params.toString()}`);
			}
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
				const db = client.db(DB_NAME);

				let result = await db.collection(COLLECTION_NAME).findOneAndDelete({
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