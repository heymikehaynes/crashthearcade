module.exports = async function () {
	const fetch = (await import("node-fetch")).default;

	const API_BASE_URL = "https://saved.forthaynes.com/api/bookmarks/";
	const API_KEY = process.env.LINKDING_API; // Using Vercel's environment variable

	if (!API_KEY) {
		console.error("Missing LINKDING_API environment variable");
		return [];
	}

	try {
		const response = await fetch(API_BASE_URL, {
			headers: {
				"Authorization": `Token ${API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.error(`Failed to fetch bookmarks: ${response.statusText}`);
			return [];
		}

		const data = await response.json();

		// Format the data if needed
		return data.results.map((bookmark) => ({
			title: bookmark.title,
			url: bookmark.url,
			description: bookmark.description,
			tags: bookmark.tag_names,
		}));
	} catch (error) {
		console.error("Error fetching bookmarks:", error);
		return [];
	}
};
