import type { AnchorHTMLAttributes } from 'react';

/** Anchor for off-site links: always opens safely in a new tab. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
