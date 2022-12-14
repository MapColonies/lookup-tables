import fs from 'fs';
import path from 'path';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassification, ICountry } from '../../models';
import { CountryField } from '../interfaces/interfaces';

const COUNTRY_FILE_PATH = path.resolve(__dirname, "../../values/country.json");
const CLASSIFICATION_FILE_PATH = path.resolve(__dirname, "../../values/classification.json");

@injectable()
export class DiscreteValuesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public getClassificationList(): IClassification[] {
    const classificationList: IClassification[] = this.readListFromFile(CLASSIFICATION_FILE_PATH);
    this.logger.debug({ msg: 'fetch classification', classificationList });
    return classificationList;
  }

  public getCountryList(): ICountry[] {
    this.logger.debug({ msg: 'fetch country list' });
    const countryList: ICountry[] = this.readListFromFile(COUNTRY_FILE_PATH);
    return countryList;
  }

  public getCountryListExcludeFields(excludeFields: CountryField[]): ICountry[] {
    this.logger.debug({ msg: 'fetch country list with exclude fields', excludeFields });
    const countryList: ICountry[] = this.getCountryList();
    const partialCountryList: ICountry[] = this.filterCountryFields(countryList, excludeFields)
    return partialCountryList;
  }

  private filterCountryFields(countryList: ICountry[], excludeFields: CountryField[]): ICountry[] {
    return countryList.map(country => {
      excludeFields.forEach(field => delete country[field]);
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
