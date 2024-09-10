import { Block, MediaFile } from 'visio-cms-lib/types';
import { getLink } from 'visio-cms-lib/utils';
import Image from 'next/image';
import RichTextEditor from 'visio-cms-lib/RichText';
import Text from 'visio-cms-lib/Text';
import VisioImage from 'visio-cms-lib/Image';
import List from 'visio-cms-lib/List';
import classNames from 'classnames';
import Link from 'next/link';
interface HeroProps {
  title: string;
  subTitle: string;
  pageBlockId?: string;
  cta: {
    title: string;
    href: string;
  };
  imagesGrids: {
    images: MediaFile[];
  }[];
}
const Hero: Block<HeroProps> = ({ title, subTitle, cta, imagesGrids, pageBlockId = '' }) => {
  return (
    <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40 z-[0] relative bg-slate-50 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
        <div className="sm:max-w-lg">
          <div className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <RichTextEditor
              defaultValue={title}
              pageBlockId={pageBlockId}
              propName="title"
              allowNewLines={false}
              allowedControls={['h1', 'text-color']}
            />
          </div>
          <p className="mt-4 text-xl text-gray-500">
            <Text defaultValue={subTitle} pageBlockId={pageBlockId} propName="subTitle" />
          </p>
        </div>
        <div>
          <div className="mt-10">
            <div className=" overflow-hidden absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
              <List
                defaultPropValues={imagesGrids}
                pageBlockId={pageBlockId}
                propName="imagesGrids"
                className="flex items-center space-x-6 lg:space-x-8"
                listItemClassName="flex-shrink-0"
                renderComponent={({ images }, index) => (
                  <List
                    defaultPropValues={images}
                    pageBlockId={pageBlockId}
                    propName={`imagesGrids.${index}.images`}
                    className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8"
                    renderComponent={(image, ImageIndex) => (
                      <VisioImage
                        defaultValue={image}
                        pageBlockId={pageBlockId}
                        propName={`imagesGrids.${index}.images.${ImageIndex}`}
                        fallbackImage="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg"
                        wrapperClassName={classNames('!h-60 w-44 overflow-hidden rounded-lg relative', {
                          'sm:opacity-0 lg:opacity-100 h-0': index < 1 && ImageIndex < 1,
                        })}
                        renderImage={({ imagePublicUrl, altText }) => (
                          <Image
                            alt={altText}
                            src={`${imagePublicUrl}?t=${new Date().getTime()}`}
                            fill
                            className="h-full w-full object-cover object-center"
                          />
                        )}
                      />
                    )}
                  />
                )}
              />
            </div>

            <Link
              href={getLink(cta.href)}
              className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
            >
              <Text defaultValue={cta.title} pageBlockId={pageBlockId} propName="ctaText" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Hero.Schema = {
  name: 'Hero',
  id: 'hero',
  defaultPropValues: {
    title: 'This is a hero title',
    subTitle: 'This is a hero block',
    cta: {
      title: 'Shop Collection',
      href: '#',
    },
    imagesGrids: [],
  },
  sideEditingProps: [],
  lists: [
    {
      propName: 'imagesGrids',
      label: 'Image Grid',
      defaultValue: {
        images: [
          {
            width: 40,
            height: 50,
            altText: 'image',
            mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg',
          },
        ],
      },
      subLists: [
        {
          propName: 'imagesGrids.images',
          label: 'Image',
          defaultValue: {
            width: 40,
            height: 50,
            altText: 'image',
            mediaHash: 'https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg',
          },
        },
      ],
    },
  ],
};

export default Hero;
