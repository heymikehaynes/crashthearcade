/* displays bookmarks from reeder */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const cheerio = require("cheerio");
const parser = new Parser();

// Utility function to truncate text
function truncateText(text, maxLength) {
	// If the text is longer than the max length, truncate and add ellipsis
	if (text.length > maxLength) {
		return text.substring(0, maxLength) + " [...]";
	}
	return text;
}

module.exports = async function () {
	let jsonFeedUrl = "https://reederapp.net/qotk31U8S5GNHl5LIJOaGw.json"; // Replace with your JSON feed URL

	try {
		// Fetch the JSON feed
		let jsonFeed = await EleventyFetch(jsonFeedUrl, {
			duration: "1h", // Cache for one hour
			type: "json"    // Use "json" as the type for JSON feeds
		});

		// Map the feed items to extract the relevant fields
		return jsonFeed.items.slice(0, 10).map(item => {
			// Get the HTML content from the description
			let description = item.content_html || item.content_text || item.summary || '';

			// Use Cheerio to load the description HTML
			const $ = cheerio.load(description);

			// Remove all <img> tags
			$('img').remove();

			// Extract text from the cleaned HTML
			let cleanedDescription = $.text(); // Get only the text content without HTML tags

			// Truncate the cleaned description to 200 characters (adjust as needed)
			let truncatedDescription = truncateText(cleanedDescription, 240);

			return {
				title: item.title,
				link: item.url || item.link, // Ensure the correct link field is used
				pubDate: new Date(item.date_published || item.date), // Handle date fields appropriately
				description: truncatedDescription // Return the truncated description
			};
		});
	} catch (error) {
		console.error("Error fetching JSON feed:", error);
		return [];
	}
};
