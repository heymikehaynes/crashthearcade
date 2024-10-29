const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const parser = new Parser();

// Function to preserve basic text formatting (images handled separately)
function preserveTextAndLinks(html) {
	// Regular expression to find URLs
	const urlRegex = /(https?:\/\/[^\s]+)/g;

	// Replace URLs in plain text with HTML anchor tags
	let linkedHtml = html.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);

	return sanitizeHtml(linkedHtml, {
		allowedTags: ['p', 'a', 'strong', 'em', 'br'], // Allow basic formatting
		allowedAttributes: {
			'a': ['href', 'target', 'rel'] // Allow links with attributes
		},
		allowedSchemes: ['http', 'https'] // Allow standard protocols
	});
}

module.exports = async function () {
	let rssUrl = "https://bsky.app/profile/crashthearcade.com/rss/";

	try {
		// Fetch RSS feed using EleventyFetch
		let xml = await EleventyFetch(rssUrl, {
			duration: "1h", // Cache for 1 hour
			type: "text"
		});

		// Parse the fetched XML
		let feed = await parser.parseString(xml);

		// Process feed items
		return feed.items.slice(0, 1).map(item => {
			let description = item.content || item['content:encoded'] || item.description;
			let cleanedDescription = preserveTextAndLinks(description);

			// Extract image from media:content or other fields
			let mediaContent = item['media:content'] || item['mediaContent'] || null;
			let imageUrl = mediaContent && mediaContent[0] && mediaContent[0].$.url ? mediaContent[0].$.url : null;

			return {
				...item,
				pubDate: new Date(item.pubDate),
				description: cleanedDescription, // Sanitized description without image tags
				imageUrl // Image URL extracted separately
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
