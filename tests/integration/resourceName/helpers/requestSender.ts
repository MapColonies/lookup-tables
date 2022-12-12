import * as supertest from 'supertest';

export class SecretListRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getResource(): Promise<supertest.Response> {
    return supertest.agent(this.app).get('/SecretList').set('Content-Type', 'application/json');
  }

  public async createResource(): Promise<supertest.Response> {
    return supertest.agent(this.app).post('/SecretList').set('Content-Type', 'application/json');
  }
}
