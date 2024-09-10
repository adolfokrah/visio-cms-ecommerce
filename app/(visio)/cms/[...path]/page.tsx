'use client';
import Cms from 'visio-cms-lib/Cms';
import '@/app/globals.css';
import '@/node_modules/visio-cms-lib/dist/lib.css';
import config from '@/visio.config';

export default function Page({ params }: { params: { path: string[] } }) {
  const { path } = params;
  return <Cms path={`/cms/${path.join('/')}`} {...config} />;
}
