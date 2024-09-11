'use client';

import { useMemo } from 'react';
import { Radio, RadioGroup, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Block } from 'visio-cms-lib/types';
import { getParams, getProjectMode } from 'visio-cms-lib/utils';
import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';
import useSetQueryParams from '@/utils/hooks/useSetQueryParams';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/app/components/Skeleton';
import useCartState from '@/utils/state/useCartState';
import Image from 'next/image';

type Image = {
  id: number;
  name: string;
  src: string;
  alt: string;
};

type Color = {
  name: string;
  bgColor: string;
};

type ProductDetails = {
  name: string;
  price: string;
  images: Image[];
  colors: Color[];
  description: string;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const initialProduct = {
  id: 1,
  name: 'Zip Tote Basket',
  price: '$140',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    // More images...
  ],
  colors: [
    { name: 'white', bgColor: '#FFF' },
    { name: 'Black', bgColor: '#000' },
  ],
  description: `
      <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
    `,
  
};

const ProductDetails: Block = () => {
  const { id } = getParams<{ id: string }>();
  const supabase = createClient();
  const { setQueryParam } = useSetQueryParams();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get('color');
  const isBuilderMode = getProjectMode() === 'BUILDER';
  const { addToCart } = useCartState();

  const { data,  isLoading } = useSWR(`/api/product/${id}/${selectedColor}`, async () => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  });

  let product = useMemo(() => {
        if (!data) {
          return null;
        }
        const photos = data.photos as { id: number; src: string; altText: string; color: string }[];
        const colors = data.available_colors as { id: number; name: string; colorBg: string }[];

        return {
          id: data.id,
          name: data.name,
          price: `$${data.price}`,
          images: photos
            .filter((photo) => photo.color == (selectedColor || colors[0]?.name))
            ?.map((image) => ({
              id: image.id,
              name: image.altText,
              src: image.src,
              alt: image.altText,
            })),
          colors: colors.map((color) => ({
            name: color.name,
            bgColor: color.colorBg,
          })),
          description: data.description,
        };
      }, [data, selectedColor]);

  if (isBuilderMode) {
    product = initialProduct;
  }

  if (isLoading) {
    return (
      <div className="bg-white pb-4">
        <div className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <div>
              <Skeleton className="h-[500px] bg-slate-100" />
              <div className="grid grid-cols-4 gap-4 mt-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20  bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Skeleton className=" bg-slate-100  h-[60px] mb-3" />
              <Skeleton className=" bg-slate-100  h-[200px]" />

              <div className="flex gap-4 my-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-10 rounded-[100%] bg-slate-100" />
                ))}
              </div>

              <Skeleton className=" bg-slate-100  h-[80px] mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white pb-4">
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <TabGroup className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <TabList className="grid grid-cols-4 gap-6">
                  {product.images.map((image) => (
                    <Tab
                      key={image.id}
                      className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      <span className="sr-only">{image.name}</span>
                      <span className="absolute inset-0 overflow-hidden rounded-md">
                        <Image unoptimized fill alt="" src={image.src} className="h-full w-full object-cover object-center" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                      />
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels className="aspect-h-1 aspect-w-1 w-full">
                {product.images.map((image) => (
                  <TabPanel key={image.id}>
                    <Image
                      fill
                      unoptimized
                      alt={image.alt}
                      src={image.src}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">{product.price}</p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="space-y-6 text-base text-gray-700"
                />
              </div>

              <form className="mt-6">
                {/* Colors */}
                <div>
                  <h3 className="text-sm text-gray-600">Color</h3>

                  <fieldset aria-label="Choose a color" className="mt-2">
                    <RadioGroup
                      value={selectedColor || product.colors[0]?.name}
                      onChange={(value) => {
                        setQueryParam('color', value);
                      }}
                      className="flex items-center space-x-3"
                    >
                      {product.colors.map((color) => (
                        <Radio
                          key={color.name}
                          value={color?.name}
                          aria-label={color.name}
                          style={{ outlineColor: color.bgColor, outlineOffset: '0.125rem' }}
                          className={classNames(
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            style={{ backgroundColor: color.bgColor }}
                            className={classNames('h-8 w-8 rounded-full border border-black border-opacity-10')}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                <div className="mt-10 flex">
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({ id: product.id, qty: 1, color: selectedColor || product.colors[0]?.name })
                    }
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    Add to bag
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

ProductDetails.Schema = {
  name: 'Product Details',
  id: 'product',
  group: 'Ecommerce',
  defaultPropValues: {},
  sideEditingProps: [],
};

export default ProductDetails;
