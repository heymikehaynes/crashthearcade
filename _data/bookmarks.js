const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	// Your Linkding API base URL and endpoint
	const linkdingApiBaseUrl = "https://your-linkding-url/api/bookmarks/";
	const apiKey = process.env.LINKDING_API; // Use the Vercel environment variable

	try {
		// Append the shared filter to the API URL
		const apiUrl = `${linkdingApiBaseUrl}?shared=true`;

		// Fetch the bookmarks data using EleventyFetch
		let bookmarks = await EleventyFetch(apiUrl, {
			duration: "1h", // Cache for 1 hour
			type: "json",   // Use JSON as the response type
			fetchOptions: {
				headers: {
					Authorization: `Token ${apiKey}`, // Pass the API key as a Bearer token
					"Content-Type": "application/json"
				}
			}
		});

		// Transform the data into the desired format
		return bookmarks.results.map(bookmark => {
			return {
				title: bookmark.title,
				link: bookmark.url,
				description: bookmark.description || '', // Optional description
				dateAdded: new Date(bookmark.date_added), // Format date
				tags: bookmark.tag_names || [] // Extract tags if needed
			};
		});
	} catch (error) {
		console.error("Error fetching shared bookmarks from Linkding:", error);
		return [];
	}
};
