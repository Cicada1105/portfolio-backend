'use strict';
const { mongoClient } = require('../utils/mongodb');

const DB_NAME = 'portfolio_cms';

const API_PLUGIN = {
	name: "apiPlugin",
	version: "1.0.0",
	register: async function(server,options) {
		server.route([
				{
					method: "GET",
					path: "/education",
					handler: async function(req, h) {
						try {
							const client = await mongoClient.connect();
							const db = client.db(DB_NAME);

							const educationRecords = await db.collection('education').find({}).sort({ start_year: -1, end_year: -1 }).project({_id:0}).toArray();
							const jsonData = JSON.stringify(educationRecords);

							const resp = h.response(jsonData);
							resp.code(200);
							resp.type("application/json");
							resp.bytes(Buffer.byteLength(jsonData,"utf8"));
							// resp.header('Access-Control-Allow-Origin','*');

							return resp;
						} catch(e) {
							console.log('Error retrieving education records.');
							console.log(e);

							const jsonData = JSON.stringify({
								message: 'Error retrieving education records'
							});
							const resp = h.response(jsonData);

							resp.code(500);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData,'utf8'));

							return resp;
						}
					}
				},
				{
					method: "GET",
					path: "/employment",
					handler: async function(req,h) {
						try {
							const client = await mongoClient.connect();
							const db = client.db(DB_NAME);

							const employmentRecords = await db.collection('employment').find({}).sort({ start_year: -1, end_year: -1 }).project({_id:0}).toArray();
							const jsonData = JSON.stringify(employmentRecords);

							const resp = h.response(jsonData);
							resp.code(200);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData,'utf8'));
							// resp.header('Access-Control-Allow-Origin','*');

							return resp; 
						} catch(e) {
							console.log('Error retrieving employment records.');
							console.log(e);

							const jsonData = JSON.stringify({
								message: 'Error retrieving employment records.'
							});
							const resp = h.response(jsonData);

							resp.code(500);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData,'utf8'));

							return resp;
						}
					}
				},
				{
					method: "GET",
					path: "/projects",
					handler: async function(req,h) {
						try {
							const client = await mongoClient.connect();
							const db = client.db(DB_NAME);

							const projectRecords = await db.collection('projects').find({}).project({_id:0}).sort({ start_year: 1 }).toArray();
							const jsonData = JSON.stringify(projectRecords);

							const resp = h.response(jsonData);
							resp.code(200);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData));
							// resp.header('Access-Control-Allow-Origin','*');

							return resp;
						} catch(e) {
							console.log('Error retrieving project records.');
							console.log(e);

							const jsonData = JSON.stringify({
								message: 'Error retrieving project records.'
							});

							const resp = h.response(jsonData);
							resp.code(500);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData));

							return resp;
						}
					}
				},
				{
					method: 'GET',
					path: '/contact',
					handler: async function(req,h) {
						try {
							const client = await mongoClient.connect();
							const db = client.db(DB_NAME);

							const contactRecords = await db.collection('contact').find({}).project({_id:0,'platform.icon.id':0}).toArray();
							const jsonData = JSON.stringify(contactRecords);

							const resp = h.response(jsonData);
							resp.code(200);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData,'utf8'));
							// resp.header('Access-Control-Allow-Origin','*');

							return resp;
						} catch(e) {
							console.log('Error retrieving contact records.');
							console.log(e);

							const jsonData = JSON.stringify({
								message: 'Error retrieving contact records.'
							});

							const resp = h.response(jsonData);
							resp.code(500);
							resp.type('application/json');
							resp.bytes(Buffer.byteLength(jsonData));

							return resp;
						}
					}
				}
			]);
	}
}

module.exports = { API_PLUGIN }