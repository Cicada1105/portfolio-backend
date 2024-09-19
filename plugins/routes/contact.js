'use strict';

const crypto = require('crypto');
const ImageKit = require('imagekit');
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
			auth: 'customAuth',
			payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true
      }
		},
		handler: async function(req, h) {
			let params;
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);
				
				let { platform, handle, url, icon: { _data, hapi: { filename } } } = req.payload;

				let fileExtension = filename.split('.')[1];

				let contactInfo = {
					platform: {
						name: platform
					},
					handle,
					url
				}

				var imageKit = new ImageKit({
				    publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
				    privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
				    urlEndpoint : `https://ik.imagekit.io/${process.env.IMAGE_KIT_ID}/`
				});

				const IMAGE_UPLOAD_OPTIONS = {
					file: _data.toString('base64'),
					fileName: `${crypto.randomUUID()}.${fileExtension}`
				}

				let callbackFunc = async function(err, result) {
			    if(err) {
			    	console.log("Error uplaoding to ImageKit");
			    	console.log(err);

						params = new URLSearchParams({
							err: "Error creating contact record"
						})
			    }
			    else {
			    	let { fileId, url, thumbnailUrl } = result;
			    	contactInfo['platform'].icon = {
			    		id: fileId,
			    		url,
			    		thumbnailUrl
			    	}

				    let dbResult = await db.collection(COLLECTION_NAME).insertOne(contactInfo);

						params = new URLSearchParams({
							success: "Successfully created new contact record"
						});
			    }
				}

				imageKit.upload(IMAGE_UPLOAD_OPTIONS, callbackFunc);
			} catch(err) {
				console.log(`Error creating new contact: ${req['params'].name}`);
				console.log(err);

				params = new URLSearchParams({
					err: "Error creating contact record"
				})
			} finally {
				return h.redirect(`/cms/contact?${params.toString()}`);
			}
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