import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';

import { getApp } from '../../../src/app';
import { SERVICES } from '../../../src/common/constants';
import { initConfig } from '../../../src/common/config';
import { ILookupOption } from '../../../src/lookup-models';
import { requestHandler } from '../../../src/utils';
import { LookupTablesRequestSender } from './helpers/requestSender';

jest.mock('../../../src/utils', () => ({
  requestHandler: jest.fn(),
}));

describe('lookupTables', function () {
  let requestSender: LookupTablesRequestSender;

  beforeAll(async function () {
    await initConfig(true);
  });

  beforeEach(async function () {
    process.env.CONFIG_MANAGEMENT_URL = 'http://mocked-config-management';

    jest.mocked(requestHandler).mockImplementation(async (_url: string, _method: string, params: Record<string, string>) => {
      const configName = params.config_name;

      /* eslint-disable */
      const configByName: Partial<Record<string, Record<string, ILookupOption[]>>> = {
        classification: {
          classification: [{ value: 'U', translationCode: 'classification.unclassified' }],
        },
        countries: {
          countries: [{ value: 'ISR', translationCode: 'country.isr', translation: [] }],
        },
        'hot-areas': {
          hotAreas: [{ value: 'center', translationCode: 'hotArea.center' }],
        },
      };
      /* eslint-enable */

      const config = configByName[configName];
      if (config == null) {
        throw new Error(`Unknown config requested in test: ${configName}`);
      }

      return Promise.resolve({
        data: {
          configs: [{ configName, config }],
        },
      } as never);
    });

    const [app] = await getApp({
      override: [
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new LookupTablesRequestSender(app);
  });

  describe('Happy Path', function () {
    it('should return 200 status code and classification list', async function () {
      const response = await requestSender.getClassificationList();
      const classification = response.body as ILookupOption[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(classification.length).toBeDefined();
    });

    it('should return 200 status code and country list', async function () {
      const response = await requestSender.getCountryList();
      const countryList = response.body as ILookupOption[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(countryList.length).toBeDefined();
    });

    it('should return 200 status code and country list without value field', async function () {
      const response = await requestSender.getCountryList('value');
      const filteredCountryList = response.body as ILookupOption[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(filteredCountryList.length).toBeDefined();
      expect(filteredCountryList[0].translation).toBeDefined();
      expect(filteredCountryList[0].value).toBeUndefined();
    });

    it('should return 200 status code and the capabilities', async function () {
      const response = await requestSender.getCapabilities();
      const capabilities = response.body as string[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(capabilities.length).toBeDefined();
    });
  });

  describe('Bad Path', function () {
    // All requests with status code of 400
  });

  describe('Sad Path', function () {
    // All requests with status code 4XX-5XX
  });
});
