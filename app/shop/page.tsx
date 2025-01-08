import ProductTeaser from '@/components/ProductTeaser';
import type { Product } from '@/types/shop-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Die besten Preise',
};

/* Server-Komponenten können asynchron sein */
export default async function ShopPage() {
  /* Seit Next 14 werden fetch-Anfrage nicht per default gecached,
	man muss den Cache aktiv anschalten.
	https://nextjs.org/docs/app/api-reference/functions/fetch */
  const response = await fetch('https://fakestoreapi.com/products', {
    cache: 'force-cache',
  });

  const products = (await response.json()) as Product[];

  return (
    <div>
      <h1>Shop</h1>
      <div className="product-teasers grid">
        {/* Hier für jeden Eintrag in products eine ProductTeaser-Komponente
				darstellen. */}
        {products.map((product) => (
          <ProductTeaser key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
