/* latest posts from tumblr */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const parser = new Parser();

// Function to extract only images
function extractImagesOnly(html) {
	return sanitizeHtml(html, {
		allowedTags: ['img'], // Allow only <img> tags
		allowedAttributes: {
			'img': ['src', 'alt', 'title'] // Allow relevant attributes for <img>
		},
		// Remove all text nodes
		textFilter: function(text) {
			return ''; // Return empty string for all text content
		}
	});
}

module.exports = async function () {
	let rssUrl = "https://crashthearcade.tumblr.com/rss"; // Replace with your RSS feed URL

	try {
		let xml = await EleventyFetch(rssUrl, {
			duration: "1h", // Cache for 1 hour
			type: "text"
		});

		let feed = await parser.parseString(xml);

		return feed.items.slice(0, 6).map(item => {
			let description = item.content || item['content:encoded'] || item.description;

			// Extract only images from the description
			let imagesOnly = extractImagesOnly(description);

			return {
				...item,
				pubDate: new Date(item.pubDate),
				description: imagesOnly // Use only images
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
