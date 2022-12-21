import fs from 'fs';
import path from 'path';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassificationOption, ICountryOption, Properties } from '../../lookup-models';
import { CountryOptionalField } from '../../lookup-models/country';

const COUNTRY_FILE_PATH = path.resolve(__dirname, "../../values/country.json");
const CLASSIFICATION_FILE_PATH = path.resolve(__dirname, "../../values/classification.json");

@injectable()
export class LookupTablesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public getClassificationList(): IClassificationOption[] {
    const classificationList: IClassificationOption[] = this.readListFromFile(CLASSIFICATION_FILE_PATH);
    this.logger.debug({ msg: 'fetch classification', classificationList });
    return classificationList;
  }

  public getCountryList(): ICountryOption[] {
    this.logger.debug({ msg: 'fetch country list' });
    const countryList: ICountryOption[] = this.readListFromFile(COUNTRY_FILE_PATH);
    return countryList;
  }

  public getCountryListExcludeFields(excludeFields: CountryOptionalField[]): ICountryOption[] {
    this.logger.debug({ msg: 'fetch country list with exclude fields', excludeFields });
    const countryList: ICountryOption[] = this.getCountryList();
    const partialCountryList: ICountryOption[] = this.filterCountryFields(countryList, excludeFields)
    return partialCountryList;
  }

  private filterCountryFields(countryList: ICountryOption[], excludeFields: CountryOptionalField[]): ICountryOption[] {
    return countryList.map(country => {
      for (const field of excludeFields) {
        const properties: Properties | undefined = country.properties;
        if (properties) {
          delete properties[field];
        }
      }
      return country;
    });
  }

  private readListFromFile<T>(filePath: string): T[] {
    this.logger.debug({ msg: 'Try to read file', filePath });
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const list: T[] = JSON.parse(fileContent) as T[];
    return list;
  }
}
