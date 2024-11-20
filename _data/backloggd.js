const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	try {
		const url = "https://backloggd-fetch.vercel.app/user/crashthearcade";
		const response = await EleventyFetch(url, {
			duration: "1h", // Cache for 1 day
			type: "json",
		});

		if (response && response.content && Array.isArray(response.content.recentlyPlayed)) {
			return response.content.recentlyPlayed.slice(0, 1).map((game) => ({
				title: game.name,
				image: game.image,
			}));
		} else {
			console.error("No 'recentlyPlayed' data found in the response content.");
			return [];
		}
	} catch (error) {
		console.error("Error fetching Backloggd data:", error);
		return [];
	}
};
