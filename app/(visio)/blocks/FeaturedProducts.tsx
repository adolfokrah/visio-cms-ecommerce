"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block } from 'visio-cms-lib/types';
import Text from 'visio-cms-lib/Text';
import { getLink } from 'visio-cms-lib';
import Link from 'next/link';
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
  const products = []
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
            <ProductItem key={''} product={product} />
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
