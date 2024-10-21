---
layout: layouts/base.njk
permalink: /now/
eleventyNavigation:
  key: Now
---

# Now

#### What I've been up to as of October 21st, 2024. This page is inspired by Derek Sivers' project, [nownownow.com](https://nownownow.com/about).

{%- include 'now-life.md' -%}

{%- include 'now-fun.md' -%}

<div class="now-block">
	{%- include 'now.njk' -%}
</div>

<div class="pixelfed-block">
	<h2>Camera roll</h2>
	{%- include 'pixelfed.njk' -%}
	<div class="more-button-style"><a href="https://pixelfed.social/@crashthearcade">More »</a></div>
</div>
