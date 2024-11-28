const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const parser = new Parser();

// Function to extract the first image URL from HTML
function extractImageSrc(html) {
		let sanitizedHtml = sanitizeHtml(html, {
				allowedTags: ['img'], // Allow only <img> tags
				allowedAttributes: {
						'img': ['src'] // Allow only the src attribute for <img>
				}
		});

		// Extract the first <img> tag's src
		let match = sanitizedHtml.match(/<img[^>]+src="([^"]+)"/);
		return match ? match[1] : null; // Return the image URL or null if not found
}

// Function to strip images and return plain text description
function stripImagesFromDescription(html) {
		return sanitizeHtml(html, {
				allowedTags: [], // Remove all tags
				allowedAttributes: {} // Remove all attributes
		});
}

module.exports = async function () {
		let rssUrl = "https://raindrop.io/collection/50066445/feed"; // Replace with your RSS feed URL

		try {
				let xml = await EleventyFetch(rssUrl, {
						duration: "1h", // Cache for 1 hour
						type: "text"
				});

				let feed = await parser.parseString(xml);

				return feed.items.slice(0, 8).map(item => {
						let description = item.content || item['content:encoded'] || item.description;

						// Extract the image URL from the description
						let imageUrl = extractImageSrc(description);

						// Strip images and retain plain text in the description
						let cleanDescription = stripImagesFromDescription(description);

						return {
								title: item.title || "Untitled", // Extract title
								pubDate: new Date(item.pubDate),
								image: imageUrl, // Extracted image URL
								description: cleanDescription // Plain text description
						};
				});
		} catch (error) {
				console.error("Error fetching RSS feed:", error);
				return [];
		}
};
