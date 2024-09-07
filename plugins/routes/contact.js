'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');

const DB_NAME = 'portfolio_cms';
const COLLECTION_NAME = 'contact';

const routes = [
	{
		method: "GET",
		path: "/contact",
		options: {
			auth: 'customAuth'
		},
		handler: async function(req,h) {
			let success = req.query['success'];
			let error = req.query['err'];

			try {
				let client = await mongoClient.connect();
				let db = client.db(DB_NAME);

				let contactMethods = await db.collection(COLLECTION_NAME).find({}).toArray();

				return h.view('contact/list', { contactMethods, success, error });
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
		path: '/contact/add',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			return h.view('contact/add');
		}
	},
	{
		method: 'POST',
		path: '/contact/create',
		options: {
			auth: 'customAuth'
		},
		handler: function(req, h) {
			console.log(req.payload);
			return h.redirect('/cms/contact');
		}
	},
	{
		method: "GET",
		path: '/contact/edit/{id}',
		options: {
			auth: 'customAuth'
		},
		handler: function(req,h) {
			let { id } = req.params;
			
			return h.view('contact/edit', { id });
		}
	},
	{
		method: "POST",
		path: '/contact/delete/{id}',
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
					success: 'Successfully removed contact record'
				});
			} catch(err) {
				console.log(`Error removing contact record with id: ${ id }`);
				console.log(err);

				params = new URLSearchParams({
					err: 'Error removing contact record'
				});
			} finally {
				return h.redirect(`/cms/contact?${params.toString()}`);
			}
		}
	}
];

module.exports = { ContactRoutes: routes }