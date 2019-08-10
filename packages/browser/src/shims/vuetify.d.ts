declare module 'vuetify/lib' {
  export default class Vuetify {
    public static install(options: {}): void;
    public constructor(options: {});
  }
}

declare module 'vuetify/es5/util/colors' {
  const colors: {
    [key: string]: {
      [key: string]: string;
    };
  };
  export default colors;
}
