import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { SecretListController } from '../controllers/secretListController';

const secretListRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(SecretListController);

  router.get('/country', controller.getCountryList);
  router.get('/classification', controller.getClassificationList);

  return router;
};

export const SECRET_LIST_ROUTER_SYMBOL = Symbol('SecretListRouterFactory');

export { secretListRouterFactory };
