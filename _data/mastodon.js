const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const sanitizeHtml = require("sanitize-html");
const parser = new Parser();

function preserveTextAndLinks(html) {
	return sanitizeHtml(html, {
		allowedTags: ['p', 'a', 'strong', 'em', 'br', 'img'],
		allowedAttributes: {
			'a': ['href'],
			'img': ['src', 'alt']
		},
		transformTags: {
			'a': (tagName, attribs) => {
				const MAX_LINK_TEXT_LENGTH = 30;
				let text = attribs.href;

				if (text.length > MAX_LINK_TEXT_LENGTH) {
					text = text.substring(0, MAX_LINK_TEXT_LENGTH) + '...';
				}

				return {
					tagName: 'a',
					attribs,
					text: text
				};
			}
		}
	});
}

module.exports = async function () {
	let rssUrl = "https://social.lol/@crashthearcade.rss";

	try {
		let xml = await EleventyFetch(rssUrl, {
			duration: "1h",
			type: "text"
		});

		let feed = await parser.parseString(xml);

		return feed.items.slice(0, 1).map(item => {
			let description = item.content || item['content:encoded'] || item.description;
			let cleanedDescription = preserveTextAndLinks(description);

			// Directly assign image URL if it exists in media:content
			let imageUrl = item['media:content']?.$.url || null;

			return {
				...item,
				pubDate: new Date(item.pubDate),
				description: cleanedDescription,
				imageUrl
			};
		});
	} catch (error) {
		console.error("Error fetching RSS feed:", error);
		return [];
	}
};
