/*
	File for handling functions related to jsonwebtokens
*/

const fs = require('fs');
const jwt = require('jsonwebtoken');

function sign(payload) {
	let privateKey = fs.readFileSync('./private.key');
	// // Create the token with the private key and credentials
	let token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

	return token;
}
function verify(token) {
	let privateKey = fs.readFileSync('./public.pem');
	try {
		// Verify if the token is valid
		let decoded = jwt.verify(token, privateKey, { algorithm: 'RS256' })

		return { isValid: true, user: decoded['user'] };
	} catch(e) {
		return { isValid: false };
	}
}

module.exports = {
	sign, verify
}