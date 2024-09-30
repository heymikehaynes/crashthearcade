// _data/rss.js
const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function () {
	// Define the RSS feed URL
	let rssUrl = "https://crashthearcade.tumblr.com/rss"; // Replace with your RSS feed URL

	try {
		// Fetch RSS feed
		let xml = await EleventyFetch(rssUrl, {
			duration: "1d", // Cache the result for one day
			type: "text"
		});

		// Parse RSS feed
		let feed = await parser.parseString(xml);

		// Return the items you want (e.g., the latest 5 posts)
		return feed.items.slice(0, 5);
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
