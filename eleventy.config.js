const { DateTime } = require("luxon");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css"
	});

	// Watch content images for the image pipeline
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Ordinal dates
	eleventyConfig.addFilter("ordinalDate", (dateObj) => {
		const date = DateTime.fromJSDate(dateObj);
		const day = date.day;
		let suffix = "th";
		if (day % 10 === 1 && day !== 11) {
			suffix = "st";
		} else if (day % 10 === 2 && day !== 12) {
			suffix = "nd";
		} else if (day % 10 === 3 && day !== 13) {
			suffix = "rd";
		}
		return `${date.toFormat("LLLL")} ${day}${suffix}, ${date.toFormat("yyyy")}`;
	});

	eleventyConfig.addFilter("excerpt", (content, length = 200) => {
		if (!content) return "";

		let excerpt = content.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
		return excerpt.length > length ? excerpt.slice(0, length) + "..." : excerpt;
	});

	// Create a collection for tags
	eleventyConfig.addCollection("tagList", function(collectionApi) {
		const tagSet = new Set();
		collectionApi.getAll().forEach(item => {
			if ("tags" in item.data) {
				let tags = item.data.tags;

				// handle tags as array or string
				if (typeof tags === "string") {
					tags = [tags];
				}

				// Filter out unwanted tags
				tags = tags.filter(tag => !["post", "all", "posts"].includes(tag));
				for (const tag of tags) {
					tagSet.add(tag);
				}
			}
		});

		return [...tagSet];
	});

	// Add filter to filter posts by tag
	eleventyConfig.addFilter("filterTag", (posts, tag) => {
		return posts.filter(post => post.data.tags && post.data.tags.includes(tag));
	});

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	})

	// Custom Collection: Group Posts by Year for Archive Page
	eleventyConfig.addCollection("postsByYear", function(collectionApi) {
			let posts = collectionApi.getFilteredByGlob("content/blog/**/*.md"); // Adjust path if needed
			let postsByYear = {};

			// Group posts by year
			posts.forEach(post => {
					let year = post.date.getFullYear();
					if (!postsByYear[year]) {
							postsByYear[year] = [];
					}
					postsByYear[year].push(post);
			});

			// Convert the postsByYear object into an array and sort by year in reverse order
			let sortedPostsByYear = Object.entries(postsByYear).sort((a, b) => b[0] - a[0]);

			// Sort posts within each year in reverse chronological order
			sortedPostsByYear = sortedPostsByYear.map(([year, posts]) => {
					posts.sort((a, b) => b.date - a.date);
					return { year, posts };
			});

			return sortedPostsByYear;
	});

	// Features to make your build faster (when you need them)

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",

		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		pathPrefix: "/",
	};
};
