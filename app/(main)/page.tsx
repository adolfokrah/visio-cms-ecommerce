export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import Page from './[locale]/[...slug]/page';
import { generateMetadata as gePageMeta } from './[locale]/[...slug]/page';

export async function generateMetadata() {
  return await gePageMeta({ params: { slug: ['index'], locale: 'en-us' } });
}

export default function IndexPage() {
  return <Page params={{ slug: ['index'], locale: 'en-us' }} />;
}
