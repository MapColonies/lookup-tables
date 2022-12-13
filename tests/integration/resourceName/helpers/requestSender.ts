import * as supertest from 'supertest';

export class DiscreteValuesRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getCountryList(): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/country`).set('Content-Type', 'application/json');
  }

  public async getClassificationList(): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/classification`).set('Content-Type', 'application/json');
  }
}
