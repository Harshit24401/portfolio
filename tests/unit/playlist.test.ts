import { expect, test } from 'vitest';
import { spotifyEmbedUrl } from '@/lib/playlist';

test('turns a playlist share URL into its embed URL, dropping tracking params', () => {
  expect(spotifyEmbedUrl('https://open.spotify.com/playlist/1KhWrcQqRsMrtWIZH0jdAN?si=e166e09825274efd')).toBe(
    'https://open.spotify.com/embed/playlist/1KhWrcQqRsMrtWIZH0jdAN?utm_source=generator&theme=0',
  );
});

test('rejects anything that is not a Spotify playlist', () => {
  expect(spotifyEmbedUrl('https://evil.example/playlist/abc')).toBeNull();
  expect(spotifyEmbedUrl('https://open.spotify.com/track/abc')).toBeNull();
  expect(spotifyEmbedUrl('not a url')).toBeNull();
  expect(spotifyEmbedUrl(null)).toBeNull();
});
