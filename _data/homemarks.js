const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	let jsonFeedUrl = "https://reederapp.net/qotk31U8S5GNHl5LIJOaGw.json"; // Replace with your JSON feed URL

	try {
		// Fetch and parse the JSON feed
		let jsonFeed = await EleventyFetch(jsonFeedUrl, {
			duration: "1h", // Cache for 1 hour
			type: "json"    // Use "json" as the type for JSON feeds
		});

		// Extract the latest item from the JSON feed
		return jsonFeed.items.slice(0, 6).map(item => {
			// Extract the image from the _reeder.media[0].url or image field
			let imageUrl = item._reeder?.media?.[0]?.url || item.image;

			// Fallback if no image is found
			if (!imageUrl) {
				imageUrl = item.attachments?.[0]?.url || ''; // Check attachments as a fallback
			}

			// Remove year in parentheses from the title (e.g., "(2024)")
			let title = item.title.replace(/\(\d{4}\)/, '').trim();

			return {
				title: title, // Return the cleaned title
				link: item.url || item.link, // Ensure the correct link field is used
				pubDate: new Date(item.date_published || item.date), // Handle date fields appropriately
				description: item.content_text || '', // Use content_text as the description
				image: imageUrl // Return the extracted image URL
			};
		});
	} catch (error) {
		console.error("Error fetching JSON feed:", error);
		return [];
	}
};
