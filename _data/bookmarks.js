/* displays bookmarks from reeder */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

const maxDescriptionLength = 100; // Set your desired length for truncation

// Function to truncate descriptions
function truncateString(str, maxLength) {
		if (str.length <= maxLength) {
				return str; // Return the original string if it's short enough
		}
		return str.slice(0, maxLength) + '...'; // Truncate and add ellipsis
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
						const fullDescription = item.content_html || item.content_text || item.summary || ''; // Get the full description
						const truncatedDescription = truncateString(fullDescription, maxDescriptionLength); // Truncate it

						return {
								title: item.title,
								link: item.url || item.link, // Ensure the correct link field is used
								pubDate: new Date(item.date_published || item.date), // Handle date fields appropriately
								description: truncatedDescription // Use the truncated description
						};
				});
		} catch (error) {
				console.error("Error fetching JSON feed:", error);
				return [];
		}
};
