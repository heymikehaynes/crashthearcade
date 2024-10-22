const EleventyFetch = require("@11ty/eleventy-fetch");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto-js");
const axios = require("axios");
const sanitizeHtml = require("sanitize-html");

// Function to extract only images
function extractImagesOnly(html) {
	return sanitizeHtml(html, {
		allowedTags: ['img'], // Allow only <img> tags
		allowedAttributes: {
			'img': ['src', 'alt', 'title'] // Allow relevant attributes for <img>
		},
		textFilter: function(text) {
			return ''; // Remove all text nodes
		}
	});
}

// OAuth setup using environment variables
const oauth = OAuth({
	consumer: {
		key: process.env.TUMBLR_CONSUMER_KEY, // From Vercel env vars
		secret: process.env.TUMBLR_CONSUMER_SECRET, // From Vercel env vars
	},
	signature_method: "HMAC-SHA1",
	hash_function(base_string, key) {
		return crypto.HmacSHA1(base_string, key).toString(crypto.enc.Base64);
	},
});

const token = {
	key: process.env.TUMBLR_ACCESS_TOKEN, // From Vercel env vars
	secret: process.env.TUMBLR_ACCESS_TOKEN_SECRET // From Vercel env vars
};

module.exports = async function () {
	const blogIdentifier = "crashthearcade.tumblr.com"; // Your Tumblr blog identifier
	const apiUrl = `https://api.tumblr.com/v2/blog/${blogIdentifier}/posts`;

	const requestData = {
		url: `${apiUrl}?limit=8`,
		method: "GET",
	};

	try {
		// Sign the request using OAuth
		const headers = oauth.toHeader(oauth.authorize(requestData, token));

		// Make the request to Tumblr's API
		const response = await axios.get(apiUrl, {
			params: {
				api_key: process.env.TUMBLR_CONSUMER_KEY, // Tumblr API key from env
				limit: 8
			},
			headers: headers
		});

		// Access the posts from the response
		const posts = response.data.response.posts;

		// Map posts to include necessary details
		const mappedPosts = posts.map(post => {
			const description = post.body || post.caption || ''; // Adjust based on post types
			const imagesOnly = extractImagesOnly(description);

			return {
				id_string: post.id_string,
				pubDate: new Date(post.date),
				description: imagesOnly
			};
		});

		// Return an object containing both the blog identifier and the posts
		return {
			blogIdentifier,
			posts: mappedPosts
		};
	} catch (error) {
		console.error("Error fetching Tumblr posts:", error);
		return {
			blogIdentifier,
			posts: [] // Return an empty array if there's an error
		};
	}
};
