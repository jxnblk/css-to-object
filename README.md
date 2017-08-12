
# css-to-object

Convert flat CSS rules to JavaScript style objects

Useful for css-in-js libraries

```sh
npm i css-to-object
```

```js
const cssToObject = require('css-to-object')

const style = cssToObject(`
  color: tomato;
  padding: 16px;
  @media (min-width: 40em) {
    paddingLeft: 32px;
    paddingRight: 32px;
  }
  &:hover: {
    color: black;
  }
  & h1 {
    font-size: 48px;
  }
`, {
  camelCase: true,
  numbers: true
})

// {
//   color: 'tomato',
//   padding: 16,
//   '@media (min-width: 40em)': {
//     paddingLeft: 32,
//     paddingRight: 32,
//   },
//   ':hover': {
//     color: 'black'
//   },
//   h1: {
//     fontSize: 48
//   }
// }
```

## Options

- `numbers`: Converts px values to numbers
- `camelCase`: converts CSS properties to camelCased keys


[MIT License](LICENSE.md)
