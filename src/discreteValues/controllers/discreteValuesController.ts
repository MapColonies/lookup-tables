import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassification, ICountry } from '../../models';
import { CountryField, CountryParams } from '../interfaces/interfaces';
import { DiscreteValuesManager } from '../models/discreteValuesManager';

type GetCountryHandler = RequestHandler<CountryParams, ICountry[] | Partial<ICountry>[]>;
type GetClassificationHandler = RequestHandler<undefined, IClassification[]>;
type GetCountryListExcludeFieldsHandler = RequestHandler<undefined, ICountry[], CountryField[]>;

@injectable()
export class DiscreteValuesController {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(DiscreteValuesManager) private readonly manager: DiscreteValuesManager
  ) { }

  public getCountryList: GetCountryHandler = (req, res, next) => {
    let countryList;

    try {
      countryList = this.manager.getCountryList();
      return res.status(httpStatus.OK).json(countryList);
    } catch (error) {
      this.logger.error({ msg: 'Failed to fetch country list' });
      return next(error)
    }
  };

  public getCountryListExcludeFields: GetCountryListExcludeFieldsHandler = (req, res, next) => {
    let countryList;
    const excludeFields: CountryField[] = req.body;

    try {
      countryList = this.manager.getCountryListExcludeFields(excludeFields);
      return res.status(httpStatus.OK).json(countryList);
    } catch (error) {
      this.logger.error({ msg: 'Failed to fetch country list' });
      return next(error)
    }
  };

  public getClassificationList: GetClassificationHandler = (req, res, next) => {
    let classificationList;
    
    try {
      classificationList = this.manager.getClassificationList();
      return res.status(httpStatus.OK).json(classificationList);
    } catch (error) {
      this.logger.error({ msg: 'Failed to fetch country list' });
      return next(error)
    }
  };
}
