import { getProjectMode } from 'visio-cms-lib';
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import useCartState from '@/utils/state/useCartState';
import { useMemo } from 'react';
import { getParams } from 'visio-cms-lib/utils';

const initialProducts = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: {
      id: 'sienna',
      name: 'Sienna',
      colorBg: '#be8e59',
    },
    inStock: true,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in sienna.",
    quantity: 1,
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: {
      id: 'black',
      name: 'Black',
      colorBg: '#000',
    },
    inStock: false,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    quantity: 2,
  },
  {
    id: 3,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35.00',
    color: {
      id: 'white',
      name: 'White',
      colorBg: '#fff',
    },
    inStock: true,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg',
    imageAlt: 'Insulated bottle with white base and black snap lid.',
    quantity: 1,
  },
];

export default function useCart() {
  const isLiveMode = getProjectMode() === 'LIVE';
  const { locale } = getParams<{ locale: string }>();
  const { cart, updateQty, removeFromCart } = useCartState();
  const supabase = createClient();
  const { data } = useSWR(`/api/cart/${cart.length}`, async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in(
        'id',
        cart.map((c) => c.id),
      );
    if (error) {
      throw error;
    }
    return data;
  });

  let products = useMemo(() => {
    if (!data) {
      return [];
    }
    return cart.map((cartProduct) => {
      const product = data.find((p) => p.id === cartProduct.id);
      const photos = product?.photos as { id: string; src: string; altText: string; color: string }[];
      const colors = product?.available_colors as { id: string; name: string; colorBg: string }[];

      return {
        id: product?.id || 0,
        name: product?.name || '',
        price: `$${product?.price}`,
        color: colors?.find((c) => c.name === cartProduct?.color) || colors[0],
        inStock: true,
        imageSrc: photos.find((p) => p.color === cartProduct?.color)?.src || photos[0]?.src,
        imageAlt: photos.find((p) => p.color === cartProduct?.color)?.altText || photos[0]?.altText,
        quantity: cartProduct?.qty || 1,
        href: `/${locale}/products/${product?.id}?color=${cartProduct?.color}`,
      };
    });
  }, [data, cart, locale]);
  if (!isLiveMode) products = initialProducts;

  return { products, updateQty, removeFromCart, cart };
}
