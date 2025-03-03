
"use client"
import useCartState from '@/utils/state/useCartState';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Block } from 'visio-cms-lib/types';

const OderPlaced: Block = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const {emptyCart} = useCartState();

  useEffect(()=>{
    if(success){
      emptyCart();
    }
  },[success, emptyCart])


  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-36 px-3">
        <div className="lg:col-start-2">
          <h1 className="text-sm font-medium text-indigo-600">{success ? 'Payment successful' : 'Payment Failed'}</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {success ? 'Thanks for your order!' : 'Payment Failed'}
          </p>
          <p className="mt-2 text-base text-gray-500">
            {success
              ? 'We appreciate your business. If you have any questions, please email us.'
              : 'We were unable to process your payment. Please try again or contact support.'}
          </p>
            
        </div>
      </div>
    </div>
  );
};

OderPlaced.Schema = {
  name: 'Order placed',
  id: 'order-placed',
  defaultPropValues: {},
  sideEditingProps: [],
};

export default OderPlaced;
