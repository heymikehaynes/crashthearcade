/* latest book from reeder (RSS version with images in description) */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const parser = new Parser();
const { JSDOM } = require("jsdom"); // For parsing HTML

module.exports = async function () {
	let rssFeedUrl = "https://bg.raindrop.io/rss/public/46077244"; // Replace with your RSS feed URL

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
			// Parse the <description> field to extract the image URL
			let descriptionHtml = item.description || '';
			let imageUrl = '';

			// Use JSDOM to parse the HTML
			const dom = new JSDOM(descriptionHtml);
			let imgElement = dom.window.document.querySelector("img");
			if (imgElement) {
				imageUrl = imgElement.src;
			}

			// Remove year in parentheses from the title (e.g., "(2024)")
			let title = item.title.replace(/\(\d{4}\)/, '').trim();

			return {
				title: title, // Return the cleaned title
				link: item.link, // Use the link field from the RSS item
				pubDate: new Date(item.pubDate), // Convert the publication date
				description: dom.window.document.body.textContent.trim(), // Plain text from description
				image: imageUrl // Return the extracted image URL
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
