/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { createClient } from '@/utils/supabase/server';
import stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY ?? '');

export default async function checkout( cart: { id: number; qty: number; color: string }[]) {
  if (cart.length === 0) {
    return { error: 'Cart is empty' };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in(
      'id',
      cart.map((item) => item.id),
    );

  if (error) {
    return { error: error.message };
  }

  const productsInStock = cart.map((cartProduct) => {
    const product = data.find((p) => p.id === cartProduct.id);
    const photos = product?.photos as { id: string; src: string; altText: string; color: string }[];
    const colors = product?.available_colors as { id: string; name: string; colorBg: string }[];

    return {
      id: product?.id || 0,
      name: product?.name || '',
      price: product?.price,
      color: colors?.find((c) => c.name === cartProduct?.color) || colors[0],
      imageSrc: photos.find((p) => p.color === cartProduct?.color)?.src || photos[0]?.src,
      imageAlt: photos.find((p) => p.color === cartProduct?.color)?.altText || photos[0]?.altText,
      quantity: cartProduct?.qty || 1,
    };
  });

  const lineItems = await Promise.all(
    productsInStock
      .filter((p) => p.id > 0)
      .map(async (product) => {
        // Create a price dynamically with Stripe (for simplicity, no recurring or complex pricing)

        const productData = await stripeInstance.products.create({
          name: product.name,
          images: [product.imageSrc],
        });

        const price = await stripeInstance.prices.create({
          unit_amount: (product.price ?? 0) * 100,
          currency: 'usd',
          product: productData.id,
        });

        // Return the Stripe line item
        return {
          price: price.id, // Stripe price ID
          quantity: product.quantity,
        };
      }),
  );


  try {
    // Create Checkout Sessions from body params.
    const ref = uuidv4();
    const checkoutUrl = process.env.STRIPE_REDIRECT_URL || 'http://localhost:3000/checkout';
    const session = await stripeInstance.checkout.sessions.create({
      client_reference_id: ref,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'DE'],
      },
      billing_address_collection: 'required',
      mode: 'payment',
      success_url: `${checkoutUrl}/?success=true&ref=${ref}`,
      cancel_url: `${checkoutUrl}/?canceled=true&ref=${ref}`,
    });
    return session.url;
  } catch (err: any) {
    return { error: err.message };
  }
}
