import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const components: Components = {
    // Headings with arcade styling - border-left accent
    h1: ({ children }) => (
      <h1
        className="text-2xl font-black text-stone-800 uppercase tracking-wider mb-4 mt-6 first:mt-0 pl-4"
        style={{ borderLeft: '4px solid #2d8f8f' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="text-xl font-black text-stone-800 uppercase tracking-wider mb-3 mt-5 first:mt-0 pl-3"
        style={{ borderLeft: '3px solid #0ea5e9' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-black text-stone-700 mb-2 mt-4 first:mt-0 flex items-center gap-2">
        <span className="w-2 h-2 bg-teal-500" />
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-bold text-stone-700 mb-2 mt-3 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-sm font-bold text-stone-700 mb-1 mt-2 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-semibold text-stone-600 mb-1 mt-2 first:mt-0">
        {children}
      </h6>
    ),

    // Paragraphs with good line height
    p: ({ children }) => (
      <p className="text-sm leading-relaxed text-stone-600 mb-3">
        {children}
      </p>
    ),

    // Lists with arcade bullet styling - teal square bullets
    ul: ({ children }) => (
      <ul className="pl-5 mb-3 space-y-2 text-sm text-stone-600">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="pl-5 mb-3 space-y-2 text-sm text-stone-600 list-none counter-reset-item">
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => {
      // Check if this is inside an ordered list by checking for index
      const isOrdered = 'index' in props && typeof props.index === 'number'

      if (isOrdered) {
        return (
          <li className="flex items-start gap-2">
            <span
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-black text-white mt-0.5"
              style={{
                background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
                boxShadow: '0 2px 0 #1a5f5f'
              }}
            >
              {(props.index as number) + 1}
            </span>
            <span>{children}</span>
          </li>
        )
      }

      return (
        <li className="flex items-start gap-2">
          <span className="flex-shrink-0 w-2 h-2 bg-teal-500 mt-1.5" />
          <span>{children}</span>
        </li>
      )
    },

    // Inline formatting
    strong: ({ children }) => (
      <strong className="font-bold text-stone-800">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-stone-600">
        {children}
      </em>
    ),

    // Links with teal arcade styling
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-teal-600 font-medium hover:text-teal-700 underline decoration-teal-300 hover:decoration-teal-500 decoration-2 underline-offset-2 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Inline code with light background - NOT dark
    code: ({ children, className }) => {
      // If className contains 'language-', it's a code block (handled by pre)
      const isCodeBlock = className?.includes('language-')
      if (!isCodeBlock) {
        return (
          <code
            className="text-teal-700 px-1.5 py-0.5 text-xs font-mono"
            style={{
              backgroundColor: '#f5f5f4',
              border: '2px solid #d6d3d1'
            }}
          >
            {children}
          </code>
        )
      }
      // For code blocks, just return the children (handled by pre)
      return <code className="text-xs">{children}</code>
    },

    // Code blocks with LIGHT styling - NOT dark
    pre: ({ children }) => (
      <pre
        className="p-4 overflow-x-auto mb-3"
        style={{
          backgroundColor: '#fafaf9',
          border: '3px solid #d6d3d1',
          boxShadow: '4px 4px 0 #d6d3d144'
        }}
      >
        <code className="text-xs font-mono leading-relaxed text-stone-700">
          {children}
        </code>
      </pre>
    ),

    // Blockquotes with teal left border
    blockquote: ({ children }) => (
      <blockquote
        className="pl-4 py-2 my-3 text-stone-600 italic"
        style={{
          borderLeft: '4px solid #2d8f8f',
          backgroundColor: '#f0fdfa'
        }}
      >
        {children}
      </blockquote>
    ),

    // Horizontal rule with arcade dashed style
    hr: () => (
      <hr
        className="my-6"
        style={{
          border: 'none',
          borderTop: '3px dashed #d6d3d1'
        }}
      />
    ),

    // Tables with arcade styling
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table
          className="min-w-full text-sm"
          style={{
            border: '3px solid #2d8f8f',
            boxShadow: '4px 4px 0 #2d8f8f44'
          }}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead
        className="text-left"
        style={{
          background: 'linear-gradient(180deg, #f0fdfa 0%, #ccfbf1 100%)',
          borderBottom: '3px solid #2d8f8f'
        }}
      >
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr style={{ borderBottom: '2px solid #e7e5e4' }}>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 font-black text-teal-700 uppercase tracking-wider text-xs">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-stone-600">
        {children}
      </td>
    ),
  }

  return (
    <div className={`text-stone-700 ${className}`}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
