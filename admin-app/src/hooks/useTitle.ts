import { useEffect } from 'react';

const TITLE_PREFIX = 'Menu bot admin panel';

export default function useTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${TITLE_PREFIX} - ${title}` : TITLE_PREFIX;
  }, [title]);
}
