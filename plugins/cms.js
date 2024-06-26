'use strict';

// Global
const bcrypt = require('bcrypt');
// Local 
const { mongoClient } = require('../utils/mongodb.js');
const { sign } = require('../utils/tokens.js');

// Routes
const { 
	ProjectsRoutes, EducationRoutes,
	EmploymentRoutes, ContactRoutes 
} = require('./routes');

const CMS_PLUGIN = {
	name: "cmsPlugin",
	version: "1.0.0",
	register: async function(server,options) {
		server.route([
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
						let db = client.db('portfolio_cms');

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
						return h.view('login', { err: "Error occured" });
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
			...ProjectsRoutes,
			...EducationRoutes,
			...EmploymentRoutes,
			...ContactRoutes
		])
	}
}

module.exports = { CMS_PLUGIN }