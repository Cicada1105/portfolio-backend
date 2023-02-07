'use strict';

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
			},
			{
				method: "POST",
				path: "/logout",
				handler: function(req,h) {
					const { username, password } = req.payload;
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
				handler: function(req,h) {
					return h.view('projects');
				}
			},
			{
				method: "GET",
				path: "/education",
				handler: function(req,h) {
					return h.view('education');
				}
			},
			{
				method: "GET",
				path: "/contact",
				handler: function(req,h) {
					return h.view('contact');
				}
			}
		])
	}
}

module.exports = { CMS_PLUGIN }