import * as supertest from 'supertest';

const BASE_URL = `/lookup-tables`;

export class LookupTablesRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getClassificationList(): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`${BASE_URL}/lookupData/classification`).set('Content-Type', 'application/json');
  }

  public async getCountryList(excludeFieldsQuery?: string): Promise<supertest.Response> {
    const superSetCall = supertest.agent(this.app).get(`${BASE_URL}/lookupData/countries`);
    if (excludeFieldsQuery != null) {
      void superSetCall.query({ excludeFieldsQuery });
    }

    return superSetCall.set('Content-Type', 'application/json');
  }

  public async getCapabilities(): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`${BASE_URL}/capabilities`).set('Content-Type', 'application/json');
  }
}
