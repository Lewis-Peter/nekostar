/**
 * 代码高亮配色。
 *
 * 不用内置主题的原因：它们普遍不为对比度设计（注释故意做淡）。实测在本站的
 * 代码底色 #ede8e1 上，github-light 有 6 种 token 色低于 AA 的 4.5:1，
 * 最差只有 1.14:1；换过的 rose-pine-dawn 更差，8 种里 6 种不合格。
 *
 * 所以这套配色直接从站点色板派生，五种颜色都实测 ≥ 4.5:1：
 *
 *   浅色（底 #ede8e1）        暗色（底 #211f1b）
 *   默认   #1c1a18  14.24     #e8e4de  12.99
 *   注释   #6b6560   4.71     #9a9188   5.31
 *   关键字 #b03626   5.07     #dd6450   4.71
 *   字符串 #3c6470   5.30     #86b3c0   7.23
 *   数字   #8a5a2b   4.82     #c9a06a   6.83
 *
 * 改颜色请重新验算对比度，别凭感觉调。
 */

const SCOPES = {
  comment: ['comment', 'punctuation.definition.comment'],
  string: ['string', 'string.quoted', 'constant.character', 'constant.other.symbol'],
  number: ['constant.numeric', 'constant.language', 'constant.character.escape', 'support.constant'],
  keyword: [
    'keyword',
    'storage',
    'storage.type',
    'storage.modifier',
    'keyword.control',
    'keyword.operator',
    'entity.name.tag',
    'variable.language'
  ]
};

function build(name: string, type: 'light' | 'dark', c: Record<string, string>) {
  return {
    name,
    type,
    bg: c.bg,
    fg: c.fg,
    settings: [
      { settings: { foreground: c.fg } },
      { scope: SCOPES.comment, settings: { foreground: c.comment } },
      { scope: SCOPES.string, settings: { foreground: c.string } },
      { scope: SCOPES.number, settings: { foreground: c.number } },
      { scope: SCOPES.keyword, settings: { foreground: c.keyword } }
    ]
  };
}

export const codeThemeLight = build('nekostar-light', 'light', {
  bg: '#ede8e1',
  fg: '#1c1a18',
  comment: '#6b6560',
  keyword: '#b03626',
  string: '#3c6470',
  number: '#8a5a2b'
});

export const codeThemeDark = build('nekostar-dark', 'dark', {
  bg: '#211f1b',
  fg: '#e8e4de',
  comment: '#9a9188',
  keyword: '#dd6450',
  string: '#86b3c0',
  number: '#c9a06a'
});
