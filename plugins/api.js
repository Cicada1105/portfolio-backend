'use strict';

const API_PLUGIN = {
	name: "apiPlugin",
	version: "1.0.0",
	register: async function(server,options) {
		server.route([
				{
					method: "GET",
					path: "/education",
					handler: function(req, h) {
						/*
							Todo:
							Query database for list of education
						*/
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
						/*
							Todo:
							Query database for list of previous aemployment
						*/
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
						/*
							Todo:
							Query database for list of previous projects
						*/
						const jsonData = JSON.stringify({ name: "Inventory Manager", url:"http://localhost:3000.com" });
						const resp = h.response(jsonData);
						resp.code(200);
						resp.type("application/json");
						resp.bytes(Buffer.byteLength(jsonData,"utf8"));

						return resp;
					}
				}
			]);
	}
}

module.exports = { API_PLUGIN }