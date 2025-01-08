import BlogTeaserRest from '@/components/Blog/BlogPostRest';
import type { BlogPostRest } from '@/types/blog-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
};

/* https://nextjs.org/docs/basic-features/environment-variables
Achtung: process.env ist kein normales Objekt, Destructuring
funktioniert nicht (immer), besser process.env.KEY ausschreiben! 
Achtung: Werte stehen manchmal erst nach Neustart des Servers bzw.
dev-Prozesses zur Verfügung.
*/
const WP_REST_BASE = process.env.WP_REST_BASE;

export default async function BlogPage() {
  /* Anzahl an Sekunden, die die Antwort im Cache bleiben soll.
      Achtung: Die erste Anfrage nach dieser Zeit erhält noch den
      gespeicherten Wert, gleichzeit wird dann ein neuen Wert
      geladen, der beim folgenden Aufruf verwendet wird.
      Wenn revalidate genutzt wird, soll nicht zusätzlich 
      cache: 'force-cache' gesetzt werden.
      */
  const response = await fetch(`${WP_REST_BASE}/posts`, {
    next: {
      revalidate: 600,
    },
  });

  const posts = (await response.json()) as BlogPostRest[];

  return (
    <>
      <h1>Blog</h1>
      {posts.map((post) => (
        <BlogTeaserRest key={post.id} {...post} />
      ))}
    </>
  );
}
