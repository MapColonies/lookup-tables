import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { LookupTablesController } from '../controllers/lookupTablesController';

const lookupTablesRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(LookupTablesController);

  router.get('/lookupData/:lookupKey', controller.getLookupData);
  router.get('/capabilities', controller.getCapabilities);

  return router;
};

export const LOOKUP_TABLES_ROUTER_SYMBOL = Symbol('LookupTablesRouterFactory');

export { lookupTablesRouterFactory };
