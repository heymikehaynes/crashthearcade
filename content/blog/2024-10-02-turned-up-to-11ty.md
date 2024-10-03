---
title: Turned up to 11ty
date: 2024-10-02
tags:
- 11ty
---

Just a quick update today: I’ve rebuilt my site using [11ty](https://11ty.dev). Sorry in advance if you’re seeing duplicate entries in your RSS reader.

Over the years, I’ve tried building *something* with 11ty a couple of times, but I always hit a roadblock and quickly switched back to Jekyll, WordPress, or something else I was more familiar with. This time, maybe inspired by the [recent drama](https://crashthearcade.com/blog/2024-09-28-thoughts-wordpress-drama/) in the WordPress community, I pushed through and made a thing! I even encountered a few build errors along the way, but I managed to fix them!

One particularly interesting aspect of the site is that Reeder powers several of the feeds it uses, like on the [Bookmarks](/bookmarks) page for example. After fetching the feed, it uses a web hook to periodically rebuild the site and ensure its up-to-date. This is great since I’ve been moving more and more of the content I follow and read into the app.

I'm going to try adding CMS support at some point with [CloudCannon](https://cloudcannon.com/) but, for now, I'm pretty happy with everything.
