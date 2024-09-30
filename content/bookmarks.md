---
layout: layouts/base.njk
eleventyNavigation:
  key: Bookmarks
  order: 5
---

<div class="bookmarks-page-style">
{% for post in bookmarks %}
	<div class="bookmark-post">
		<time class="postlist-date" datetime="{{ post.pubDate | htmlDateString }}">
			» {{ post.pubDate | ordinalDate }}
		</time>
		<h1><a href="{{ post.link }}">{{ post.title }}</a></h1>
		<p>{{ post.description | safe }}</p>
	</div>
{% endfor %}
</div>
