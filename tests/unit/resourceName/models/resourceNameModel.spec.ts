import jsLogger from '@map-colonies/js-logger';
import { SecretListManager } from '../../../../src/SecretList/models/SecretListManager';

let SecretListManager: SecretListManager;

describe('SecretListManager', () => {
  beforeEach(function () {
    SecretListManager = new SecretListManager(jsLogger({ enabled: false }));
  });
  describe('#getResource', () => {
    it('return the resource of id 1', function () {
      // action
      const resource = SecretListManager.getResource();

      // expectation
      expect(resource.id).toBe(1);
      expect(resource.name).toBe('ronin');
      expect(resource.description).toBe('can you do a logistics run?');
    });
  });
  describe('#createResource', () => {
    it('return the resource of id 1', function () {
      // action
      const resource = SecretListManager.createResource({ description: 'meow', name: 'cat' });

      // expectation
      expect(resource.id).toBeLessThanOrEqual(100);
      expect(resource.id).toBeGreaterThanOrEqual(0);
      expect(resource).toHaveProperty('name', 'cat');
      expect(resource).toHaveProperty('description', 'meow');
    });
  });
});
