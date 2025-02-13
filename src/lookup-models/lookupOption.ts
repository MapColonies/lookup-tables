enum Locale {
  ENGLISH = 'en',
  HEBREW = 'he'
}

interface ILookupOption {
  value: string;
  translationCode?: string;
  translation?: {'locale': Locale, 'text': string}[];
  properties?: Record<string, unknown>;
}

export { ILookupOption };
