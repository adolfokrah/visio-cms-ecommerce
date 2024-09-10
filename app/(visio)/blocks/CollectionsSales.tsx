import Image from 'next/image';
import { Block, MediaFile } from 'visio-cms-lib/types';
import Text from 'visio-cms-lib/Text';
import List from 'visio-cms-lib/List';
import { getImageUrl, getLink } from 'visio-cms-lib';
import Link from 'next/link';

interface CollectionProps {
  title: string;
  ctaText: string;
  href: string;
  background: MediaFile;
  collections: {
    image: MediaFile;
    name: string;
    href: string;
    ctaText: string;
  }[];
  pageBlockId?: string;
}

const CollectionSales: Block<CollectionProps> = ({
  title,
  ctaText,
  collections,
  href,
  pageBlockId = '',
  background,
}) => {
  return (
    <div className="relative bg-white ">
      {/* Background image and overlap */}
      <div aria-hidden="true" className="absolute inset-0 hidden sm:flex sm:flex-col">
        <div className="relative w-full flex-1 bg-gray-800">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              alt=""
              src="https://tailwindui.com/img/ecommerce-images/home-page-04-hero-full-width.jpg"
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
          <div className="absolute inset-0 bg-gray-900 opacity-50" />
        </div>
        <div className="h-32 w-full bg-white md:h-40 lg:h-48" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-96 text-center sm:px-6 sm:pb-0 lg:px-8">
        {/* Background image and overlap */}
        <div aria-hidden="true" className="absolute inset-0 flex flex-col sm:hidden">
          <div className="relative w-full flex-1 bg-gray-800">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                fill
                alt={background?.altText}
                src={getImageUrl(background)}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gray-900 opacity-50" />
          </div>
          <div className="h-48 w-full bg-white" />
        </div>
        <div className="relative py-32">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <Text propName="title" pageBlockId={pageBlockId} defaultValue={title} />
          </h1>
          <div className="mt-4 sm:mt-6">
            <Link
              href={getLink(href)}
              className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
            >
              <Text propName="ctaText" pageBlockId={pageBlockId} defaultValue={ctaText} />
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="collection-heading" className="relative -mt-96 sm:mt-0">
        <h2 id="collection-heading" className="sr-only">
          Collections
        </h2>
        <List
          className="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8"
          defaultPropValues={collections}
          propName="collections"
          pageBlockId={pageBlockId}
          listItemClassName="group relative h-96 rounded-lg bg-white shadow-xl sm:aspect-h-5 sm:aspect-w-4 sm:h-auto"
          renderComponent={(collection, index) => (
            <div key={index}>
              <div>
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 overflow-hidden group-hover:opacity-75">
                    <Image
                      fill
                      alt={collection?.image?.altText}
                      src={getImageUrl(collection.image)}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
                </div>
                <div className="absolute inset-0 flex items-end rounded-lg p-6">
                  <div>
                    <p aria-hidden="true" className="text-sm text-white">
                      <Text
                        propName={`collections.${index}.ctaText`}
                        pageBlockId={pageBlockId}
                        defaultValue={collection.ctaText}
                      />
                    </p>
                    <h3 className="mt-1 font-semibold text-white">
                      <Link href={getLink(collection.href)}>
                        <Text
                          propName={`collections.${index}.name`}
                          pageBlockId={pageBlockId}
                          defaultValue={collection.name}
                        />
                      </Link>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
};

CollectionSales.Schema = {
  name: 'Collection Sales',
  id: 'collection-sales',
  group: 'Promotions',
  defaultPropValues: {
    href: '#',
    title: 'Mid-Season Sale',
    ctaText: 'Shop Collection',
    background: {
      mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-04-hero-full-width.jpg',
      altText: '',
      width: 1000,
      height: 1000,
    },
    collections: [
      {
        name: "Women's",
        href: '#',
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-04-collection-01.jpg',
          altText: 'Woman wearing an off-white cotton t-shirt.',
          width: 1000,
          height: 1000,
        },
        ctaText: 'Shop Collection',
      },
      {
        name: "Men's",
        href: '#',
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-04-collection-02.jpg',
          altText: 'https://tailwindui.com/img/ecommerce-images/home-page-04-collection-02.jpg',
          width: 1000,
          height: 1000,
        },
        ctaText: 'Shop Collection',
      },
      {
        name: 'Desk Accessories',
        href: '#',
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-04-collection-03.jpg',
          altText: 'Person sitting at a wooden desk with paper note organizer, pencil and tablet.',
          width: 1000,
          height: 1000,
        },
        ctaText: 'Shop Collection',
      },
    ],
  },
  sideEditingProps: [
    {
      propName: 'background',
      type: 'image',
      label: 'Background Image',
    },
    {
      propName: 'href',
      type: 'link',
      label: 'CTA Link',
    },
  ],
  lists: [
    {
      propName: 'collections',
      label: 'Collection',
      maxCount: 3,
      defaultValue: {
        name: 'Collection',
        href: '#',
        image: { mediaHash: undefined, altText: '', width: 1000, height: 1000 },
      },
      sideEditingProps: [
        {
          propName: 'href',
          label: 'Link',
          type: 'link',
        },
        {
          propName: 'image',
          label: 'Image',
          type: 'image',
        },
      ],
    },
  ],
};

export default CollectionSales;
