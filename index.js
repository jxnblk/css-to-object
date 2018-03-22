const parse = require('css/lib/parse')
const stylis = require('stylis')

const SEL = '_'
const SELRE = new RegExp('^' + SEL)

const toObj = (css, opts = {}) => {
  const wrapped = stylis(SEL, css)
  const ast = parse(wrapped)
  const obj = transform(opts)(ast.stylesheet.rules)
  return obj
}

const transform = opts => (rules, result = {}) => {
  rules.forEach(rule => {
    if (rule.type === 'media') {
      const key = '@media ' + rule.media
      const decs = transform(opts)(rule.rules)
      result[key] = decs
      return
    }

    const [ selector ] = rule.selectors
    const key = selector.trim() === SEL ? '' : selector.replace(SELRE, opts.ampersands ? '&' : '').trim()

    if (key.length) {
      Object.assign(result, {
        [key]: getDeclarations(rule.declarations, opts)
      })
    } else {
      Object.assign(result, getDeclarations(rule.declarations, opts))
    }
  })
  return result
}

const getDeclarations = (decs, opts) => {
  const result = decs
    .map(d => ({
      key: opts.camelCase ? camel(d.property) : d.property,
      value: opts.numbers ? parsePx(d.value) : d.value
    }))
    .reduce((a, b) => {
      a[b.key] = b.value
      return a
    }, {})
  return result
}

const camel = str => str
  .replace(/(-[a-z])/g, x => x.toUpperCase())
  .replace(/-/g, '')

const parsePx = val => /^-?\d+px$/.test(val)
  ? parseFloat(val)
  : val

module.exports = toObj
