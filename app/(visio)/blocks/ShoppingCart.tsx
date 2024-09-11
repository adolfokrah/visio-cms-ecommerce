import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Block } from 'visio-cms-lib/types';
import Text from 'visio-cms-lib/Text';
import { getLink } from 'visio-cms-lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import checkout from '@/app/server-actions/checkout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useCart from '@/utils/hooks/useCart';
import { useState } from 'react';

interface ShoppingCartProps {
  title: string;
  pageBlockId?: string;
  orderSummary: {
    title: string;
    subtotalLabel: string;
    totalLabel: string;
    cta: {
      title: string;
      href: string;
    };
  };
}
const ShoppingCart: Block<ShoppingCartProps> = ({ title, pageBlockId = '', orderSummary }) => {
  const router = useRouter();
  const { products, updateQty, removeFromCart, cart } = useCart();
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <Text pageBlockId={pageBlockId} defaultValue={title} propName="title" />
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {products
                .filter((product) => product.id != 0)
                .map((product, productIdx) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <Image
                        alt={product.imageAlt}
                        src={product.imageSrc}
                        width={96}
                        height={96}
                        className="rounded-md object-cover object-center sm:h-48 sm:w-48"
                        unoptimized
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={getLink(product.href)}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <span
                              aria-hidden="true"
                              style={{ backgroundColor: product.color.colorBg }}
                              className="h-8 w-8 rounded-full border border-black border-opacity-10"
                            />
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                            Quantity, {product.name}
                          </label>
                          <select
                            id={`quantity-${productIdx}`}
                            name={`quantity-${productIdx}`}
                            value={product.quantity}
                            onChange={(e) => updateQty(product.id, parseInt(e.target.value), product.color.name)}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                          </select>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id, product.color.name)}
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        {product.inStock ? (
                          <CheckIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-green-500" />
                        ) : (
                          <ClockIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-300" />
                        )}

                        <span>In stock</span>
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              <Text pageBlockId={pageBlockId} defaultValue={orderSummary.title} propName="orderSummary.title" />
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">
                  <Text
                    pageBlockId={pageBlockId}
                    defaultValue={orderSummary.subtotalLabel}
                    propName="orderSummary.subtotalLabel"
                  />
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  $
                  {products
                    .reduce((acc, product) => acc + parseFloat(product.price.slice(1)) * product.quantity, 0)
                    .toFixed(2)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  <Text
                    pageBlockId={pageBlockId}
                    defaultValue={orderSummary.totalLabel}
                    propName="orderSummary.totalLabel"
                  />
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  $
                  {products
                    .reduce((acc, product) => acc + parseFloat(product.price.slice(1)) * product.quantity, 0)
                    .toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={async () => {
                  setLoading(true);
                  const url = await checkout(`http://localhost:3000/${getLink(orderSummary.cta.href)}`, cart);
                  if (url) {
                    if (typeof url === 'string') {
                      router.push(url);
                    } else {
                      toast.error(url.error);
                    }
                  }
                  setLoading(false);
                }}
                className="w-full rounded-md border border-transparent inline-block text-center bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                {loading ? 'Processing...' : <Text
                  pageBlockId={pageBlockId}
                  defaultValue={orderSummary?.cta?.title}
                  propName="orderSummary.ctaText"
                />}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

ShoppingCart.Schema = {
  name: 'Shopping Cart',
  id: 'ShoppingCart',
  group: 'Ecommerce',
  defaultPropValues: {
    title: 'Shopping Cart',
    orderSummary: {
      title: 'Order summary',
      subtotalLabel: 'Subtotal',
      totalLabel: 'Order total',
      cta: {
        title: 'Checkout',
        href: '/checkout',
      },
    },
  },
  sideEditingProps: [
    {
      propName: 'orderSummary.cta.href',
      label: 'Checkout Link',
      type: 'link',
    },
  ],
};
export default ShoppingCart;
