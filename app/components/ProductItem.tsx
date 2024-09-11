import useCartState from '@/utils/state/useCartState';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getLink } from 'visio-cms-lib';
import { getParams } from 'visio-cms-lib/utils';
import ProductQuickView from './ProductQuckView';

export type ProductColor = {
  name: string;
  colorBg: string;
};

export type Product = {
  id: number;
  name: string;
  availableColors: ProductColor[];
  price: number;
  href: string;
  imageSrc: string;
  imageAlt: string;
  images: { src: string; altText: string; color: string }[];
};

export default function ProductItem({ product }: { product: Product }) {
  const { locale } = getParams<{ locale: string }>();
  const { addToCart } = useCartState();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group relative">
        <div className="h-56 w-full overflow-hidden relative rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
          <Image
            alt={product.imageAlt}
            src={product.imageSrc}
            className="h-full w-full object-cover object-center"
            fill
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700 truncate">
          <Link href={getLink(`/${locale}/${product.href}`)}>
            <span className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <ul role="list" className="mt-auto flex items-center justify-start space-x-3 pt-6">
          {product.availableColors.map((color) => (
            <li
              key={color.name}
              style={{ backgroundColor: color.colorBg }}
              className="h-4 w-4 rounded-full border border-black border-opacity-10"
            >
              <span className="sr-only">{color.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm font-bold  text-gray-900">$ {product.price}</p>
        <div className="mt-6">
          <button
            onClick={() => {
              if (product.availableColors.length > 1) {
                setOpen(true);
              } else {
                addToCart({ id: product.id, qty: 1, color: product.availableColors[0].name });
              }
            }}
            className="relative w-full flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            Add to bag<span className="sr-only">, {product.name}</span>
          </button>
        </div>
      </div>
      <ProductQuickView product={product} key={product.id} open={open} setOpen={setOpen} />
    </>
  );
}
