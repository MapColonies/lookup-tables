import jsLogger from '@map-colonies/js-logger';
import { AxiosResponse } from 'axios';
import { LookupTablesManager } from '../../../../src/lookupTables/models/lookupTablesManager';
import { requestHandler } from '../../../../src/utils';

jest.mock('../../../../src/utils', () => ({
  requestHandler: jest.fn(),
}));

const requestHandlerMock = jest.mocked(requestHandler);

const mockConfigResponse = (configName: string, config: Record<string, unknown>): void => {
  requestHandlerMock.mockResolvedValueOnce({ data: { configs: [{ configName, config }] } } as AxiosResponse);
};

/* eslint-disable @typescript-eslint/naming-convention */
describe('#LookupTablesManager', () => {
  let lookupTablesManager: LookupTablesManager;
  const originalUrl = process.env.CONFIG_MANAGEMENT_URL;

  beforeEach(() => {
    process.env.CONFIG_MANAGEMENT_URL = 'http://config-management';
    lookupTablesManager = new LookupTablesManager(jsLogger({ enabled: false }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env.CONFIG_MANAGEMENT_URL = originalUrl;
  });

  describe('#getCapabilities', () => {
    it('returns the lookup keys in camelCase', () => {
      expect(lookupTablesManager.getCapabilities()).toEqual(['hotAreas', 'countries', 'classification']);
    });
  });

  describe('#getLookupData', () => {
    it('requests the config by name and schema and returns the lookup options', async () => {
      const options = [{ value: 'ISR', translationCode: 'country.isr', translation: [] }];
      mockConfigResponse('countries', { countries: options });

      await expect(lookupTablesManager.getLookupData('countries')).resolves.toEqual(options);

      expect(requestHandlerMock).toHaveBeenCalledWith('http://config-management/api/config', 'GET', {
        config_name: 'countries',
        schema_id: 'https://mapcolonies.com/common/lookupTablesData/countries/v1',
        version: 'latest',
      });
    });

    it('maps the hotAreas key to the hot-areas config', async () => {
      mockConfigResponse('hot-areas', { hotAreas: [{ value: 'center', translationCode: 'hotArea.center' }] });

      await expect(lookupTablesManager.getLookupData('hotAreas')).resolves.toHaveLength(1);

      expect(requestHandlerMock).toHaveBeenCalledWith(
        'http://config-management/api/config',
        'GET',
        expect.objectContaining({ config_name: 'hot-areas' })
      );
    });

    it('removes excluded fields, including nested ones', async () => {
      mockConfigResponse('countries', {
        countries: [{ value: 'ISR', translationCode: 'country.isr', translation: [{ locale: 'en', text: 'Israel' }] }],
      });

      const result = await lookupTablesManager.getLookupData('countries', ['value', 'translation[0].locale']);

      expect(result).toEqual([{ translationCode: 'country.isr', translation: [{ text: 'Israel' }] }]);
    });

    it('returns an empty list when the config holds no options', async () => {
      mockConfigResponse('classification', { classification: [] });

      await expect(lookupTablesManager.getLookupData('classification')).resolves.toEqual([]);
    });

    it('throws when CONFIG_MANAGEMENT_URL is not defined', async () => {
      delete process.env.CONFIG_MANAGEMENT_URL;

      await expect(lookupTablesManager.getLookupData('countries')).rejects.toThrow('CONFIG_MANAGEMENT_URL is not defined');
      expect(requestHandlerMock).not.toHaveBeenCalled();
    });

    it('throws when the config is missing from the response', async () => {
      requestHandlerMock.mockResolvedValueOnce({ data: { configs: [] } } as unknown as AxiosResponse);

      await expect(lookupTablesManager.getLookupData('countries')).rejects.toThrow('Lookup data for countries was not found');
    });

    it('throws when the config does not contain the lookup key', async () => {
      mockConfigResponse('countries', {});

      await expect(lookupTablesManager.getLookupData('countries')).rejects.toThrow('Lookup data for countries was not found');
    });

    it('propagates request failures', async () => {
      requestHandlerMock.mockRejectedValueOnce(new Error('Request failed with status code 500'));

      await expect(lookupTablesManager.getLookupData('countries')).rejects.toThrow('Request failed with status code 500');
    });
  });
});
