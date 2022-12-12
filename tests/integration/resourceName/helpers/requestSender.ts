import * as supertest from 'supertest';

const END_POINT = 'secretList'

export class SecretListRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getCountryList(): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/${END_POINT}/country`).set('Content-Type', 'application/json');
  }
}
