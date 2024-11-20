---
layout: layouts/base.njk
permalink: /now/
slug: now
type: page
eleventyNavigation:
  key: Right now
  order: 3
---

# Right now

#### What I've been up to as of November 19th, 2024. This page is inspired by Derek Sivers' project, [nownownow.com](https://nownownow.com/about).

* I've made some general changes to my own personal software stack lately that I'm pretty happy with:
	* Spun up my own [FreshRSS](https://www.freshrss.org/) server and switched back to traditional RSS from the new version of Reeder.
	* Set up my own [PDS](https://github.com/bluesky-social/pds) for Bluesky.
	* Moved my [bookmarks](/#bookmarks-home) feed from Reeder to a self-hosted [Linkding](https://linkding.link/) setup and used the API to generate the list of my site.
	* ~~My reading and playing feeds (below) are still powered by Reeder and I want to move away from that but I'm not entirely sure how yet. The API for Linkding isn't playing nice with tags.~~ Done! Now using Goodreads RSS feed and a third-party API for Backloggd!
* I recently spent a week in Vancouver for a work trip. It was my first time there and I loved it. Staying in the downtown area was great—having everything within walking distance made exploring easy and enjoyable. It was nice to finally meet my teammates in person.

<div class="now-block">
	{%- include 'now.njk' -%}
</div>

<div class="now-media-block">
	<div class="tumblr-block-header">
		<img src="/img/card-badge-images.png">
		<h1>Camera roll</h1>
	</div>
	{%- include 'pixelfed.njk' -%}
	<div class="more-button-style"><a href="https://pixelfed.social/@crashthearcade">More »</a></div>
</div>
