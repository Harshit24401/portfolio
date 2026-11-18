import { TrackFilter } from '@/components/track/TrackFilter';
import { TrackProvider } from '@/components/track/TrackProvider';

// Placeholder home. Task 4 replaces this with the real sections;
// the two filters are here so Task 3's shared-state test has something to drive.
export default function Home() {
  return (
    <TrackProvider>
      <main className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8">
        <h1 className="font-serif text-6xl tracking-tight">Harshit Arora</h1>
        <p className="mt-4 text-muted">
          Full-stack &amp; <em className="font-serif text-accent">AI/ML</em> engineer. Site under construction.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <TrackFilter label="Filter work by track" />
          <TrackFilter label="Filter skills by track" />
        </div>
      </main>
    </TrackProvider>
  );
}
