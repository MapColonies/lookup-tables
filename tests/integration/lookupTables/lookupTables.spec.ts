import httpStatusCodes from 'http-status-codes';
import nock from 'nock';
import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import { getApp } from '../../../src/app';
import { initConfig } from '../../../src/common/config';
import { SERVICES } from '../../../src/common/constants';
import { ILookupOption } from '../../../src/lookupModels';
import { LookupTablesRequestSender } from './helpers/requestSender';

const CONFIG_MANAGEMENT_URL = 'http://mocked-config-management';

const mockConfig = (configName: string, key: string, options: ILookupOption[]): nock.Scope =>
  nock(CONFIG_MANAGEMENT_URL)
    .get('/api/config')
    .query((query) => query.config_name === configName && query.version === 'latest')
    .reply(200, { configs: [{ configName, config: { [key]: options } }] });

describe('lookupTables', function () {
  let requestSender: LookupTablesRequestSender;
  const originalUrl = process.env.CONFIG_MANAGEMENT_URL;

  beforeAll(async function () {
    await initConfig(true);
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(function () {
    nock.enableNetConnect();
  });

  beforeEach(async function () {
    process.env.CONFIG_MANAGEMENT_URL = CONFIG_MANAGEMENT_URL;

    const [app] = await getApp({
      override: [
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new LookupTablesRequestSender(app);
  });

  afterEach(function () {
    const pendingMocks = nock.pendingMocks();
    nock.cleanAll();
    if (pendingMocks.length > 0) {
      throw new Error(`Unused nock interceptors: ${pendingMocks.join(', ')}`);
    }
    process.env.CONFIG_MANAGEMENT_URL = originalUrl;
  });

  describe('Happy Path', function () {
    it('should return 200 status code and classification list', async function () {
      const options = [{ value: 'U', translationCode: 'classification.unclassified' }];
      mockConfig('classification', 'classification', options);

      const response = await requestSender.getClassificationList();

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(response.body).toEqual(options);
    });

    it('should return 200 status code and country list', async function () {
      const options = [{ value: 'ISR', translationCode: 'country.isr', translation: [] }];
      mockConfig('countries', 'countries', options);

      const response = await requestSender.getCountryList();

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(response.body).toEqual(options);
    });

    it('should return 200 status code and country list without value field', async function () {
      mockConfig('countries', 'countries', [{ value: 'ISR', translationCode: 'country.isr', translation: [] }]);

      const response = await requestSender.getCountryList('value');
      const filteredCountryList = response.body as ILookupOption[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(filteredCountryList).toEqual([{ translationCode: 'country.isr', translation: [] }]);
    });

    it('should return 200 status code and the capabilities', async function () {
      const response = await requestSender.getCapabilities();

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(response.body).toEqual(['hotAreas', 'countries', 'classification']);
    });
  });

  describe('Sad Path', function () {
    it('should return 500 status code when config management fails', async function () {
      nock(CONFIG_MANAGEMENT_URL).get('/api/config').query(true).reply(httpStatusCodes.INTERNAL_SERVER_ERROR);

      const response = await requestSender.getCountryList();

      expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('should return 500 status code when the lookup key is missing from the config', async function () {
      nock(CONFIG_MANAGEMENT_URL).get('/api/config').query(true).reply(200, { configs: [] });

      const response = await requestSender.getCountryList();

      expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('should return 500 status code when CONFIG_MANAGEMENT_URL is not defined', async function () {
      delete process.env.CONFIG_MANAGEMENT_URL;

      const response = await requestSender.getCountryList();

      expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
