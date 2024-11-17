require("dotenv").config(); // Load environment variables from .env file

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	const API_BASE_URL = "https://saved.crashthearcade.com/api/bookmarks/";
	const API_KEY = process.env.LINKDING_API; // Using Vercel's environment variable

	if (!API_KEY) {
		console.error("Missing LINKDING_API environment variable");
		return [];
	}

	try {
		// Use Eleventy Fetch to cache the API response
		const data = await EleventyFetch(API_BASE_URL, {
			duration: "1h", // Cache for 1 day
			type: "json", // Parse as JSON
			fetchOptions: {
				headers: {
					"Authorization": `Token ${API_KEY}`,
					"Content-Type": "application/json",
				},
			},
		});

		// Filter and map the bookmarks as needed
		const sharedBookmarks = data.results
			.filter((bookmark) => bookmark.shared) // Only include shared bookmarks
			.slice(0, 8); // Limit to 8 bookmarks

		return sharedBookmarks.map((bookmark) => ({
			link: bookmark.url, // URL for the bookmark
			image: bookmark.preview_image_url || bookmark.website_title_image || "/img/link-default-img.png", // Use preview image if available, fallback to title image or default
			pubDate: bookmark.date_added, // Publication date (ISO string)
			title: bookmark.title, // Bookmark title
		}));
	} catch (error) {
		console.error("Error fetching bookmarks:", error);
		return [];
	}
};
