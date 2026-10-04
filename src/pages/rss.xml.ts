import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort(
    (a, b) => b.data.datum.getTime() - a.data.datum.getTime(),
  );

  return rss({
    title: 'Mein Fotoalbum',
    description: 'Eine Sammlung persönlicher Momente in Bildern festgehalten.',
    site: context.site || '',
    items: sortedPosts.map((post) => ({
      title: `Beitrag vom ${post.data.datum.toLocaleDateString('de-DE')}`,
      pubDate: post.data.datum,
      description: post.body ? post.body.substring(0, 200) : 'Neuer Beitrag',
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>de-de</language>`,
  });
}
