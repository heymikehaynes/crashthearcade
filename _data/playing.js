/* latest book from reeder (RSS version) */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function () {
	let rssFeedUrl = "https://raindrop.io/collection/46077085/feed"; // Replace with your RSS feed URL

	try {
		// Fetch the RSS feed as plain text
		let rssFeed = await EleventyFetch(rssFeedUrl, {
			duration: "1h", // Cache for 1 hour
			type: "text"    // Fetch as text since it's an RSS feed
		});

		// Parse the RSS feed
		let feed = await parser.parseString(rssFeed);

		// Extract the latest item from the RSS feed
		return feed.items.slice(0, 1).map(item => {
			// Extract the image from media:content or enclosure
			let imageUrl = item.enclosure?.url || item['media:content']?.url;

			// Fallback if no image is found
			if (!imageUrl) {
				imageUrl = ''; // Provide a default or empty string
			}

			// Remove year in parentheses from the title (e.g., "(2024)")
			let title = item.title.replace(/\(\d{4}\)/, '').trim();

			return {
				title: title, // Return the cleaned title
				link: item.link, // Use the link field from the RSS item
				pubDate: new Date(item.pubDate), // Convert the publication date
				description: item.contentSnippet || item.description || '', // Use a fallback for the description
				image: imageUrl // Return the extracted image URL
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
