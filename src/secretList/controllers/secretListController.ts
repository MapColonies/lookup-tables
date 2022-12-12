import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassification, ICountry } from '../../models';

import { SecretListManager } from '../models/secretListManager';

type GetCountryHandler = RequestHandler<undefined, ICountry[]>;
type GetClassificationHandler = RequestHandler<undefined, IClassification[]>;

@injectable()
export class SecretListController {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SecretListManager) private readonly manager: SecretListManager
  ) { }

  public getCountryList: GetCountryHandler = (req, res) => {
    const countryList = this.manager.getCountryList();
    return res.status(httpStatus.OK).json(countryList);
  };

  public getClassificationList: GetClassificationHandler = (req, res) => {
    const classificationList = this.manager.getClassificationList();
    return res.status(httpStatus.OK).json(classificationList);
  };
}
