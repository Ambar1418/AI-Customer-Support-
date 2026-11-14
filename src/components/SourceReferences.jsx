import { ChevronDown, FileText } from "lucide-react";

export default function SourceReferences({ sources }) {
  if (!sources?.length) return null;

  return (
    <details className="sources">
      <summary>
        <FileText size={15} strokeWidth={1.8} />
        <span>Sources used to generate this answer</span>
        <span className="source-count">{sources.length}</span>
        <ChevronDown className="sources-chevron" size={15} />
      </summary>
      <div className="source-list">
        {sources.map((source, index) => (
          <article className="source-card" key={`${source.title}-${index}`}>
            <div className="source-card__heading">
              <span className="source-number">{index + 1}</span>
              <h4>{source.title}</h4>
            </div>
            <p>{source.content}</p>
          </article>
        ))}
      </div>
    </details>
  );
}
