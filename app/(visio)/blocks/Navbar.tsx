"use client"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Block } from 'visio-cms-lib/types';
import VisioImage from 'visio-cms-lib/Image';
import { MediaFile } from 'visio-cms-lib/types';
import List from 'visio-cms-lib/List';
import Text from 'visio-cms-lib/Text';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLink, getParams, getProjectMode } from 'visio-cms-lib/utils';
import useCartState from '@/utils/state/useCartState';
// import { getParams } from 'visio-cms-lib/utils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface NavbarProps {
  logo: MediaFile;
  pageBlockId?: string;
  navigation: { name: string; href: string; current: boolean; itemKey: string }[];
  cartUrl: string;
}

const Navbar: Block<NavbarProps> = ({ logo, pageBlockId = '', navigation, cartUrl }) => {
  const [path, setPath] = useState<string | null>(null);
  const { cart } = useCartState();

  const { locale, gender_category = 'men' } = getParams<{ locale: string; gender_category: string }>();
  const searchParams = useSearchParams();
  const isLiveMode = getProjectMode() === 'LIVE';
  const router = useRouter();
  const query = searchParams.get('query');
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLiveMode) return;
    const formData = new FormData(event.currentTarget);
    router.push(`/${locale}/products-list/${gender_category}?query=${formData.get('query')}`);
  }

  return (
    <Disclosure as="header" className="bg-white shadow relative">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <div className="flex flex-shrink-0 items-center">
              <VisioImage
                defaultValue={logo}
                pageBlockId={pageBlockId}
                propName="logo"
                fallbackImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                renderImage={({ imagePublicUrl, altText }) => (
                  <Link href={getLink('/')}>
                    <Image alt={altText} src={`${imagePublicUrl}`} width={100} height={10} unoptimized />
                  </Link>
                )}
              />
            </div>
          </div>
          <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <form className="relative" onSubmit={onSubmit}>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  defaultValue={query || ''}
                  id="search"
                  name="query"
                  type="search"
                  placeholder="Search"
                  className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </form>
            </div>
          </div>
          <div className="relative z-10 flex gap-2 items-center lg:hidden">

           <Link
              href={getLink(cartUrl)}
              className="relative flex items-center  flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ShoppingBagIcon aria-hidden="true" className="h-6 w-6" />
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                {cart.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </Link>

            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>

            
          </div>
          <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
            <Link
              href={getLink(cartUrl)}
              className="relative flex items-center  flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ShoppingBagIcon aria-hidden="true" className="h-6 w-6" />
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                {cart.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </Link>
          </div>
        </div>

        <nav>
          <List
            propName="navigation"
            pageBlockId={pageBlockId}
            defaultPropValues={navigation}
            className="hidden lg:flex lg:space-x-8 lg:py-2"
            renderComponent={(item, index) => {
              const current = path == item.href;
              return (
                <Link
                  key={item.itemKey}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={classNames(
                    current ? 'bg-gray-100 text-gray-900' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium',
                  )}
                >
                  <Text defaultValue={item.name} propName={`navigation.${index}.name`} pageBlockId={pageBlockId} />
                </Link>
              );
            }}
          />
        </nav>
      </div>

      <DisclosurePanel as="nav" aria-label="Global" className="lg:hidden">
        <List
          propName="navigation"
          pageBlockId={pageBlockId}
          defaultPropValues={navigation}
          className="space-y-1 px-2 pb-3 pt-2"
          renderComponent={(item, index) => {
            const current = path == item.href;
            return (
              <DisclosureButton
                as="a"
                key={item.itemKey}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={classNames(
                  current ? 'bg-gray-100 text-gray-900' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                <Text defaultValue={item.name} propName={`navigation.${index}.name`} pageBlockId={pageBlockId} />
              </DisclosureButton>
            );
          }}
        />

            
      </DisclosurePanel>
    </Disclosure>
  );
};

Navbar.Schema = {
  name: 'Navbar',
  id: 'navbar',
  group: 'Navigation',
  defaultPropValues: {
    cartUrl: '#',
    navigation: [
      { name: 'Dashboard', href: '#', current: false, itemKey: 'dashboard' },
      { name: 'Team', href: '#', current: false, itemKey: 'team' },
      { name: 'Projects', href: '#', current: false, itemKey: 'projects' },
      { name: 'Calendar', href: '#', current: false, itemKey: 'calendar' },
    ],
    logo: { mediaHash: undefined, width: 32, height: 32, altText: 'logo' },
  },
  sideEditingProps: [
    {
      propName: 'cartUrl',
      type: 'link',
      label: 'Cart URL',
    },
  ],
  lists: [
    {
      propName: 'navigation',
      label: 'Menu',
      defaultValue: {
        name: 'New Menu',
        href: '#',
        current: false,
      },
      sideEditingProps: [
        {
          propName: 'href',
          label: 'Link',
          type: 'link',
        },
      ],
    },
  ],
};

export default Navbar;
