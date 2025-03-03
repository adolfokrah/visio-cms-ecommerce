"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Block, MediaFile } from 'visio-cms-lib/types';
import Text from 'visio-cms-lib/Text';
import List from 'visio-cms-lib/List';
import { getImageUrl, getLink, getProjectMode } from 'visio-cms-lib';

interface FooterProps {
  copyRight: string;
  newsLetter: {
    title: string;
    description: string;
    ctaText: string;
  };
  promotionBanner: {
    title: string;
    description: string;
    cta: {
      title: string;
      href: string;
    };
    image: MediaFile;
  };
  bottomLinks: {
    name: string;
    href: string;
  }[];
  pageBlockId?: string;
}
const Footer: Block<FooterProps> = ({ bottomLinks, newsLetter, promotionBanner, copyRight, pageBlockId = '' }) => {
  const isLiveMode = getProjectMode() === 'LIVE';
  return (
    <footer aria-labelledby="footer-heading" className="bg-white">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-6 xl:gap-x-8">
          <div className="flex items-center rounded-lg bg-gray-100 p-6 sm:p-10">
            <div className="mx-auto max-w-sm">
              <h3 className="font-semibold text-gray-900">
                <Text defaultValue={newsLetter.title} propName="newsLetter.title" pageBlockId={pageBlockId} />
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                <Text
                  defaultValue={newsLetter.description}
                  propName="newsLetter.description"
                  pageBlockId={pageBlockId}
                />
              </p>
              <form className="mt-4 sm:mt-6 sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="text"
                  required
                  autoComplete="email"
                  className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                  <button
                    type={isLiveMode ? 'submit' : 'button'}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
                  >
                    <Text defaultValue={newsLetter.ctaText} propName="newsLetter.ctaText" pageBlockId={pageBlockId} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="relative mt-6 flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:mt-0">
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <Image
                fill
                alt={promotionBanner.image.altText}
                src={getImageUrl(promotionBanner.image)}
                className="h-full w-full object-cover object-center saturate-0 filter"
              />
              <div className="absolute inset-0 bg-indigo-600 bg-opacity-90" />
            </div>
            <div className="relative mx-auto max-w-sm text-center">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                <Text defaultValue={promotionBanner.title} propName="promotionBanner.title" pageBlockId={pageBlockId} />
              </h3>
              <p className="mt-2 text-gray-200">
                <Text
                  defaultValue={promotionBanner.description}
                  propName="promotionBanner.description"
                  pageBlockId={pageBlockId}
                />
                <Link
                  href={getLink(promotionBanner.cta.href)}
                  className="whitespace-nowrap font-bold text-white hover:text-gray-200 inline-block"
                >
                  <Text
                    defaultValue={promotionBanner.cta.title}
                    propName="promotionBanner.cta.title"
                    pageBlockId={pageBlockId}
                  />
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500">
              &copy; <Text defaultValue={copyRight} propName="copyRight" pageBlockId={pageBlockId} />
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <List
              defaultPropValues={bottomLinks}
              propName="bottomLinks"
              pageBlockId={pageBlockId}
              className="flex space-x-8"
              renderComponent={(item, index) => (
                <Link key={item.name} href={item.href} className="text-sm text-gray-500 hover:text-gray-600">
                  <Text defaultValue={item.name} propName={`bottomLinks.${index}.name`} pageBlockId={pageBlockId} />
                </Link>
              )}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.Schema = {
  name: 'Footer',
  id: 'footer',
  group: 'Navigation',
  defaultPropValues: {
    copyRight: '© 2021 All Rights Reserved',
    newsLetter: {
      title: 'Sign up for our newsletter',
      description: 'The latest news, articles, and resources, sent to your inbox weekly.',
      ctaText: 'Sign up',
    },
    promotionBanner: {
      title: 'Get early access',
      description: 'Did you sign up to the newsletter? If so, use the keyword we sent you to get access.',
      cta: {
        title: 'Go now',
        href: '#',
      },
      image: {
        mediaHash: 'https://tailwindui.com/img/ecommerce-images/footer-02-exclusive-sale.jpg',
        altText: '',
        width: 0,
        height: 0,
      },
    },
    bottomLinks: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  sideEditingProps: [
    {
      propName: 'promotionBanner.image',
      type: 'image',
      label: 'Promotion Banner Image',
    },
  ],
  lists: [
    {
      label: 'Link',
      propName: 'bottomLinks',
      maxCount: 4,
      defaultValue: {
        name: 'New Link',
        href: '#',
      },
    },
  ],
};

export default Footer;
