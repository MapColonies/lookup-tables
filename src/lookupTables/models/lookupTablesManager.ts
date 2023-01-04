import fs from 'fs';
import path from 'path';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookup-models';

const ASSETS_FOLDER_PATH = path.resolve(__dirname, "../../assets");
const JSON_EXTENSION = ".json";

@injectable()
export class LookupTablesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public getLookupData(lookupKey: string): ILookupOption[] {
    this.logger.debug({ msg: 'get lookup data' });
    const filePath = path.join(ASSETS_FOLDER_PATH, `${lookupKey}${JSON_EXTENSION}`);
    const lookupOptionList: ILookupOption[] = this.readListFromFile(filePath);
    return lookupOptionList;
  }

  public getCapabilities(): string[] {
    this.logger.debug({ msg: 'get capabilities list' });
    const files = fs.readdirSync(ASSETS_FOLDER_PATH);
    const assetsFileNames = files.map(folder => folder.split(JSON_EXTENSION)[0]);
    
    return assetsFileNames;
  }

  private readListFromFile<T>(filePath: string): T[] {
    this.logger.debug({ msg: 'Try to read file', filePath });
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const list: T[] = JSON.parse(fileContent) as T[];
    return list;
  }
}
