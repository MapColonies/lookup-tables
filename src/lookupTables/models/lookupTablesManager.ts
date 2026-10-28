import _ from 'lodash';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookupModels';
import { requestHandler } from '../../utils';

const keyToSchemaIdMapKeys = new Map<string, string>([
  ['hot-areas', 'https://mapcolonies.com/common/lookupTablesData/hotAreas/v1'],
  ['countries', 'https://mapcolonies.com/common/lookupTablesData/countries/v1'],
  ['classification', 'https://mapcolonies.com/common/lookupTablesData/classification/v1'],
]);

@injectable()
export class LookupTablesManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) {}

  public async getLookupData(lookupKey: string, excludeFields: string[] = []): Promise<ILookupOption[]> {
    this.logger.debug({ msg: 'Fetching lookup data' });
    const lookupOptionList = await this.getListFromConfigManagement(lookupKey);
    return this.filterLookupOptions(lookupOptionList, excludeFields);
  }

  public getCapabilities(): string[] {
    this.logger.debug({ msg: 'Fetching capabilities list' });
    return Array.from(keyToSchemaIdMapKeys.keys()).map((key) => key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()));
  }

  private filterLookupOptions(lookupOptionList: ILookupOption[], excludeFields: string[]): ILookupOption[] {
    return lookupOptionList.map((option) => {
      excludeFields.forEach((field) => _.unset(option, field));
      return option;
    });
  }

  private async getListFromConfigManagement(lookupKey: string): Promise<ILookupOption[]> {
    try {
      const configName = lookupKey === 'hotAreas' ? 'hot-areas' : lookupKey;
      const configManagementUrl = process.env.CONFIG_MANAGEMENT_URL;

      if (configManagementUrl == null) {
        throw new Error('CONFIG_MANAGEMENT_URL is not defined');
      }

      /* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
      const response = await requestHandler(`${configManagementUrl}/api/config`, 'GET', {
        config_name: configName,
        schema_id: keyToSchemaIdMapKeys.get(lookupKey),
        version: 'latest',
      });
      const configData = response.data.configs.find((config: any) => config.configName === configName);
      const lookupOptions = configData?.config[lookupKey] as ILookupOption[] | undefined;
      /* eslint-enable */

      if (lookupOptions === undefined) {
        throw new Error(`Lookup data for ${lookupKey} was not found in config management`);
      }
      return lookupOptions;
    } catch (error) {
      this.logger.error({ msg: 'Error fetching configuration data', error });
      throw error;
    }
  }
}
