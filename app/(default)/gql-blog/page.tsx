import BlogTeaserGql from '@/components/Blog/BlogPostGql';

import type { BlogPostTeaserGql } from '@/types/blog-types';
import request, { gql } from 'graphql-request';
import type { Metadata } from 'next';

/* Erneuert den Cache für diese Route alle 600 Sekunden,
als Alternative zur revalidate-Option in fetch. Wenn Daten 
wie hier nicht mit fetch, sondern mit request geladen werden. */
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Blog',
};

const WP_GRAPHQL_BASE = process.env.WP_GRAPHQL_BASE!;

export default async function GqlBlogPage() {
  const query = gql`
    {
      posts {
        nodes {
          slug
          title
          date
          excerpt
        }
      }
    }
  `;

  const response = (await request(WP_GRAPHQL_BASE, query)) as {
    posts: { nodes: BlogPostTeaserGql[] };
  };

  return (
    <>
      <h1>Blog</h1>
      {response.posts.nodes.map((post) => (
        <BlogTeaserGql key={post.slug} {...post} />
      ))}
    </>
  );
}
