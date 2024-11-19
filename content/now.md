---
layout: layouts/base.njk
permalink: /now/
slug: now
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
	* My reading and playing feeds (below) are still powered by Reeder and I want to move away from that but I'm not entirely sure how yet. The API for Linkding isn't playing nice with tags.
* I’ve finished over ~~150~~ [240 books](https://www.goodreads.com/user_challenges/54484570) (mostly manga) this year but started slowing down now that I’ve run out of stuff to read. On a related note, I desperately want to move away from Goodreads but there's no alternative that offers a feed or API I can use to add that data to my site.
* I recently spent a week in Vancouver for a work trip. It was my first time visiting the city, and I loved it. Staying in the downtown area was great—having everything within walking distance made exploring easy and enjoyable. Meeting my teammates in person after six months of remote work was the highlight for sure.

## Books and video games

<div class="now-block">
	{%- include 'now.njk' -%}
</div>

<div class="pixelfed-block">
	<h2>Recent media</h2>
	{%- include 'pixelfed.njk' -%}
	<div class="more-button-style"><a href="https://pixelfed.social/@crashthearcade">More »</a></div>
</div>
