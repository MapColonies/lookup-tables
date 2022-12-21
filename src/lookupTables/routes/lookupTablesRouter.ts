import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { LookupTablesController } from '../controllers/lookupTablesController';

const lookupTablesRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(LookupTablesController);

  router.get('/country', controller.getCountryList);
  router.get('/classification', controller.getClassificationList);
  router.post('/country/excludeFields', controller.getCountryListExcludeFields);

  return router;
};

export const LOOKUP_TABLES_ROUTER_SYMBOL = Symbol('LookupTablesRouterFactory');

export { lookupTablesRouterFactory };
