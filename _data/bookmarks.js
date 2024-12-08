const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const parser = new Parser();

// Function to extract only images
function extractImagesOnly(html) {
		let sanitizedHtml = sanitizeHtml(html, {
				allowedTags: ['img'], // Allow only <img> tags
				allowedAttributes: {
						'img': ['src', 'alt', 'title'] // Allow relevant attributes for <img>
				}
		});

		// Extract the first <img> tag's src
		let match = sanitizedHtml.match(/<img[^>]+src="([^"]+)"/);
		if (match && match[1]) {
				return match[1]; // Return the image URL
		}

		return null; // Return null if no image is found
}

module.exports = async function () {
		let rssUrl = "https://bg.raindrop.io/rss/public/50048104"; // Replace with your RSS feed URL

		try {
				let xml = await EleventyFetch(rssUrl, {
						duration: "1h", // Cache for 1 hour
						type: "text"
				});

				let feed = await parser.parseString(xml);

				return feed.items.slice(0, 6).map(item => {
						let description = item.content || item['content:encoded'] || item.description;

						// Extract only the image URL from the description
						let imageUrl = extractImagesOnly(description);

						return {
								...item,
								pubDate: new Date(item.pubDate),
								image: imageUrl, // Add image URL as a separate field
								description: sanitizeHtml(description, {
										allowedTags: [], // Strip all HTML tags
										allowedAttributes: {} // Strip all attributes
								}) // Use plain text for description
						};
				});
		} catch (error) {
				console.error("Error fetching RSS feed:", error);
				return [];
		}
};
