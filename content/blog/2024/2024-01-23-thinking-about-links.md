---
title: Some thoughts on saving links
date: 2024-01-23T00:00:00Z
tags:
  - Blogging
---
Seeing [Andy Bell](https://piccalil.li/blog/piccalilli-links/) and [Sophie Koonin’s](https://localghost.dev/blog/automated-weekly-links-posts-with-raindrop-io-and-eleventy/) posts about their link post setups made me think I’ve been doing links wrong for a while now. I actually have two post types for sharing links that I often use interchangeably, “posts” and “links”.

So, I decided to consolidate the two and start using links in the more traditional sense to, you know, link to things.

Some changes to my link workflow:

* On my site, the title of the link post already goes to the external link of the post itself, not to a post page on my site. More on that in a sec.
* I already had a custom bookmarklet that let me capture the title, link, and a highlight from a page, but I’ve added the ability to post right from the pop-up, not just make a draft.
* I added some custom filters to Jan Boddez’s [Share on Mastodon plugin](https://jan.boddez.net/wordpress/share-on-mastodon) that formats links differently than posts or notes when shared to Mastodon. In the case of links:
  * They get a \#Link hashtag appended to them.
  * The URL that gets shared to Mastodon is the original link to the post, the external one I mentioned above, not one to my website. That always felt confusing and added complexity to the whole experience.
* I’ve added a top-level menu item on my site that will let people quickly browse the links I’ve shared.

I’m much happier with this. You can already see the results of this in the <s>post</s> I shared by Matt Birchler about how he built his new membership program in Ghost. <s>Here’s the Mastodon post</s>.

I’ve rethought this approach quite a bit. I’m not sure sharing to Mastodon was the best thing to do, but I have built a dedicated [bookmarks page](/bookmarks/) for everything I save/share.
