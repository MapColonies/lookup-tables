import jsLogger from '@map-colonies/js-logger';
import { DiscreteValuesManager } from '../../../../src/discreteValues/models/discreteValuesManager';
import { ICountry, IClassification } from '../../../../src/models';

let discreteValuesManager: DiscreteValuesManager;

describe('#DiscreteValuesManager', () => {
  beforeAll(() => {
    discreteValuesManager = new DiscreteValuesManager(jsLogger({ enabled: false }));
  });

  describe('#getCountryList', () => {
    it('When we ask for country list, it return us the country list', () => {
      const countryList: ICountry[] = discreteValuesManager.getCountryList();
      expect(countryList).toBeDefined();
    });
  });

  describe('#getClassificationList', () => {
    it('When we ask for country list, it return us the country list', () => {
      const classificationList: IClassification[] = discreteValuesManager.getClassificationList();
      expect(classificationList).toBeDefined();
    });
  });
});
