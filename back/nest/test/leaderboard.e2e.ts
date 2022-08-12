import * as pactum from 'pactum';

describe('Auth e2e', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl(
      'http://localhost:3334',
    );
  });

  it.todo('Auth test');
});
