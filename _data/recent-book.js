require("dotenv").config(); // Load environment variables from .env file

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	const API_BASE_URL = "https://saved.crashthearcade.com/api/bookmarks/";
	const API_KEY = process.env.LINKDING_API;

	if (!API_KEY) {
		console.error("Missing LINKDING_API environment variable");
		return null;
	}

	try {
		// Fetch bookmarks from Linkding API
		const data = await EleventyFetch(API_BASE_URL, {
			duration: "1h", // Cache for 1 hour
			type: "json",
			fetchOptions: {
				headers: {
					"Authorization": `Token ${API_KEY}`,
					"Content-Type": "application/json",
				},
			},
		});

		// Filter bookmarks tagged as "reading"
		const readingBookmarks = data.results.filter((bookmark) =>
			bookmark.tag_names.includes("reading")
		);

		// Return the most recent bookmark
		if (readingBookmarks.length > 0) {
			const recentBook = readingBookmarks[0]; // Assume most recent first
			return {
				title: recentBook.title,
				image: recentBook.preview_image_url || recentBook.website_title_image || "/img/link-default-img.png",
				link: recentBook.url,
			};
		}

		return null; // No matching bookmarks
	} catch (error) {
		console.error("Error fetching recent book:", error);
		return null; // Return null on error
	}
};
