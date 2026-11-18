'use client';

import type { Track } from '@/lib/schemas';
import { matchesTrack } from '@/lib/track';
import { useTrack } from './TrackProvider';

type Props = React.HTMLAttributes<HTMLElement> & { tracks: readonly Track[]; as?: 'article' | 'div' };

/**
 * The one client piece a server-rendered card needs: it reads the shared track
 * and adds .is-dim when the card doesn't match. The card's content stays a
 * server component passed in as children, so it costs no extra JavaScript.
 * Dimmed cards stay in the accessibility tree; dimming is a visual hint only.
 */
export function Dimmable({ tracks, as: Tag = 'article', className = '', ...rest }: Props) {
  const { track } = useTrack();
  const dim = !matchesTrack(tracks, track);
  return <Tag data-card="" className={`${className} ${dim ? 'is-dim' : ''}`.trim()} {...rest} />;
}
