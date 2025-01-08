import ProductTeaser from '@/components/ProductTeaser';
import type { Product } from '@/types/shop-types';
import { capitalize } from 'es-toolkit';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ category: string }>;
};
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const response = await fetch(
    `https://fakestoreapi.com/products/category/${category}`,
    {
      cache: 'force-cache',
    }
  );

  if (response.status === 404) {
    notFound();
  }

  const products = (await response.json()) as Product[];

  return (
    <div>
      <h1 className="capitalize">{decodeURI(category)}</h1>
      <div className="product-teasers grid">
        {products.map((product) => (
          <ProductTeaser key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;

  return {
    title: decodeURI(category).split(' ').map(capitalize).join(' '),
  };
}
