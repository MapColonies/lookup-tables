import jsLogger from '@map-colonies/js-logger';
import { SecretListManager } from '../../../../src/secretList/models/secretListManager';
import { ICountry, IClassification } from '../../../../src/models';

let secretListManager: SecretListManager;

describe('#SecretListManager', () => {
  beforeAll(() => {
    secretListManager = new SecretListManager(jsLogger({ enabled: false }));
  });

  describe('#getCountryList', () => {
    it('When we ask for country list, it return us the country list', () => {
      const countryList: ICountry[] = secretListManager.getCountryList();
      expect(countryList).toBeDefined();
    });
  });

  describe('#getClassificationList', () => {
    it('When we ask for country list, it return us the country list', () => {
      const classificationList: IClassification[] = secretListManager.getClassificationList();
      expect(classificationList).toBeDefined();
    });
  });
});
