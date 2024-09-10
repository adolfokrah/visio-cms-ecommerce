import Text from 'visio-cms-lib/Text';
import VisioImage from 'visio-cms-lib/Image';
import List from 'visio-cms-lib/List';
import { Block, MediaFile } from 'visio-cms-lib/types';
import Image from 'next/image';

interface IncentiveProps {
  incentives: {
    image: MediaFile;
    title: string;
    description: string;
  }[];
  pageBlockId?: string;
}

const Incentives: Block<IncentiveProps> = ({ incentives, pageBlockId = '' }) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <List
          defaultPropValues={incentives}
          pageBlockId={pageBlockId}
          propName="incentives"
          className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8"
          renderComponent={(incentive, index) => (
            <div key={incentive.title}>
              <VisioImage
                pageBlockId={pageBlockId}
                propName={`incentives.${index}.image`}
                defaultValue={incentive.image}
                renderImage={(image) => (
                  <Image
                    alt={image.altText}
                    src={image.imagePublicUrl}
                    width={96}
                    height={96}
                    className="h-24 w-auto"
                  />
                )}
              />
              <h3 className="mt-6 text-sm font-medium text-gray-900">
                <Text defaultValue={incentive.title} pageBlockId={pageBlockId} propName={`incentives.${index}.title`} />
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                <Text
                  defaultValue={incentive.description}
                  pageBlockId={pageBlockId}
                  propName={`incentives.${index}.description`}
                />
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

Incentives.Schema = {
  name: 'Incentives',
  id: 'incentives',
  defaultPropValues: {
    incentives: [
      {
        title: 'Free Shipping',
        description:
          "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
        image: {
          width: 96,
          height: 96,
          altText: 'image',
          mediaHash: 'https://tailwindui.com/img/ecommerce/icons/icon-delivery-light.svg',
        },
      },
      {
        title: '24/7 Customer Support',
        description: 'Our AI chat widget is powered by a naive series of if/else statements. Guaranteed to irritate.',
        image: {
          width: 96,
          height: 96,
          altText: 'image',
          mediaHash: 'https://tailwindui.com/img/ecommerce/icons/icon-chat-light.svg',
        },
      },
      {
        title: 'Fast Shopping Cart',
        description: "Look how fast that cart is going. What does this mean for the actual experience? I don't know.",
        image: {
          width: 96,
          height: 96,
          altText: 'image',
          mediaHash: 'https://tailwindui.com/img/ecommerce/icons/icon-fast-checkout-light.svg',
        },
      },
      {
        title: 'Gift Cards',
        description:
          "Buy them for your friends, especially if they don't like our store. Free money for us, it's great.",
        image: {
          width: 96,
          height: 96,
          altText: 'image',
          mediaHash: 'https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg',
        },
      },
    ],
  },
  sideEditingProps: [],
  lists: [
    {
      propName: 'incentives',
      label: 'Incentive',
      maxCount: 4,
      defaultValue: {
        title: 'Gift Cards',
        description:
          "Buy them for your friends, especially if they don't like our store. Free money for us, it's great.",
        image: {
          width: 96,
          height: 96,
          altText: 'image',
          mediaHash: 'https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg',
        },
      },
    },
  ],
};

export default Incentives;
