import fs from 'fs';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassification, ICountry } from '../../models';

@injectable()
export class SecretListManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public getCountryList(): ICountry[] {
    const countryFilePath = '../../../db/country.json';
    const classificationList: ICountry[] = this.getListFromFile(countryFilePath);
    return classificationList;
  }

  public getClassificationList(): IClassification[] {
    const classificationFilePath = '../../../db/classification.json';
    const classificationList: IClassification[] = this.getListFromFile(classificationFilePath);
    return classificationList;
  }

  private getListFromFile<T>(filePath: string): T[] {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const list: T[] = JSON.parse(fileContent) as T[];
    return list;
  }
}
