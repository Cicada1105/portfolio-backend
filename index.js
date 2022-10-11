'use strict';

const Hapi = require("@hapi/hapi");
require("dotenv").config();

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST
	});

	server.route([
		{
			method: "GET",
			path: "/education",
			handler: function(req, h) {
				const jsonData = JSON.stringify({ name: "Lewis University", from: "August 2017", to: "December 2019" });
				const resp = h.response(jsonData);
				resp.code(200);
				resp.type("application/json");
				resp.bytes(Buffer.byteLength(jsonData,"utf8"));

				return resp;
			}
		},
		{
			method: "GET",
			path: "/employment",
			handler: function(req,h) {
				const jsonData = JSON.stringify({ name: "CarlColvinArts", from: "January 2020", to: "December 2021" });
				const resp = h.response(jsonData);
				resp.code(200);
				resp.type("application/json");
				resp.bytes(Buffer.byteLength(jsonData,"utf8"));

				return resp;
			}
		},
		{
			method: "GET",
			path: "/projects",
			handler: function(req,h) {
				const jsonData = JSON.stringify({ name: "Inventory Manager", url:"http://localhost:3000.com" });
				const resp = h.response(jsonData);
				resp.code(200);
				resp.type("application/json");
				resp.bytes(Buffer.byteLength(jsonData,"utf8"));

				return resp;
			}
		}
	]);

	await server.start();
	console.log('Server running on %s://%s:%d', server.info.protocol,server.info.host, server.info.port);
}
process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();