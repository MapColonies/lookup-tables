import * as supertest from 'supertest';

const BASE_URL = `.../../../../src/assets`;

export class LookupTablesRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getClassificationList(): Promise<supertest.Response> {
    supertest.agent(this.app).get(`${BASE_URL}/classification`, (req, res) => {
});
    return supertest.agent(this.app).get(`${BASE_URL}/classification`).set('Content-Type', 'application/json');
  }

  public async getCountryList(excludeFieldsQuery?: string): Promise<supertest.Response> {
    const superSetCall = supertest.agent(this.app).get(`${BASE_URL}/countries`);
    if (excludeFieldsQuery != null) {
      void superSetCall.query({ excludeFieldsQuery });
    }

    return superSetCall.set('Content-Type', 'application/json');
  }

  public async getCapabilities(): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`${BASE_URL}/capabilities`).set('Content-Type', 'application/json');
  }
}
