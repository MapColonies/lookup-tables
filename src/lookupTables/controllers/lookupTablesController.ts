import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IClassificationOption, ICountryOption } from '../../lookup-models';
import { CountryOptionalField, CountryParams } from '../../lookup-models/country';
import { LookupTablesManager } from '../models/lookupTablesManager';

type GetCountryHandler = RequestHandler<undefined, ICountryOption[]>;
type GetClassificationHandler = RequestHandler<undefined, IClassificationOption[]>;
type GetCountryListExcludeFieldsHandler = RequestHandler<undefined, ICountryOption[], CountryParams>;

@injectable()
export class LookupTablesController {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(LookupTablesManager) private readonly manager: LookupTablesManager
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
    const countryParams: CountryParams = req.body;
    const excludeFields: CountryOptionalField[] = countryParams.excludeFields;

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
