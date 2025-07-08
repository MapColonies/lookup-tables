import _ from 'lodash';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookupModels';
import { requestHandler } from '../../utils';

const keyToSchemaIdMapKeys = new Map<string, string>(
  Object.entries({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'hot-areas': 'https://mapcolonies.com/common/lookupTablesData/hotAreas/v1',
    countries: 'https://mapcolonies.com/common/lookupTablesData/countries/v1',
    classification: 'https://mapcolonies.com/common/lookupTablesData/classification/v1',
  })
);

@injectable()
export class LookupTablesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) {}

  public async getLookupData(lookupKey: string, excludeFields: string[] = []): Promise<ILookupOption[]> {
    this.logger.debug({ msg: 'get lookup data' });
    let lookupOptionList: ILookupOption[];
    lookupOptionList = await this.getListFromConfigManagement(lookupKey);
    const filteredLookupOptions: ILookupOption[] = this.filterLookupOption(lookupOptionList, excludeFields);
    return filteredLookupOptions;
  }

  public async getCapabilities(): Promise<string[]> {
    this.logger.debug({ msg: 'get capabilities list' });
    try {
      return Array.from(keyToSchemaIdMapKeys.keys()).map(key => key.replace(/-([a-z])/g, g => g[1].toUpperCase()));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  };

  private filterLookupOption(lookupOptionList: ILookupOption[], excludeFields: string[]): ILookupOption[] {
    for (const option of lookupOptionList) {
      for (const field of excludeFields) {
        _.unset(option, field);
      }
    }
    return lookupOptionList;
  }

  private readonly getListFromConfigManagement = async (lookupKey: string): Promise<ILookupOption[]> => {
    try {
      const configName = lookupKey === 'hotAreas' ? 'hot-areas' : lookupKey;

      /* eslint-disable @typescript-eslint/naming-convention */
      const response = await requestHandler(`${process.env.CONFIG_MANAGEMENT_URL}/api/config`, 'GET', {
        config_name: configName,
        schema_id: keyToSchemaIdMapKeys.get(lookupKey),
        version: 'latest',
      });
      /* eslint-enable @typescript-eslint/naming-convention */

      return response.data.configs.find((configuration: any) => configuration.configName === configName).config[lookupKey] as ILookupOption[];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  };
}
