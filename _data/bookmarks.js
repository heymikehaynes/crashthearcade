const EleventyFetch = require("@11ty/eleventy-fetch");
const fs = require("fs-extra");
const path = require("path");
const imageDownloader = require("image-downloader");

// Function to download images locally
async function downloadImage(imageUrl, postTitle) {
		try {
				// Save images in the public/img/bookmarks folder
				const imageDirectory = path.join(__dirname, "..", "public", "img", "bookmarks");
				await fs.ensureDir(imageDirectory); // Ensure the directory exists

				// Create a safe filename by replacing invalid characters and removing query parameters
				const safeTitle = postTitle.replace(/[^a-zA-Z0-9]/g, "_");
				const urlObj = new URL(imageUrl);
				const fileName = `${safeTitle}_${path.basename(urlObj.pathname)}`; // Only use the pathname for the filename
				const filePath = path.join(imageDirectory, fileName);

				// Download the image if it doesn't exist
				if (!fs.existsSync(filePath)) {
						await imageDownloader.image({
								url: imageUrl,
								dest: filePath
						});
				}

				// Return the relative public path to the image
				return `/img/bookmarks/${fileName}`;
		} catch (error) {
				console.error(`Error downloading image: ${imageUrl}`, error);
				return null;
		}
}

module.exports = async function () {
		const jsonFeedUrl = "https://reederapp.net/qotk31U8S5GNHl5LIJOaGw.json"; // Replace with your JSON feed URL

		try {
				// Fetch and parse the JSON feed
				const jsonFeed = await EleventyFetch(jsonFeedUrl, {
						duration: "1h", // Cache for 1 hour
						type: "json"    // Use "json" as the type for JSON feeds
				});

				// Extract the latest items from the JSON feed
				const posts = await Promise.all(jsonFeed.items.slice(0, 10).map(async (item) => {
						// Extract the image from the _reeder.media[0].url or image field
						let imageUrl = item._reeder?.media?.[0]?.url || item.image;

						// Fallback if no image is found
						if (!imageUrl) {
								imageUrl = item.attachments?.[0]?.url || ''; // Check attachments as a fallback
						}

						// Download the image if a valid URL is found
						let localImageUrl = null;
						if (imageUrl) {
								localImageUrl = await downloadImage(imageUrl, item.title);
						}

						// Remove year in parentheses from the title (e.g., "(2024)")
						let title = item.title.replace(/\(\d{4}\)/, '').trim();

						return {
								title: title, // Return the cleaned title
								link: item.url || item.link, // Ensure the correct link field is used
								pubDate: new Date(item.date_published || item.date), // Handle date fields appropriately
								description: item.content_text || '', // Use content_text as the description
								image: localImageUrl || imageUrl // Return the downloaded image URL or fallback
						};
				}));

				return posts;
		} catch (error) {
				console.error("Error fetching JSON feed:", error);
				return [];
		}
};
