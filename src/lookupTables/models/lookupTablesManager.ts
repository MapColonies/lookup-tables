import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookup-models';

const ASSETS_FOLDER_PATH = path.resolve(__dirname, '../../assets');
const JSON_EXTENSION = '.json';

@injectable()
export class LookupTablesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) {}

  public getLookupData(lookupKey: string, excludeFields: string[] = []): ILookupOption[] {
    this.logger.debug({ msg: 'get lookup data' });
    const filePath = path.join(ASSETS_FOLDER_PATH, `${lookupKey}${JSON_EXTENSION}`);
    let lookupOptionList: ILookupOption[];
    try {
      lookupOptionList = this.readListFromFile(filePath);
    } catch (error) {
      throw new Error('Incorrect lookupKey, no data found');
    }
    const filteredLookupOptions: ILookupOption[] = this.filterLookupOption(lookupOptionList, excludeFields);
    return filteredLookupOptions;
  }

  public getCapabilities(): string[] {
    this.logger.debug({ msg: 'get capabilities list' });
    const files = fs.readdirSync(ASSETS_FOLDER_PATH)
      .filter((file: any) => path.extname(file).toLowerCase() === JSON_EXTENSION);
    const assetsFileNames = files.map((file: any) => path.basename(file, JSON_EXTENSION));
    return assetsFileNames;
  }

  private filterLookupOption(lookupOptionList: ILookupOption[], excludeFields: string[]): ILookupOption[] {
    for (const option of lookupOptionList) {
      for (const field of excludeFields) {
        _.unset(option, field);
      }
    }
    return lookupOptionList;
  }

  private readListFromFile<T>(filePath: string): T[] {
    this.logger.debug({ msg: 'Try to read file', filePath });
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const list: T[] = JSON.parse(fileContent) as T[];
    return list;
  }
}
