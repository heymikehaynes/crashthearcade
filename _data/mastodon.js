/* latest posts from mastodon */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const parser = new Parser();

// Function to preserve text and images
function preserveTextAndImages(html) {
	return sanitizeHtml(html, {
		allowedTags: ['img', 'p', 'a', 'strong', 'em', 'br'], // Allow basic tags for text and formatting
		allowedAttributes: {
			'img': ['src', 'alt', 'title'], // Allow relevant attributes for <img>
			'a': ['href'] // Allow links
		}
	});
}

module.exports = async function () {
	let rssUrl = "https://social.lol/@crashthearcade.rss"; // Replace with your RSS feed URL

	try {
		let xml = await EleventyFetch(rssUrl, {
			duration: "1h", // Cache for 1 hour
			type: "text"
		});

		let feed = await parser.parseString(xml);

		return feed.items.slice(0, 1).map(item => {
			let description = item.content || item['content:encoded'] || item.description;

			// Preserve text and images from the description
			let cleanedDescription = preserveTextAndImages(description);

			return {
				...item,
				pubDate: new Date(item.pubDate),
				description: cleanedDescription // Use text and images
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
