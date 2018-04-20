const toObj = require('.')

it('returns an object', () => {
  const obj = toObj(`color: tomato`)
  expect(typeof obj).toBe('object')
})

it('parses media queries', () => {
  const obj = toObj(`
    color: tomato;
    margin-bottom: 16px;
    @media (min-width: 40em) {
      color: green;
    }
  `, {
      numbers: true,
      camelCase: true,
    })
  expect(typeof obj).toBe('object')
  expect(obj).toEqual({
    color: 'tomato',
    marginBottom: 16,
    '@media (min-width: 40em)': {
      color: 'green'
    }
  })
})

it('parses pseudoclasses', () => {
  const obj = toObj(`
    color: tomato;
    &:hover {
      color: green;
    }
  `)
  expect(obj).toEqual({
    color: 'tomato',
    '&:hover': {
      color: 'green'
    }
  })
})

it('parses nested selectors', () => {
  const obj = toObj(`
    color: tomato;
    &:hover {
      color: green;
    }
    & span {
      color: blue;
    }
  `)
  expect(obj).toEqual({
    color: 'tomato',
    '&:hover': {
      color: 'green'
    },
    '& span': {
      color: 'blue'
    }
  })
})

it('snapshot', () => {
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
  `, {
      camelCase: true,
      numbers: true
    })
  expect(obj).toMatchSnapshot()
})
