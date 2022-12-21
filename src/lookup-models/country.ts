import { Polygon } from "geojson";
import ILookupOption from "./lookupOption";

interface ICountryOption extends ILookupOption {
  properties?: Properties;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Properties = { icon?: string, geometry?: Polygon };
export type CountryOptionalField = 'icon' | 'geometry';

export interface CountryParams {
  excludeFields: CountryOptionalField[]
}

export default ICountryOption;
