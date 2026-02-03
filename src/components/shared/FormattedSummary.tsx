interface FormattedSummaryProps {
  content: string
}

/**
 * Parses and formats AI-generated tender summaries with arcade-style light mode.
 *
 * Expected patterns:
 * - "1. ALL CAPS TITLE" -> Main heading (h3, bold, larger)
 * - "* Subtitle text" followed by sub-bullets -> Subheading (h4, semibold)
 * - "* Content bullet" (sub-bullets) -> Normal list item
 */
export function FormattedSummary({ content }: FormattedSummaryProps) {
  const sections = parseSummary(content)

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Main heading (ALL CAPS title) with arcade accent */}
          <h3 className="text-base font-black text-stone-800 mb-3 border-l-4 border-teal-500 pl-3 uppercase tracking-wide">
            {section.title}
          </h3>

          {/* Subsections */}
          <div className="space-y-4">
            {section.subsections.map((subsection, subIdx) => (
              <div key={subIdx} className="pl-1">
                {/* Subheading */}
                {subsection.subtitle && (
                  <h4 className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400" />
                    {subsection.subtitle}
                  </h4>
                )}

                {/* Content bullets */}
                {subsection.items.length > 0 && (
                  <ul className="space-y-2 pl-4">
                    {subsection.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-sm text-stone-600 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-teal-500 mt-0.5 flex-shrink-0">*</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface ParsedSection {
  title: string
  subsections: ParsedSubsection[]
}

interface ParsedSubsection {
  subtitle: string
  items: string[]
}

function parseSummary(content: string): ParsedSection[] {
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean)
  const sections: ParsedSection[] = []

  let currentSection: ParsedSection | null = null
  let currentSubsection: ParsedSubsection | null = null

  for (const line of lines) {
    // Check for main title: "1. ALL CAPS TITLE" or just "ALL CAPS TITLE"
    const titleMatch = line.match(/^(\d+\.\s*)?([A-Z][A-Z\s&]+)$/)
    if (titleMatch && isAllCaps(titleMatch[2])) {
      // Save previous section
      if (currentSection) {
        if (currentSubsection) {
          currentSection.subsections.push(currentSubsection)
        }
        sections.push(currentSection)
      }

      currentSection = {
        title: titleMatch[2].trim(),
        subsections: [],
      }
      currentSubsection = null
      continue
    }

    // Check for subtitle bullet: "* Subtitle text" or "- Subtitle text"
    const bulletMatch = line.match(/^[•\-\*]\s*(.+)$/)
    if (bulletMatch) {
      const bulletText = bulletMatch[1].trim()

      // If we don't have a current section, create a default one
      if (!currentSection) {
        currentSection = { title: 'Summary', subsections: [] }
      }

      // Heuristic: if the bullet is short and looks like a label, treat as subtitle
      if (isSubtitlePattern(bulletText)) {
        // Save previous subsection
        if (currentSubsection) {
          currentSection.subsections.push(currentSubsection)
        }

        currentSubsection = {
          subtitle: bulletText,
          items: [],
        }
      } else {
        // It's a content item
        if (!currentSubsection) {
          // No subtitle yet, create a generic one
          currentSubsection = { subtitle: '', items: [] }
        }
        currentSubsection.items.push(bulletText)
      }
      continue
    }

    // Check for indented sub-bullets: starts with spaces/tabs then bullet
    const subBulletMatch = line.match(/^\s+[•\-\*]\s*(.+)$/)
    if (subBulletMatch) {
      const subText = subBulletMatch[1].trim()

      if (!currentSection) {
        currentSection = { title: 'Summary', subsections: [] }
      }
      if (!currentSubsection) {
        currentSubsection = { subtitle: '', items: [] }
      }

      currentSubsection.items.push(subText)
      continue
    }

    // Plain text line - could be continuation or standalone
    if (currentSubsection) {
      // Append to last item or add as new item
      if (currentSubsection.items.length > 0) {
        // Continuation of previous item
        currentSubsection.items[currentSubsection.items.length - 1] += ' ' + line
      } else {
        currentSubsection.items.push(line)
      }
    } else if (currentSection) {
      // Standalone text, create subsection for it
      currentSubsection = { subtitle: '', items: [line] }
    }
  }

  // Save final section/subsection
  if (currentSection) {
    if (currentSubsection) {
      currentSection.subsections.push(currentSubsection)
    }
    sections.push(currentSection)
  }

  // Post-process: clean up empty subtitles
  return sections.map((section) => ({
    ...section,
    subsections: section.subsections.filter(
      (sub) => sub.subtitle || sub.items.length > 0
    ),
  }))
}

function isAllCaps(text: string): boolean {
  // Check if text is mostly uppercase (allowing spaces, ampersands, numbers)
  const letters = text.replace(/[^A-Za-z]/g, '')
  if (letters.length === 0) return false
  const uppercaseLetters = letters.replace(/[^A-Z]/g, '')
  return uppercaseLetters.length / letters.length > 0.8
}

function isSubtitlePattern(text: string): boolean {
  // Subtitles are typically:
  // - Short (under 50 chars)
  // - Don't end with common sentence punctuation
  // - Often questions or labels like "What is being procured"
  // - May end with colon or nothing

  if (text.length > 80) return false

  // Common subtitle patterns
  const subtitlePatterns = [
    /^(What|Who|How|When|Where|Why|Which)\s/i,
    /^(Key|Main|Primary|Core|Essential|Critical|Important)\s/i,
    /^(Summary|Overview|Background|Context|Scope|Scale)\s?/i,
    /requirements$/i,
    /information$/i,
    /details$/i,
    /considerations$/i,
  ]

  for (const pattern of subtitlePatterns) {
    if (pattern.test(text)) return true
  }

  // Short text without sentence-ending punctuation is likely a subtitle
  if (text.length < 50 && !text.match(/[.!?]$/)) {
    return true
  }

  return false
}
