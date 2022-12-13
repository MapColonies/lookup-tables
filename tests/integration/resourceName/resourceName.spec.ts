import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';

import { getApp } from '../../../src/app';
import { SERVICES } from '../../../src/common/constants';
import { IClassification, ICountry } from '../../../src/models';
import { SecretListRequestSender } from './helpers/requestSender';

describe('SecretList', function () {
  let requestSender: SecretListRequestSender;
  beforeEach(function () {
    const app = getApp({
      override: [
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new SecretListRequestSender(app);
  });

  describe('Happy Path', function () {
    it('should return 200 status code and the country list', async function () {
      const response = await requestSender.getCountryList();
      const countryList = response.body as ICountry[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(countryList.length).toBeDefined();
    });

    it('should return 200 status code and the classification list', async function () {
      const response = await requestSender.getClassificationList();
      const classificationList = response.body as IClassification[];

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(classificationList.length).toBeDefined();
    });
  });

  describe('Bad Path', function () {
    // All requests with status code of 400
  });
  
  describe('Sad Path', function () {
    // All requests with status code 4XX-5XX
  });
});
