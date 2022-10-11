'use strict';

const CMS_PLUGIN = {
	name: "cmsPlugin",
	version: "1.0.0",
	register: async function(server,options) {
		server.route({
			method: "GET",
			path: "/",
			handler: function(req,h) {
				return "CMS Home";
			}
		})
	}
}

module.exports = { CMS_PLUGIN }