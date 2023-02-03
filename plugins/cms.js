'use strict';

const CMS_PLUGIN = {
	name: "cmsPlugin",
	version: "1.0.0",
	register: async function(server,options) {
		server.route([
			{
				method: "GET",
				path: "/",
				handler: function(req,h) {
					/*
						Todo: 
						if logged in: display home page
						else redirect to login
					*/
					return h.view('index');
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
				handler: function(req,h) {
					const { username, password } = req.payload;
					/*
						Todo:
						Query database for username and password
						if exists: generate token and redirect to home page
						else: redirect back to login
					*/
					return h.redirect('/cms');
				}
			}
		])
	}
}

module.exports = { CMS_PLUGIN }