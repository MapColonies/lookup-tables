import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookup-models';
import { requestHandler } from '../../utils';

const ASSETS_FOLDER_PATH = path.resolve(__dirname, '../../assets');
const JSON_EXTENSION = '.json';

@injectable()
export class LookupTablesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) {}

  public async getLookupData(lookupKey: string, excludeFields: string[] = []): Promise<ILookupOption[]> {
    this.logger.debug({ msg: 'get lookup data' });
    const filePath = path.join(ASSETS_FOLDER_PATH, `${lookupKey}${JSON_EXTENSION}`);
    let lookupOptionList: ILookupOption[];

    lookupOptionList = await this.getListFromConfigManagement(lookupKey);
    
    const filteredLookupOptions: ILookupOption[] = this.filterLookupOption(lookupOptionList, excludeFields);
    return filteredLookupOptions;
  }

  public getCapabilities(): string[] {
    this.logger.debug({ msg: 'get capabilities list' });
    const files = fs.readdirSync(ASSETS_FOLDER_PATH).filter((file) => path.extname(file).toLowerCase() === JSON_EXTENSION);
    const assetsFileNames = files.map((file) => path.basename(file, JSON_EXTENSION));
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

  private readonly getListFromConfigManagement = async (lookupKey: string): Promise<ILookupOption[]> => {
    try {
      const configName = lookupKey === 'hotAreas' ? 'hot-areas' : lookupKey;
      const response = await requestHandler(process.env.CONFIG_MANAGEMENT_URL as string, 'GET', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        config_name: configName,
        version: 'latest',
      });

      // eslint-disable-next-line
      return response.data.configs.find((configuration: any) => configuration.configName === configName).config[lookupKey] as ILookupOption[];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  };
}
