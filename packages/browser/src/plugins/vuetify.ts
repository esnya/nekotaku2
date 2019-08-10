import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ja from 'vuetify/src/locale/ja';
import colors from 'vuetify/es5/util/colors';
import get from 'lodash-es/get';
import mapValues from 'lodash-es/mapValues';

Vue.use(Vuetify);

function parseColor(color: string): string {
  if (color.match(/^#/)) return color;
  const code = get(colors, color) as any;
  if (!code) throw new TypeError(`${color} is not valid theme color`);
  return code;
}

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: mapValues({
        primary: 'blue.darken2',
        secondary: 'grey.darken3',
        accent: 'blue.accent1',
        error: 'red.accent2',
        info: 'blue.base',
        success: 'green.base',
        warning: 'amber.base',
      }, parseColor),
    },
  },
  lang: {
    locales: { ja },
    current: 'ja',
  },
  icons: {
    iconfont: 'mdi',
  },
});
