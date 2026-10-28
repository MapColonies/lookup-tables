import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookupModels';
import { LookupTablesManager } from '../models/lookupTablesManager';

type GetLookupDataHandler = RequestHandler<{ lookupKey: string }, ILookupOption[], undefined, { excludeFieldsQuery?: string }>;
type GetCapabilitiesHandler = RequestHandler<undefined, string[]>;

@injectable()
export class LookupTablesController {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(LookupTablesManager) private readonly manager: LookupTablesManager
  ) {}

  public getLookupData: GetLookupDataHandler = async (req, res, next) => {
    const { lookupKey } = req.params;
    const excludeFields = req.query.excludeFieldsQuery !== undefined ? req.query.excludeFieldsQuery.split(',') : [];

    try {
      const lookupOptionList = await this.manager.getLookupData(lookupKey, excludeFields);
      return res.status(httpStatus.OK).json(lookupOptionList);
    } catch (error) {
      this.logger.error({ msg: `Failed to fetch ${lookupKey} list`, error });
      return next(error);
    }
  };

  public getCapabilities: GetCapabilitiesHandler = (req, res, next) => {
    try {
      const capabilities = this.manager.getCapabilities();
      return res.status(httpStatus.OK).json(capabilities);
    } catch (error) {
      this.logger.error({ msg: 'Failed to fetch capabilities list', error });
      return next(error);
    }
  };
}
