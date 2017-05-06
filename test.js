const test = require('ava')
const toObj = require('./index')

test('returns an object', t => {
  const obj = toObj(`color: tomato`)
  t.is(typeof obj, 'object')
})

test('parses media queries', t => {
  const obj = toObj(`
    color: tomato;
    margin-bottom: 16px;
    @media (min-width: 40em) {
      color: green;
    }
  `)
  t.is(typeof obj, 'object')
  t.deepEqual(obj, {
    color: 'tomato',
    marginBottom: 16,
    '@media (min-width: 40em)': {
      color: 'green'
    }
  })
})

test('parses psuedoclasses', t => {
  const obj = toObj(`
    color: tomato;
    &:hover {
      color: green;
    }
  `)
  t.deepEqual(obj, {
    color: 'tomato',
    ':hover': {
      color: 'green'
    }
  })
})

test('parses nested selectors', t => {
  const obj = toObj(`
    color: tomato;
    &:hover {
      color: green;
    }
    & span {
      color: blue;
    }
  `)
  t.deepEqual(obj, {
    color: 'tomato',
    ':hover': {
      color: 'green'
    },
    'span': {
      color: 'blue'
    }
  })
})

test('snapshot', t => {
  const obj = toObj(`
    color: tomato;
    margin: 32px;
    @media (min-width: 40em) {
      margin: 48px;
    }
    &:hover {
      color: black;
    }
    h1 {
      font-size: 32px;
    }
  `)
  console.log(JSON.stringify(obj, null, 2))
  t.snapshot(obj)
})
