import jsLogger from '@map-colonies/js-logger';
import { LookupTablesManager } from '../../../../src/lookupTables/models/lookupTablesManager';

let lookupTablesManager: LookupTablesManager;

describe('#LookupTablesManager', () => {
  beforeAll(() => {
    lookupTablesManager = new LookupTablesManager(jsLogger({ enabled: false }));
  });

  // describe('#getCountryList', () => {
  //   it('When we ask for country list, it return us the country list', () => {
  //     const countryList: ICountryOption[] | Partial<ICountryOption>[] = lookupTablesManager.getCountryList();
  //     expect(countryList).toBeDefined();
  //   });
  // });

  // describe('#getClassificationList', () => {
  //   it('When we ask for country list, it return us the country list', () => {
  //     const classificationList: IClassificationOption[] = lookupTablesManager.getClassificationList();
  //     expect(classificationList).toBeDefined();
  //   });
  // });
});
