// src/pages/rss.xml.js
import rss from "@astrojs/rss";

let fetchedPosts = await import.meta.globEager(`../pages/posts/*.md`);

let ary = [];

for (let postkey in fetchedPosts) {
  if (
    fetchedPosts[postkey].frontmatter.pubDate &&
    fetchedPosts[postkey].frontmatter.title
  ) {
    let post = fetchedPosts[postkey];
    let awaitedPost = await post.default();
    ary.push({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      pubDate: post.frontmatter.pubDate,
      slug: post.url,
      content: awaitedPost.metadata.source,
    });
  }
}

// Filter out draft posts & sort with the latest pubDate at the top.
let posts = ary
  .filter((post) => !post.draft)
  .sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()
  );

export const get = () =>
  rss({
    title: "Some title",
    description: "Some description",
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      //// For my posts structure ////
      link: post.url,
      title: post.title,
      description: post.description,
      pubDate: post.pubDate,
      customData: `<language>en-us</language>`,
    })),
  });
