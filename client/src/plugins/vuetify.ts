/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VTextField: {
      variant: 'outlined',
    },
  },
  theme: {
    themes: {
      dark: {
        colors: {
          background: 'ffffff',
          primary: colors.indigo.base,
          secondary: 'ffffff',
          'on-background': 'ffffff',
          'on-primary': 'ffffff',
          'on-surface': 'ffffff',
        },
        dark: true,
      },
      light: {
        colors: {
          background: 'F4F5FA',
          primary: '#FFFFFF',
          secondary: '#FFFFFF',
        },
        dark: false,
      },
    },
    defaultTheme: 'light',
  },
})
