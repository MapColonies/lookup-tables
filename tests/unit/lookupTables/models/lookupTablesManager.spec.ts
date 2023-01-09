import jsLogger from '@map-colonies/js-logger';
import { LookupTablesManager } from '../../../../src/lookupTables/models/lookupTablesManager';

let lookupTablesManager: LookupTablesManager;

describe('#LookupTablesManager', () => {
  beforeAll(() => {
    lookupTablesManager = new LookupTablesManager(jsLogger({ enabled: false }));
  });

  describe('#getCapabilities', () => {
    it('When we ask for capabilities list, it return us non empty string list', () => {
      const capabilities: string[] = lookupTablesManager.getCapabilities();
      expect(capabilities.length).toBeDefined();
    });
  });
});
