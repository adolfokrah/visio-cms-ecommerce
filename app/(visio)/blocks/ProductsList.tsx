/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Block } from 'visio-cms-lib/types';
import { getParams, getProjectMode } from 'visio-cms-lib/utils';
import ProductItem, { Product, ProductColor } from '@/app/components/ProductItem';
import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/app/components/Skeleton';

const sortOptions = [
  { name: 'Newest', sort: 'newest', current: false },
  { name: 'Price: Low to High', sort: 'price-down', current: false },
  { name: 'Price: High to Low', sort: 'price-up', current: false },
];
const initialFilters = [
  {
    id: 'color',
    name: 'Color',
    options: [],
  },
  {
    id: 'category',
    name: 'Category',
    options: [],
  },
];

type Option = {
  value: string;
  label: string;
  checked: boolean;
};

type Filter = {
  id: string;
  name: string;
  options: Option[];
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProductsList: Block = () => {
  const [filters, setFilters] = useState<Filter[]>([...initialFilters]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { gender_category = 'men' } = getParams<{ gender_category: string }>();
  const searchParams = useSearchParams();
  const categories = searchParams.get('categories');
  const colors = searchParams.get('colors');
  const query = searchParams.get('query');
  const sort = searchParams.get('sort');
  const router = useRouter();
  const pathname = usePathname();
  const isLiveMode = getProjectMode() === 'LIVE';

  const setQueryParam = (name: string, value: string) => {
    if (!isLiveMode) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(name, value);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const setQueryFilters = (section: Filter, option: Option) => {
    const options = section.id == 'category' ? categories : colors;
    const name = section.id == 'category' ? 'categories' : 'colors';
    if (option.checked) {
      const newOptions = options
        ?.split(',')
        .filter((op) => op != option.value)
        .join(',');
      setQueryParam(name, newOptions || '');
    } else {
      setQueryParam(name, options ? `${options},${option.value}` : option.value);
    }
  };

  const formatName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');

  const supabase = createClient();
  const { data, error, isLoading } = useSWR(
    `/api/products/${gender_category}/${categories}/${colors}/${query}/${sort}`,
    async () => {
      const { data: genderCategoryData, error: genderCategoryError } = await supabase
        .from('gender_categories')
        .select('id')
        .eq('gender', gender_category.toLowerCase())
        .single();
      if (genderCategoryError) throw genderCategoryError;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category')
        .select('id, name')
        .eq('gender_category_id', genderCategoryData.id);
      if (categoriesError) throw categoriesError;

      let foundCategories = categoriesData;
      if (categories) {
        foundCategories = foundCategories.filter((category) => categories.split(',').includes(category.name));
      }

      const productsQuery = supabase
        .from('products')
        .select('*, category(*)')
        .in(
          'category_id',
          foundCategories.map((category: any) => category.id),
        );
      if (query) {
        productsQuery.ilike('name', `%${query}%`);
      }
      if (sort) {
        if (sort.includes('price')) {
          productsQuery.order('price', { ascending: sort == 'price-down' });
        } else {
          productsQuery.order('created_at', { ascending: false });
        }
      }
      const { data, error } = await productsQuery;
      if (error) {
        throw error;
      }
      let products = data;

      const pColors = Array.from(
        new Set<ProductColor>(products.map((product: any) => product.available_colors).flat()),
      );
      const colorOptions = pColors.map((pColor: ProductColor) => {
        return {
          value: pColor.name,
          label: formatName(pColor.name),
          checked: colors ? colors.split(',').includes(pColor.name) : false,
        };
      });

      setFilters((filters) =>
        filters.map((filter) => ({
          ...filter,
          options:
            filter.id === 'color'
              ? colorOptions
              : categoriesData
                  .filter((category) => products.some((product) => product.category_id == category.id))
                  .map((category) => ({
                    value: category.name,
                    label: formatName(category.name),
                    checked: categories ? categories.split(',').includes(category.name) : false,
                  })),
        })),
      );
      if (colors) {
        products = products.filter((product: any) =>
          product.available_colors.some((productColor: ProductColor) => colors.includes(productColor.name)),
        );
      }
      return products;
    },
  );

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
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <Skeleton className="h-[30rem] relative bg-slate-100 " />
            <Skeleton className="h-[30rem] relative bg-slate-100  lg:col-span-3" />
          </div>
        </div>
      </div>
    );
  }

  if (!products) return null;

  if (error) return <div className="text-red-500">{JSON.stringify(Error)}</div>;

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              onChange={() => setQueryFilters(section, option)}
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {gender_category.charAt(0).toUpperCase() + gender_category.slice(1).replace(/_/g, ' ')}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <ul className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <li
                          onClick={() => setQueryParam('sort', option.sort)}
                          className={classNames(
                            sort == option.sort ? 'font-medium text-gray-900' : 'text-gray-500',
                            'block px-4 py-2 text-sm data-[focus]:bg-gray-100 cursor-pointer',
                          )}
                        >
                          {option.name}
                        </li>
                      </MenuItem>
                    ))}
                  </ul>
                </MenuItems>
              </Menu>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure defaultOpen key={section.id} as="div" className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              onChange={() => setQueryFilters(section, option)}
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                  {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

ProductsList.Schema = {
  name: 'ProductsList',
  id: 'productsList',
  group: 'Ecommerce',
  defaultPropValues: {},
  sideEditingProps: [],
};

export default ProductsList;
