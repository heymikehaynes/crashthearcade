const axios = require('axios');
const RSS = require('rss');

const LINKDING_API_URL = 'https://saved.crashthearcade.com/api/bookmarks';
const LINKDING_API_TOKEN = process.env.LINKDING_API; // Your API Token
const TAG = 'reading'; // Replace with your tag

(async () => {
	try {
		const response = await axios.get(LINKDING_API_URL, {
			headers: { Authorization: `Token ${LINKDING_API_TOKEN}` },
			params: { tags: TAG },
		});

		const feed = new RSS({
			title: `Bookmarks tagged with "${TAG}"`,
			description: 'RSS feed for tagged bookmarks in Linkding.',
			feed_url: `https://crashthearcade.com/linkding/rss/${TAG}.xml`,
			site_url: 'https://saved.crashthearcade.com',
		});

		response.data.results.forEach((bookmark) => {
			feed.item({
				title: bookmark.title,
				description: bookmark.description,
				url: bookmark.url,
				date: bookmark.date_added,
			});
		});

		console.log(feed.xml({ indent: true }));
	} catch (error) {
		console.error('Error fetching bookmarks:', error);
	}
})();
