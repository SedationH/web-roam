// JSDoc

// @ts-check

/** @type {import('@babel/core').ConfigAPI} */
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3,

        }
      }
    ],
    '@babel/typescript'
  ]
}