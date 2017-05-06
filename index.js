const { parse } = require('css')
const stylis = require('stylis')

const SEL = '_'
const SELRE = new RegExp('^' + SEL)

const toObj = css => {
  const wrapped = stylis(SEL, css)
  const ast = parse(wrapped)
  const obj = transform(ast.stylesheet.rules)
  return obj
}

const transform = (rules, result = {}) => {
  rules.forEach(rule => {
    if (rule.type === 'media') {
      const key = '@media ' + rule.media
      const decs = transform(rule.rules)
      result[key] = decs
      return
    }

    const [ selector ] = rule.selectors
    const key = selector.replace(SELRE, '').trim()

    if (key.length) {
      Object.assign(result, {
        [key]: getDeclarations(rule.declarations)
      })
    } else {
      Object.assign(result, getDeclarations(rule.declarations))
    }
  })
  return result
}

const getDeclarations = decs => {
  const result = decs
    .map(d => ({
      key: camel(d.property),
      value: parsePx(d.value)
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

const parsePx = val => /px$/.test(val)
  ? parseFloat(val.replace(/px$/, ''))
  : val

module.exports = toObj
