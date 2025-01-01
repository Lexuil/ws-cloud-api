export type Wildcard = '*' | '~' | '_' | '```' | '`' | string

export interface IRule {
  wildcard: Wildcard
  openTag: string
  closeTag: string
}

function execRule (text: string, rule: IRule): string {
  const { wildcard, openTag, closeTag } = rule

  // Add tags using regex
  const regex = new RegExp(`\\${wildcard}(.+?)\\${wildcard}`, 'gi')
  const final = text.replace(regex, `${openTag}$1${closeTag}`)

  return final
}

function parseText (text: string, rules: IRule[]): string {
  const final: string = rules.reduce(
    (transformed, rule) => {
      return execRule(transformed, rule)
    },
    text
  )

  return final.replace(/\n/gi, '<br>')
}

export const whatsappRules: IRule[] = [
  {
    closeTag: '</strong>',
    openTag: '<strong>',
    wildcard: '*'
  },
  {
    closeTag: '</i>',
    openTag: '<i>',
    wildcard: '_'
  },
  {
    closeTag: '</s>',
    openTag: '<s>',
    wildcard: '~'
  },
  {
    closeTag: '</code>',
    openTag: '<code>',
    wildcard: '```'
  },
  {
    closeTag: '</code>',
    openTag: "<code style='background-color: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 0.2rem;'>",
    wildcard: '`'
  }
]

export function format (text: string, rules?: IRule[]): string {
  return parseText(text, rules ?? whatsappRules)
}
