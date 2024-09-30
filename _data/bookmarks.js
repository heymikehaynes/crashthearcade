/* displays bookmarks from reeder */

const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");
const cheerio = require("cheerio"); // Import Cheerio
const parser = new Parser(); // Create a new parser instance

module.exports = async function () {
		let jsonFeedUrl = "https://reederapp.net/qotk31U8S5GNHl5LIJOaGw.json"; // Replace with your JSON feed URL

		try {
				// Fetch the JSON feed
				let jsonFeed = await EleventyFetch(jsonFeedUrl, {
						duration: "1h", // Cache for one hour
						type: "json"    // Use "json" as the type for JSON feeds
				});

				// Map the feed items to extract the relevant fields
				return jsonFeed.items.slice(0, 10).map(item => {
						// Get the full description
						const fullDescription = item.content_html || item.content_text || item.summary || '';

						// Load the description into Cheerio for manipulation
						const $ = cheerio.load(fullDescription);

						// Optionally, you can remove unwanted tags or elements here
						// For example, if you want to remove <p> tags but keep their content
						$('p').unwrap(); // This removes the <p> tags but keeps the text inside

						// If you want to truncate the description to a certain number of characters
						const truncatedDescription = $('body').text().slice(0, 100) + '...'; // Truncate to 100 characters

						// Render the HTML for description
						const htmlDescription = $.html(); // Get the modified HTML back

						return {
								title: item.title,
								link: item.url || item.link, // Ensure the correct link field is used
								pubDate: new Date(item.date_published || item.date), // Handle date fields appropriately
								description: htmlDescription || truncatedDescription // Use the manipulated description
						};
				});
		} catch (error) {
				console.error("Error fetching JSON feed:", error);
				return [];
		}
};
