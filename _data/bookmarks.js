/* displays bookmarks from reeder */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

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
			return {
				title: item.title,
				link: item.url || item.link, // Ensure the correct link field is used
				pubDate: new Date(item.date_published || item.date), // Handle date fields appropriately
				description: item.content_html || item.content_text || item.summary || ''
			};
		});
	} catch (error) {
		console.error("Error fetching JSON feed:", error);
		return [];
	}
};
