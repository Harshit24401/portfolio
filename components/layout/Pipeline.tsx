/** A vertical chain of steps for case-study diagrams, written in MDX as <Pipeline steps={[...]} />. */
export function Pipeline({ steps, caption }: { steps: string[]; caption?: string }) {
  return (
    <figure className="pipeline-fig">
      <ol className="pipeline">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
