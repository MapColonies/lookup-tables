import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { DiscreteValuesController } from '../controllers/discreteValuesController';

const discreteValuesRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(DiscreteValuesController);

  router.get('/country', controller.getCountryList);
  router.get('/classification', controller.getClassificationList);
  router.post('/country/excludeFields', controller.getCountryListExcludeFields);

  return router;
};

export const DISCRETE_VALUES_ROUTER_SYMBOL = Symbol('DiscreteValuesRouterFactory');

export { discreteValuesRouterFactory };
