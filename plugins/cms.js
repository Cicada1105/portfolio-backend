'use strict';

const { mongoClient } = require('../utils/mongodb.js');

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
							// Quety database for password associated with username 
							// Compare to hashed version of user submitted password
							if (user['password'] === "$2y$10$.yXDgQPi/RWxk5KmscWMxeQ4traQzmq6Q00NSjnIxY1VyQ74ZoER6") {
								// Use JSON Webtokens to generate unique token
								h.state('data', { _id: 2, user: user['username'] });
								// // Redirect to home page 
								return h.redirect('/cms');
							}
							return h.view('login', { err: "Invalid Credentials" });
						}
						/*
							Todo:
							Query database for username and password
							if exists: generate token and redirect to home page
							else: redirect back to login
						*/
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
				handler: function(req,h) {
					return h.view('projects');
				}
			},
			{
				method: "GET",
				path: "/education",
				options: {
					auth: 'customAuth'
				},
				handler: function(req,h) {
					return h.view('education');
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