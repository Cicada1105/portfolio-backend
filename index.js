'use strict';

const Hapi = require("@hapi/hapi");
require("dotenv").config();

// Retrieve plugins
const { API_PLUGIN } = require("./plugins/api.js");
const { CMS_PLUGIN } = require("./plugins/cms.js");

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST
	});

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