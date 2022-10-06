'use strict';

const Hapi = require("@hapi/hapi");

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: 'localhost'
	});

	server.route({
		method: "GET",
		path: "/",
		handler: function(req, h) {
			return "Hello World";
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