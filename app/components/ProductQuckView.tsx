'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, Radio, RadioGroup } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { Product } from './ProductItem';
import Link from 'next/link';
import { getLink } from 'visio-cms-lib';
import useCartState from '@/utils/state/useCartState';
import Image from 'next/image';
import { getParams } from 'visio-cms-lib/utils';

const initialProductData = {
  name: "Women's Basic Tee",
  price: '$32',
  rating: 3.9,
  reviewCount: 512,
  href: '#',
  imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg',
  imageAlt: "Back of women's Basic Tee in black.",
  colors: [
    { name: 'Black', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
    { name: 'Heather Grey', bgColor: 'bg-gray-400', selectedColor: 'ring-gray-400' },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductQuickView({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product: Product;
}) {
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0].name);
  const { addToCart } = useCartState();
  const { locale } = getParams<{ locale: string }>();

  const image = product.images.find((img) => img.color === selectedColor) || product.images[0];
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span aria-hidden="true" className="hidden md:inline-block md:h-screen md:align-middle">
            &#8203;
          </span>
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5 relative">
                  <Image fill alt={image.altText} src={image.src} className="object-cover object-center" />
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-xl font-medium text-gray-900 sm:pr-12">{product.name}</h2>

                  <section aria-labelledby="information-heading" className="mt-1">
                    <h3 id="information-heading" className="sr-only">
                      Product information
                    </h3>

                    <p className="font-medium text-gray-900">${product.price}</p>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-8">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    <form>
                      {/* Color picker */}
                      <fieldset aria-label="Choose a color">
                        <legend className="text-sm font-medium text-gray-900">Color</legend>

                        <RadioGroup
                          value={selectedColor}
                          onChange={setSelectedColor}
                          className="mt-2 flex items-center space-x-3"
                        >
                          {product.availableColors.map((color) => (
                            <Radio
                              key={color.name}
                              value={color?.name}
                              aria-label={color.name}
                              style={{ outlineColor: color.colorBg, outlineOffset: '0.125rem' }}
                              className={classNames(
                                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ',
                              )}
                            >
                              <span
                                aria-hidden="true"
                                style={{ backgroundColor: color.colorBg }}
                                className={classNames('h-8 w-8 rounded-full border border-black border-opacity-10')}
                              />
                            </Radio>
                          ))}
                        </RadioGroup>
                      </fieldset>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart({ id: product.id, qty: 1, color: selectedColor });
                          setOpen(false);
                        }}
                        className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Add to bag
                      </button>

                      <p className="absolute left-4 top-4 text-center sm:static sm:mt-8">
                        <Link
                          href={getLink(`/${locale}${product.href}`)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View full details
                        </Link>
                      </p>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
