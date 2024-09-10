import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getProjectMode } from 'visio-cms-lib';

export default function useSetQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isLiveMode = getProjectMode() === 'LIVE';

  const setQueryParam = (name: string, value: string) => {
    if (!isLiveMode) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(name, value);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return { setQueryParam };
}
