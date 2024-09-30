'use strict';

// Local 
const { mongoClient, ObjectId } = require('../../utils/mongodb.js');
const { uploadImage, removeImage } = require('./utils');

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

				let contactInfo = {
					platform: {
						name: platform
					},
					handle,
					url
				}

				if ( _data.length > 0 ) {
					let result = await uploadImage({ 
						buffer: _data,
						fileExtension: filename.split('.')[1]
					});

					if ( 'help' in result ) {
						console.log(result['message']);
						console.log(result['help']);

						throw new Error('Error uploading image to ImageKit.');
					}
					else {
			    	let { fileId, url, thumbnailUrl } = result;

			    	contactInfo['platform'].icon = {
			    		id: fileId,
			    		url,
			    		thumbnailUrl
			    	}
					}	
				}

		    let dbResult = await db.collection(COLLECTION_NAME).insertOne(contactInfo);

				params = new URLSearchParams({
					success: "Successfully created new contact record"
				});
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
		handler: async function(req,h) {
			let { id } = req.params;
			
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let { _id, platform: { name, icon }, url, handle } = await db.collection(COLLECTION_NAME).findOne({
					_id: new ObjectId(id)
				});

				let formattedData = {
					_id,
					platform: name,
					handle,
					url
				}

				if ( icon ) {
					formattedData['icon_id'] = icon['id']
				}

				return h.view('contact/edit',formattedData);
			} catch(err) {
				console.log(`Error retrieving contact record with id: ${id}`);
				console.log(err);

				let params = new URLSearchParams({
					err: "Error retrieving contact record"
				});

				return h.redirect(`/cms/contact?${params.toString()}`);
			}
		}
	},
	{
		method: "POST",
		path: '/contact/update',
		options: {
			auth: 'customAuth',
			payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true
      }
		},
		handler: async function(req,h) {
			let { id, icon_id, platform, handle, url, icon: { _data, hapi: { filename } } } = req.payload;
			let params;

			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				let contactInfo = {
					"platform.name": platform,
					handle,
					url
				}

				if ( _data.length > 0 ) {
					// Delete old image only if a new image is uploaded and old image is present
					if ( icon_id ) {
						let deleteResult = await removeImage(icon_id);

						if ( 'message' in deleteResult ) {
							console.log(deleteResult['message']);	
							console.log(deleteResult['help']);

							throw new Error('Error removing image from ImageKit');
						}	
					}
					let createResult = await uploadImage({
						buffer: _data,
						fileExtension: filename.split('.').slice(-1)[0]
					});

					if ( 'message' in createResult ) {
						if ( 'help' in createResult ) {
							console.log(createResult['message']);	
							console.log(createResult['help']);

							throw new Error('Error uploading image to ImageKit.');
						}
						else {
							console.log(createResult['message']);	
						}
					}
					else {
			    	let { fileId, url, thumbnailUrl } = createResult;

			    	contactInfo['platform.icon'] = {
			    		id: fileId,
			    		url,
			    		thumbnailUrl
			    	}
					}
				}

				let result = await db.collection(COLLECTION_NAME).findOneAndUpdate({
					_id: new ObjectId( id )
				}, {
					$set: contactInfo
				});

				params = new URLSearchParams({
					success: 'Successfully updated contact record'
				});
			} catch(err) {
				console.log(`Error updating contact record with id: ${id}`);
				console.log(err);

				params = new URLSearchParams({
					err: "Error updating contact record."
				});
			} finally {
				return h.redirect(`/cms/contact?${params.toString()}`);
			}
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
			let { image_id } = req.payload;

			let params;
			try {
				const client = await mongoClient.connect();
				const db = client.db(DB_NAME);

				if ( image_id ) {
					let imageKitResult = await removeImage(image_id);

					if ( 'message' in imageKitResult ) {
						if ( 'help' in imageKitResult ) {
							console.log(imageKitResult['message']);	
							console.log(imageKitResult['help']);

							throw new Error('Error removing image from ImageKit');
						}
						else {
							console.log(imageKitResult['message']);	
						}
					}	
				}

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