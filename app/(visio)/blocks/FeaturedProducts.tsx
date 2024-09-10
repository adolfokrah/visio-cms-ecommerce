/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block } from 'visio-cms-lib/types';
import Text from 'visio-cms-lib/Text';
import { createClient } from '@/utils/supabase/client';
import { useMemo } from 'react';
import { getLink } from 'visio-cms-lib';
import Link from 'next/link';
import { Skeleton } from '@/app/components/Skeleton';
import useSWR from 'swr';
import { Product, ProductColor } from '@/app/components/ProductItem';
import ProductItem from '@/app/components/ProductItem';

interface FeaturedProductProps {
  title: string;
  pageBlockId?: string;
  cta: {
    show: boolean;
    title: string;
    href: string;
  };
}

const FeaturedProducts: Block<FeaturedProductProps> = ({ title, cta, pageBlockId = '' }) => {
  const supabase = createClient();
  const { data, error, isLoading } = useSWR('/api/featuredProducts', async () => {
    const { data, error } = await supabase.from('products').select('*').eq('is_featured', true);
    if (error) {
      throw error;
    }
    return data;
  });

  const products = useMemo(
    () =>
      data?.map(
        (product: any) =>
          ({
            id: product.id,
            name: product.name,
            availableColors: product.available_colors as ProductColor[],
            price: product.price,
            href: `/products/${product.id}`,
            imageSrc: product.photos?.[0].src,
            imageAlt: product.photos?.[0].alt,
          }) as Product,
      ),
    [data],
  );

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8 ">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-72 relative bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!products) return null;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            <Text defaultValue={title} pageBlockId={pageBlockId} propName="title" />
          </h2>
          {cta.show && (
            <Link
              href={getLink(cta.href)}
              className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block inline-block"
            >
              <Text defaultValue={cta.title} pageBlockId={pageBlockId} propName="ctaText" />
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        {cta.show && (
          <div className="mt-8 text-sm md:hidden">
            <Link href={cta.href} className="font-medium text-indigo-600 hover:text-indigo-500 inline-block">
              <Text defaultValue={cta.title} pageBlockId={pageBlockId} propName="ctaText" />
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

FeaturedProducts.Schema = {
  name: 'Featured Products',
  id: 'featuredProducts',
  group: 'Ecommerce',
  defaultPropValues: {
    cta: {
      show: true,
      title: 'Shop All',
      href: '/products',
    },
    title: 'Featured Products',
  },
  sideEditingProps: [
    {
      propName: 'cta.show',
      type: 'switch',
      label: 'Show CTA',
      onLabel: 'Yes',
      offLabel: 'No',
    },
  ],
};

export default FeaturedProducts;
