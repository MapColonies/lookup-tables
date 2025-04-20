import { CountryTranslation } from '@map-colonies/types';

interface ILookupOption {
  value: string;
  translationCode?: string;
  translation?: CountryTranslation[];
  properties?: Record<string, unknown>;
}

export { ILookupOption };
