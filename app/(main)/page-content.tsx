'use client';

import LivePage from 'visio-cms-lib/LivePage';
import blocks from '@/app/(visio)/blocks';
import { PageData } from 'visio-cms-lib/types';

export default function PageContent({
  pageBlocks,
  projectConfiguration,
  params,
  pages,
}: Omit<PageData, 'projectConfiguration'> & {
  projectConfiguration: Omit<PageData['projectConfiguration'], 'scripts'>;
}) {
  return (
    <LivePage
      allowImageTransformation={false}
      pageBlocks={pageBlocks}
      projectConfiguration={{
        ...projectConfiguration,
        projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || '',
        blocks,
      }}
      params={params}
      pages={pages}
    />
  );
}
