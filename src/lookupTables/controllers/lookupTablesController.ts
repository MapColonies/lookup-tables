import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ILookupOption } from '../../lookup-models';
import { LookupTablesManager } from '../models/lookupTablesManager';

type GetLookupDataHandler = RequestHandler<{ lookupKey: string }, ILookupOption[], undefined, { excludeFieldsQuery: string }>;
type GetCapabilitiesHandler = RequestHandler<undefined, string[]>;

@injectable()
export class LookupTablesController {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(LookupTablesManager) private readonly manager: LookupTablesManager
  ) {}

  public getLookupData: GetLookupDataHandler = async (req, res, next) => {
    let lookupOptionList: ILookupOption[];
    const lookupKey: string = req.params.lookupKey;
    const excludeFields: string[] = req.query.excludeFieldsQuery ? req.query.excludeFieldsQuery.split(',') : [];

    try {
      lookupOptionList = await this.manager.getLookupData(lookupKey, excludeFields);
      return res.status(httpStatus.OK).json(lookupOptionList);
    } catch (error) {
      this.logger.error({ msg: `Failed to fetch ${lookupKey} list` });
      return next(error);
    }
  };

  public getCapabilities: GetCapabilitiesHandler = (req, res, next) => {
    let capabilities: string[];

    try {
      capabilities = this.manager.getCapabilities();
      return res.status(httpStatus.OK).json(capabilities);
    } catch (error) {
      this.logger.error({ msg: 'Failed to fetch country list' });
      return next(error);
    }
  };
}
