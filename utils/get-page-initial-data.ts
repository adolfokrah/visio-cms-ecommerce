/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';

export default async function getPageInitialData(params: { [key: string]: any }) {
  const supabase = createClient();
  switch (params.pageSlug) {
    case '/index':
      return await getPageName();
    default:
      return null;
  }

  async function getPageName() {
    const { data, error } = await supabase.from('pages').select('slug, id, name').single();
    if (error) {
      throw error;
    }
    return data;
  }
}
