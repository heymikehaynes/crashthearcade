const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const parser = new Parser({
	customFields: {
		item: ['book_large_image_url', 'book_description']
	}
});

module.exports = async function () {
	let rssFeedUrl = "https://www.goodreads.com/review/list_rss/178761663?key=Z5qQc05sFA77za_1MU9jbVgnvQHKDLBKE3BqjnczHN0ccfY0&shelf=favourites"; // Replace with your RSS feed URL

	try {
		// Fetch the RSS feed as plain text
		let rssFeed = await EleventyFetch(rssFeedUrl, {
			duration: "1h", // Cache for 1 hour
			type: "text"    // Fetch as text since it's an RSS feed
		});

		// Parse the RSS feed
		let feed = await parser.parseString(rssFeed);

		// Extract the latest item from the RSS feed
		return feed.items.slice(0, 5).map(item => {
			// Extract custom image field
			let imageUrl = item.book_large_image_url || '/img/no-cover.png'; // Default if no image is found

			// Remove year in parentheses from the title (e.g., "(2024)")
			let title = item.title.replace(/\(\d{4}\)/, '').trim();

			return {
				title: title, // Return the cleaned title
				link: item.link, // Use the link field from the RSS item
				pubDate: new Date(item.pubDate), // Convert the publication date
				description: item.book_description || item.contentSnippet || item.description || '', // Use book description or fallback
				image: imageUrl // Return the extracted `book_large_image_url`
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
