'use strict';

// Global
const bcrypt = require('bcrypt');
// Local 
const { mongoClient } = require('../utils/mongodb.js');
const { sign } = require('../utils/tokens.js');

const CMS_PLUGIN = {
	name: "cmsPlugin",
	version: "1.0.0",
	register: async function(server,options) {
		server.route([
			{
				method: "GET",
				path: '/{stylesheet}.css',
				handler: function(req,h) {
					const { stylesheet } = req.params;
					
					return h.file(`styles/${stylesheet}.css`);
				}
			},
			{
				method: "GET",
				path: "/",
				options: {
					auth: "customAuth"
				},
				handler: async function(req,h) {
					// Retrieve user info from request
					let { user } = req.auth.credentials;

					return h.view('index', { name: user });
				}
			},
			{
				method: "GET",
				path: "/login",
				handler: function(req,h) {
					// Display login view
					return h.view('login');
				}
			},
			{
				method: "POST",
				path: "/login",
				handler: async function(req,h) {
					// Retrieve the user submitted login information
					let { username, password } = req.payload;

					try {
						let client = await mongoClient.connect();
						let db = client.db('portfolio-cms');

						let user = await db.collection('users').findOne({ username });

						// Query database for logged in user
						if (user !== null) {
							// Hash user submitted password with bcrypt
							if (await bcrypt.compare(password,user['password'])) {
								// Generate token for user
								try {
									let token = sign({ user: user['username'] });
									// Store user token in cookies
									h.state('data', { token });
									// // Redirect to home page 
									return h.redirect('/cms');
								} catch (e) {
									console.log(e);
									return h.view('login', { err: "Server Error" });
								}
							};
							return h.view('login', { err: "Invalid Credentials" });
						}
						
						return h.view('login', { err: "Invalid Credentials" });
					} catch(err) {
						console.log("Error occured");
						console.log(err);
					}
				}
			},
			{
				method: "POST",
				path: "/logout",
				handler: function(req,h) {
					const { username, password } = req.payload;
					h.unstate('data');
					/*
						Todo:
						Reset cookie allowing user to be logged in
					*/
					return h.redirect('/cms/login');
				}
			},
			{
				method: "GET",
				path: "/projects",
				options: {
					auth: 'customAuth'
				},
				handler: async function(req,h) {
					try {
						let client = await mongoClient.connect();
						let db = client.db('portfolio-cms');

						let projects = await db.collection('projects').find({}).toArray();

						return h.view('projects', { projects });
					} catch(err) {
						console.log("Error occured");
						console.log(err);
					}
				}
			},
			{
				method: "GET",
				path: "/education",
				options: {
					auth: 'customAuth'
				},
				handler: async function(req,h) {
					try {
						let client = await mongoClient.connect();
						let db = client.db('portfolio-cms');

						let education = await db.collection('education').find({}).toArray();

						return h.view('education', { education });
					} catch(err) {
						let { user } = req.auth.credentials

						console.log("Error occured");
						console.log(err);

						return h.view('index', { name: user });
					}
				}
			},
			{
				method: "GET",
				path: "/employment",
				options: {
					auth: 'customAuth'
				},
				handler: async function(req,h) {
					try {
						let client = await mongoClient.connect();
						let db = client.db('portfolio-cms');

						let employment = await db.collection('employment').find({}).toArray();

						return h.view('employment', { employment });
					} catch(err) {
						let { user } = req.auth.credentials

						console.log("Error occured");
						console.log(err);

						return h.view('index', { name: user });
					}
				}
			},
			{
				method: "GET",
				path: "/contact",
				options: {
					auth: 'customAuth'
				},
				handler: function(req,h) {
					return h.view('contact');
				}
			}
		])
	}
}

module.exports = { CMS_PLUGIN }