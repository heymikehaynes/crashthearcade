const express = require('express');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto-js');
const axios = require('axios');
const qs = require('querystring');

// Set up OAuth
const oauth = OAuth({
	consumer: {
		key: 'h0jSqNI2YwI2Ujt6OR7id4lTfwCcaeZ0vXEROZnsAAOFqvNyDk', // Your app's consumer key
		secret: 'CbU1Db37txr8cBssfNzYjEmCLP5eqcj4RbgM8mbEqeraPUed0e', // Your app's consumer secret
	},
	signature_method: 'HMAC-SHA1',
	hash_function(base_string, key) {
		return crypto.HmacSHA1(base_string, key).toString(crypto.enc.Base64);
	},
});

const token = {}; // No token for initial request

const app = express();

// Step 1: Request Token
app.get('/auth/request_token', async (req, res) => {
	const requestData = {
		url: 'https://www.tumblr.com/oauth/request_token',
		method: 'POST',
		data: {
			oauth_callback: 'https://crashthearcade.com/auth/callback', // Replace with your callback URL
		},
	};

	try {
		const headers = oauth.toHeader(oauth.authorize(requestData, token));

		// Send the POST request to get the request token
		const response = await axios.post(requestData.url, qs.stringify(requestData.data), {
			headers: {
				...headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		// Extract the oauth_token and oauth_token_secret from response
		const { oauth_token, oauth_token_secret } = qs.parse(response.data);

		// Store these tokens in session (for demonstration purposes, I'm storing in memory)
		token.oauth_token = oauth_token;
		token.oauth_token_secret = oauth_token_secret;

		// Step 2: Redirect user to the Tumblr authorization page
		const authUrl = `https://www.tumblr.com/oauth/authorize?oauth_token=${oauth_token}`;
		res.redirect(authUrl);
	} catch (error) {
		console.error('Error obtaining request token:', error);
		res.send('Error obtaining request token.');
	}
});

// Step 2: Callback after user authorizes
app.get('/auth/callback', async (req, res) => {
	const { oauth_token, oauth_verifier } = req.query;

	// Step 3: Exchange the request token for an access token
	const requestData = {
		url: 'https://www.tumblr.com/oauth/access_token',
		method: 'POST',
		data: {
			oauth_verifier, // The verifier we received from Tumblr
		},
	};

	try {
		const headers = oauth.toHeader(oauth.authorize(requestData, token));

		// Send the POST request to exchange the request token for an access token
		const response = await axios.post(requestData.url, qs.stringify(requestData.data), {
			headers: {
				...headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		// Extract the access_token and access_token_secret
		const { oauth_token, oauth_token_secret } = qs.parse(response.data);

		res.send(`Access Token: ${oauth_token}<br>Access Token Secret: ${oauth_token_secret}`);
	} catch (error) {
		console.error('Error obtaining access token:', error);
		res.send('Error obtaining access token.');
	}
});

app.listen(3000, () => {
	console.log('App running on https://crashthearcade.com');
});
