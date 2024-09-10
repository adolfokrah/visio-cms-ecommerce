import Page from './[...slug]/page';

export default function PageWithLocale({ params }: { params: { locale: string } }) {
  return <Page params={{ slug: ['index'], locale: params.locale }} />;
}
