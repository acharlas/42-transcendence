import * as pactum from 'pactum';

describe('Leaderboard Suite', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl('http://localhost:3334');
  });

  it('Create User1', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        email: 'us32fasdasdasdf4asdaassa@a.com',
        password: 'pass',
        username: 'acharasdasdlas2aasdfs',
      })
      .expectStatus(201)
      .stores('U1AT', 'access_token');
  });

  describe('Get leaderboard', () => {
    it('should get leaderboard', () => {
      return pactum
        .spec()
        .get('/leaderboard')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('us32fasdasdasdf4asdaassa@a.com');
    });
  });
});
