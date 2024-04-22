'use strict';

// Built in
const fs = require('fs');
const path = require('path');
// Global
const Hapi = require("@hapi/hapi");
const Boom = require("@hapi/boom");
// Local
const { verify } = require('./utils/tokens.js');

require("dotenv").config();

// Retrieve plugins
const { API_PLUGIN } = require("./plugins/api.js");
const { CMS_PLUGIN } = require("./plugins/cms.js");

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST,
		routes: {
			files: {
				relativeTo: path.join(__dirname, 'public')
			}
		}
	});

	// Register the Vision plugin for handling templating
	await server.register(require('@hapi/vision'));
	await server.register(require('@hapi/inert'));

	// Configure server cookies
	server.state('data', {
		ttl:1000 * 60 * 60 * 24, 			// Cookie lifetime; 1000 * 60 * 60 * 24 === 1 day
		isSecure: true,
		isHttpOnly: true,
		encoding: 'base64json',
		clearInvalid: true, 		// Instructs client to clear invalid cookies
		strictHeader: true 
	});

	// Create a scheme that authenticates a user
	server.auth.scheme("custom", (server, options) => {
		return {
			authenticate: (req, h) => {
				// Retrieve user submitted values
				const cookies = req.state.data;

				if (cookies) {
					let { token } = cookies;
					let { isValid, user } = options.validate(token)

					if (isValid)
						return h.authenticated({ credentials: { user } });
					else
						throw Boom.unauthorized("Invalid Token", "Custom");
				}
				else {
					return Boom.unauthorized("Missing Credentials", "Custom");
				}
			}
		}
	});

	// Create a strategy that implements the authentication
	server.auth.strategy("customAuth", "custom", { validate: verify });

	// Set up view handling
	server.views({
		engines: {
			pug: require('pug')
		},
		relativeTo: __dirname,
		path: 'views'
	});

	server.route([
		{
			method: 'GET',
			path: '/imgs/{file*}',
			handler: {
				directory: {
					path: 'imgs',
					listing: true
				}
			}
		},
		{
			method: 'GET',
			path: '/scripts/{file*}',
			handler: {
				directory: {
					path: 'scripts',
					listing: true
				}
			}
		},
		{
			method: 'GET',
			path: '/styles/{file*}',
			handler: {
				directory: {
					path: 'styles',
					listing: true
				}
			}
		}
	])

	// API plugin
	await server.register({
		plugin: API_PLUGIN,
		routes: { 
			prefix: "/api"
		}
	});
	// CMS plugin
	await server.register({
		plugin: CMS_PLUGIN,
		routes: {
			prefix: "/cms"
		}
	});
	// Fallback for all other routes
	server.route({
		method: "*",
		path: "/{any*}",
		handler: function(req, h) {
			// If the user is logged in, redirect to home page
			if (h.authenticated) 
				return h.redirect('/cms');
			else
				return h.redirect('/cms/login');
		}
	})
	
	// Overwrited default error handling to present user friendly authentication errors
	server.ext('onPreResponse', function(req, h) {
		const response = req.response;
		// Check if a Boom object has been created for error handling
		if (!response.isBoom)
			return h.continue;

		const errInfo = response.output;
		const { statusCode, message } = errInfo.payload;

		if (statusCode === 401)
			return h.view('login', { err: message }).code(statusCode);
		else // Handle other errors
			return h.view('login').code(statusCode);
	});

	await server.start();
	console.log('Server running on %s://%s:%d', server.info.protocol,server.info.host, server.info.port);
}
process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();