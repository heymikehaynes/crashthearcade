const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const fs = require("fs-extra");
const path = require("path");
const imageDownloader = require("image-downloader");
const sharp = require("sharp"); // For image optimization
const parser = new Parser();

// Function to extract only images
function extractImagesOnly(html) {
	return sanitizeHtml(html, {
		allowedTags: ['img'],
		allowedAttributes: {
			'img': ['src', 'alt', 'title']
		},
		textFilter: function(text) {
			return ''; // Remove all text content
		}
	});
}

// Function to download images locally and optimize them
async function downloadAndOptimizeImage(imageUrl, postTitle) {
		try {
				// Save images in the public/img/reeder folder
				const imageDirectory = path.join(__dirname, "..", "public", "img", "tumblr");
				await fs.ensureDir(imageDirectory); // Ensure the directory exists

				// Create a safe filename by replacing invalid characters
				const safeTitle = (postTitle || "default").replace(/[^a-zA-Z0-9]/g, "_"); // Default title if undefined
				const fileName = `${safeTitle}_${path.basename(imageUrl)}`;
				const filePath = path.join(imageDirectory, fileName);

				// Download the image if it doesn't exist
				if (!fs.existsSync(filePath)) {
						await imageDownloader.image({
								url: imageUrl,
								dest: filePath
						});

						// Optimize the image and save it with a different name
						const optimizedFilePath = path.join(imageDirectory, `optimized_${fileName}`); // Different output filename
						await sharp(filePath)
								.resize(800)
								.jpeg({ quality: 80 })
								.toFile(optimizedFilePath);

						// Return the optimized image path
						return `/img/bookmarks/optimized_${fileName}`; // Return the path of the optimized image
				}

				// Return the relative public path to the image
				return `/img/tumblr/${fileName}`;
		} catch (error) {
				console.error(`Error downloading or optimizing image: ${imageUrl}`, error);
				return null;
		}
}

module.exports = async function () {
	let rssUrl = "https://crashthearcade.tumblr.com/rss"; // Replace with your RSS feed URL

	try {
		let xml = await EleventyFetch(rssUrl, {
			duration: "1h", // Cache for 1 hour
			type: "text"
		});

		let feed = await parser.parseString(xml);

		// Process the feed items and download/optimize images
		const posts = await Promise.all(feed.items.slice(0, 4).map(async (item) => {
			let description = item.content || item['content:encoded'] || item.description;

			// Extract only images from the description
			let imagesOnlyHtml = extractImagesOnly(description);
			let imageUrlMatch = imagesOnlyHtml.match(/src="([^"]+)"/); // Extract the first image URL

			let localImageUrl = null;
			if (imageUrlMatch) {
				let imageUrl = imageUrlMatch[1];
				localImageUrl = await downloadAndOptimizeImage(imageUrl, item.title);
			}

			return {
				...item,
				pubDate: new Date(item.pubDate),
				imageUrl: localImageUrl, // Use locally downloaded image
				description: localImageUrl ? `<img src="${localImageUrl}" alt="${item.title}">` : "" // Use local image
			};
		}));

		return posts;
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
