import fs from 'fs';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassification, ICountry } from '../../models';

@injectable()
export class DiscreteValuesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public getCountryList(): ICountry[] {
    const COUNTRY_FILE_PATH = `${process.cwd()}${'/db/country.json'}`;
    const classificationList: ICountry[] = this.getListFromFile(COUNTRY_FILE_PATH);
    return classificationList;
  }

  public getClassificationList(): IClassification[] {
    const CLASSIFICATION_FILE_PATH = `${process.cwd()}${'/db/classification.json'}`;
    const classificationList: IClassification[] = this.getListFromFile(CLASSIFICATION_FILE_PATH);
    return classificationList;
  }

  private getListFromFile<T>(filePath: string): T[] {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const list: T[] = JSON.parse(fileContent) as T[];
    return list;
  }
}
