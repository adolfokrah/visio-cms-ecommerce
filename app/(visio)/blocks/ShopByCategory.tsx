import Image from 'next/image';
import { Block, MediaFile } from 'visio-cms-lib/types';
import List from 'visio-cms-lib/List';
import Text from 'visio-cms-lib/Text';
import { getImageUrl, getLink } from 'visio-cms-lib';
import classNames from 'classnames';
import Link from 'next/link';

interface ShopByCategoryProps {
  title: string;
  cta: {
    title: string;
    href: string;
  };
  categories: {
    image: MediaFile;
    title: string;
    ctaText: string;
    href?: string;
  }[];
  pageBlockId?: string;
}
const ShopByCategory: Block<ShopByCategoryProps> = ({ title, cta, categories, pageBlockId = '' }) => {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            <Text propName="title" pageBlockId={pageBlockId} defaultValue={title} />
          </h2>
          
        </div>

        <List
          defaultPropValues={categories}
          propName="categories"
          pageBlockId={pageBlockId}
          className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8"
          setListItemClassName={(category, index) => {
            return index < 1
              ? 'group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2'
              : 'group relative aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full';
          }}
          renderComponent={(category, index) => (
            <>
              <Image
                fill
                alt={category?.image?.altText}
                src={getImageUrl(category.image)}
                className="object-cover object-center group-hover:opacity-75"
              />
              <div aria-hidden="true" className="bg-gradient-to-b from-transparent to-black opacity-50" />
              <div
                className={classNames(' flex items-end p-6 font-semibold text-white', {
                  'flex items-end p-6 sm:absolute sm:inset-0': index > 0,
                })}
              >
                <div>
                  <h3>
                    <Link href={getLink(category?.href || '#')}>
                      <span className="absolute inset-0" />
                      <Text
                        propName={`categories.${index}.title`}
                        pageBlockId={pageBlockId}
                        defaultValue={category.title}
                      />
                    </Link>
                  </h3>
                  <p aria-hidden="true" className="mt-1 text-sm text-white">
                    <Text
                      propName={`categories.${index}.ctaText`}
                      pageBlockId={pageBlockId}
                      defaultValue={category.ctaText}
                    />
                  </p>
                </div>
              </div>
            </>
          )}
        />

        <div className="mt-6 sm:hidden">
          <Link href={cta.href} className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            {cta.title}
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

ShopByCategory.Schema = {
  name: 'Shop By Category',
  id: 'shop-by-category',
  defaultPropValues: {
    title: 'Shop By Category',
    cta: {
      title: 'Browse all categories',
      href: '#',
    },
    categories: [
      {
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-03-featured-category.jpg',
          altText: "Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee.",
          width: 1000,
          height: 1000,
        },
        title: 'New Arrivals',
        ctaText: 'Shop now',
      },
      {
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg',
          altText:
            'Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters.',
          width: 1000,
          height: 1000,
        },
        title: 'Accessories',
        ctaText: 'Shop now',
      },
      {
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg',
          altText: 'Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk.',
          width: 1000,
          height: 1000,
        },
        title: 'Workspace',
        ctaText: 'Shop now',
      },
    ],
  },
  sideEditingProps: [],
  lists: [
    {
      propName: 'categories',
      label: 'Category',
      defaultValue: {
        image: {
          mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-03-featured-category.jpg',
          altText: "Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee.",
          width: 1000,
          height: 1000,
        },
        title: 'New Arrivals',
        ctaText: 'Shop now',
      },
      sideEditingProps: [
        {
          propName: 'image',
          label: 'Image',
          type: 'image',
        },
        {
          propName: 'href',
          label: 'Link',
          type: 'link',
        },
      ],
    },
  ],
};

export default ShopByCategory;
