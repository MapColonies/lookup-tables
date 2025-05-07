import _ from 'lodash';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookup-models';
import { requestHandler } from '../../utils';

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
      const response = await requestHandler(`${process.env.CONFIG_MANAGEMENT_URL}/api/config`, 'GET', {
        q: 'lookup%',
      });
      return response.data.configs.map((configuration: any) => configuration.configName);
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
      const response = await requestHandler(`${process.env.CONFIG_MANAGEMENT_URL}/api/config`, 'GET', {
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
