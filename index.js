'use strict';

const Hapi = require("@hapi/hapi");
const Path = require('path');
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
				relativeTo: Path.join(__dirname, 'public')
			}
		}
	});

	// Register the Vision plugin for handling templating
	await server.register(require('@hapi/vision'));
	await server.register(require('@hapi/inert'));

	// Configure server cookies
	server.state('data', {
		ttl:null, 					// Cookie lifetime; null === cookie deletes when browser is closed
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
					let { _id, user } = cookies;
					const { isValid } = options.validate(_id);

					if (isValid)
						return h.authenticated({ credentials: { user } });
					else
						return h.unauthenticated("Invalid Credentials");	
				}
				else {
					return h.unauthenticated("Missing Credentials");
				}
			}
		}
	});

	const validate = (id) => {
		/*
			Todo: 
			Use JSON Webtoken to verify if token associated with user is valid
		*/
		if (id === 2) {
			return { isValid: true }
		}
		else {
			return { isValid: false }
		}
	}
	// Create a strategy that implements the authentication
	server.auth.strategy("customAuth", "custom", { validate });

	// Set up view handling
	server.views({
		engines: {
			pug: require('pug')
		},
		relativeTo: __dirname,
		path: 'views'
	});

	server.route({
		method: 'GET',
		path: '/imgs/{file*}',
		handler: {
			directory: {
				path: 'imgs',
				listing: true
			}
		}
	})

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
	

	await server.start();
	console.log('Server running on %s://%s:%d', server.info.protocol,server.info.host, server.info.port);
}
process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();