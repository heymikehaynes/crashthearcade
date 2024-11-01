const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
	const accessToken = "OCFT7I8RHfvP_9c_1vT0MKFi9_NVpBLtWmjUh3ljwBs"; // Replace with your actual access token
	const username = "crashthearcade"; // Your Mastodon username
	const apiUrl = `https://social.lol/api/v1/accounts/lookup?acct=${username}`;

	try {
		// Fetch user ID
		let userData = await EleventyFetch(apiUrl, {
			duration: "1h", // Cache response for 1 hour
			type: "json",
			fetchOptions: {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		});

		const userId = userData.id;

		// Fetch user posts
		const postsUrl = `https://social.lol/api/v1/accounts/${userId}/statuses`;
		let postsData = await EleventyFetch(postsUrl, {
			duration: "1h", // Cache response for 1 hour
			type: "json",
			fetchOptions: {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		});

		// Process posts to return the latest one
		return postsData.slice(0, 1).map(post => ({
			content: post.content,
			imageUrl: post.media_attachments.length > 0 ? post.media_attachments[0].url : null,
			pubDate: new Date(post.created_at),
			link: post.url
		}));
	} catch (error) {
		console.error("Error fetching Mastodon posts:", error);
		return [];
	}
};
