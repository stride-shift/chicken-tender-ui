import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const components: Components = {
    // Headings with clean executive styling
    h1: ({ children }) => (
      <h1 className="text-2xl font-serif font-semibold text-foreground mb-4 mt-6 first:mt-0 border-l-4 border-primary/30 pl-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-serif font-semibold text-foreground mb-3 mt-5 first:mt-0 border-l-3 border-primary/30 pl-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-serif font-semibold text-foreground mb-2 mt-4 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-serif font-semibold text-foreground mb-2 mt-3 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-sm font-serif font-semibold text-foreground mb-1 mt-2 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-serif font-semibold text-muted-foreground mb-1 mt-2 first:mt-0">
        {children}
      </h6>
    ),

    // Paragraphs with good line height
    p: ({ children }) => (
      <p className="text-body text-foreground font-light leading-relaxed mb-3">
        {children}
      </p>
    ),

    // Lists with clean styling
    ul: ({ children }) => (
      <ul className="pl-5 mb-3 space-y-2 text-sm text-foreground font-light">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="pl-5 mb-3 space-y-2 text-sm text-foreground font-light list-none counter-reset-item">
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => {
      // Check if this is inside an ordered list by checking for index
      const isOrdered = 'index' in props && typeof props.index === 'number'

      if (isOrdered) {
        return (
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-primary rounded-sm mt-0.5 tabular-nums">
              {(props.index as number) + 1}
            </span>
            <span>{children}</span>
          </li>
        )
      }

      return (
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2" />
          <span>{children}</span>
        </li>
      )
    },

    // Inline formatting
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-muted-foreground">
        {children}
      </em>
    ),

    // Links with primary color
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Inline code with clean styling
    code: ({ children, className }) => {
      // If className contains 'language-', it's a code block (handled by pre)
      const isCodeBlock = className?.includes('language-')
      if (!isCodeBlock) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
            {children}
          </code>
        )
      }
      // For code blocks, just return the children (handled by pre)
      return <code className="text-sm">{children}</code>
    },

    // Code blocks with clean styling
    pre: ({ children }) => (
      <pre className="bg-muted rounded-md p-4 overflow-x-auto mb-3">
        <code className="text-sm font-mono leading-relaxed text-foreground">
          {children}
        </code>
      </pre>
    ),

    // Blockquotes with clean border
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-3 text-muted-foreground italic">
        {children}
      </blockquote>
    ),

    // Horizontal rule with clean style
    hr: () => (
      <hr className="my-6 border-0 border-t border-border" />
    ),

    // Tables with clean styling
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="text-left bg-muted border-b border-border">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-card">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-border last:border-0">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 font-serif font-semibold text-foreground text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-foreground font-light">
        {children}
      </td>
    ),
  }

  return (
    <div className={`text-foreground ${className}`}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
