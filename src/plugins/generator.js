// Imports
const {
 generatePreset,
 injectGoogleFontLink,
} = require('@vuetify/cli-plugin-utils')

// Updates the Vuetify object with provided preset
module.exports = api => generatePreset(api, 'preset-name', () => {
 // Invoked after the generator has completed.
 // A common use-case is adding font links

 // Will automatically apply the default font-weights
 // 100,300,400,500,700,900
 injectGoogleFontLink(api, 'Roboto')

 // Will only use the defined font-weights
 injectGoogleFontLink(api, 'Roboto:100,300,400,500,700,900')

 // Works the same as the above, but accepts multiple values
 injectGoogleFontLink(api, [
  'Roboto:100,300,400,500,700,900',
 ])
})
