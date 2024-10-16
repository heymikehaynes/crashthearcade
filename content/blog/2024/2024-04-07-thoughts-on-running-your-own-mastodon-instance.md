---
title: Thoughts on running your own Mastodon instance
date: 2024-04-07T00:00:00Z
tags:
  - Social media
---
This past week, after much deliberation and [a post by Mike at Shellsharks](https://shellsharks.com/own-my-social), I decided to spin up my own Mastodon instance. I had some reservations about the whole thing but it’s been pretty painless so far. I wanted to go over some of the pros and cons for people considering going down this path.

## The bad(ish)

**Lack of local feed**

People often tell you that it doesn’t matter which Mastodon server you choose because they all talk to each other. This is false. Yes, they do talk to each other but a server’s local feed can make or break an experience for some people.

If you’re not familiar with the concept, Mastodon servers can talk to each other, unless your admin has decided that they don’t want you interacting with certain instances (more on that shortly), but the local feed (Live Feeds &gt; This Server) houses all the updates from the users of *that* instance and is a great place to connect with others.

When spinning up your own instance, assuming it’s just for you, your local feed will have your own posts and nothing else. I relied on local feeds for a longtime and am hopeful that we’ll see more third-party apps (Mammoth already does this) allow you to follow instances. In that case, this would be a non-issue.

**Running an instance costs money and time**

The next two sit in a bit of a grey area to be honest.

In many cases, people do not *pay* to use Mastodon. You **should** if you can, as most instances are run by volunteers that pay for resources with their own money, but I would assume the vast majority don’t. When you’re running your instance, it goes without saying, that it costs money to do so.

There are reasonable ways to do this that won’t break the bank. My instance is hosted at [mastohost](https://masto.host/) for example and I know DigitalOcean has [Mastodon droplets](https://marketplace.digitalocean.com/apps/mastodon) available for around $5–10 per month.

Depending on how you set up your instance, keeping it updated may be a thing you have to consider. Again, there are routes like mastohost that take care of the software stack for getting the instance up and running and keep everything up-to-date but it’s important to be aware of this.

**Performance may vary**

On a related note to cost, the performance of your Mastodon instance may vary from a larger one like Mastodon.social considering you’re likely a less powerful server setup. For example, on mastohost’s Moon plan, I noticed a bit of a delay when importing block lists, bookmarks, etc as server intensive tasks require a bit more horsepower. Besides that, it’s been top-notch but it’s something to consider.

## The good

**Less noise**

I mentioned the lack of local feed as a negative but I’ve actually found myself spending less time scrolling my feed because of the reduction in overall noise. I’m still connected to the people I want to see updates from but I don’t find myself instinctively bouncing around between my following and local feeds anymore. It’s been a nice change of pace to be honest.

**More control over your data**

When you sign up for an instance run by someone else, it adds at least one more pair of hands that potentially has access to your data. Personally, this isn’t a huge concern, given the things I post (trash, cringe, etc), but others may pay more attention to this and want something with fewer links in the chain as it were.

To that end, mastohost is run by one person named Hugo and has a very simple, transparent [privacy policy](https://masto.host/privacy/) available for customers that explains exactly what data is collected and what it’ll be used for. TLDR; it’s common sense stuff but I’d implore you to read it if you go that route.

**More choice**

I mentioned it earlier but some instance admins have taken it upon themselves to make decisions for users in regards to which other networks they’re able to interact with. Namely, Threads. I’m not going to get into the pros and cons of federating with Threads because ultimately it should be up to the individual to decide how to deal with that and running your own Mastodon instance gives you the opportunity to make that choice.

Running a Mastodon instance isn’t for everyone but it’s nice that services exist to offer it to the people that want it. If you’re considering running your own, I hope some of the points here were helpful in some way. If you have any questions about anything here, feel free to [get in touch](mailto:mike@crashthearcade.com).