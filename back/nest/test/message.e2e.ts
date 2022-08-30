import { ChannelType } from '@prisma/client';
import * as pactum from 'pactum';

/*describe('Message Suite', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl(
      'http://localhost:3334',
    );
  });

  it('Create User1', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        email: 'us32fasdf4asdaassa@a.com',
        password: 'pass',
        username: 'acharlas2aasdfs',
      })
      .expectStatus(201)
      .stores('U1AT', 'access_token');
  });
  it('Create User2', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        email: 'usedsfasdfasd3242dfsa@a.com',
        password: 'pass',
        username: 'tcosse2asafsdfad',
      })
      .expectStatus(201)
      .stores('U2AT', 'access_token');
  });
  it('should create a public test channel', () => {
    return pactum
      .spec()
      .post('/channels')
      .withHeaders({
        Authorization: 'Bearer $S{U1AT}',
      })
      .withBody({
        name: 'message public',
        type: ChannelType.public,
        password: 'password',
      })
      .stores('pubChannelId', 'id');
  });
  it('join channel User 1', () => {
    return pactum
      .spec()
      .post('/channels/{pubChannelId}/join')
      .withPathParams(
        'pubChannelId',
        '$S{pubChannelId}',
      )
      .withHeaders({
        Authorization: 'Bearer $S{U1AT}',
      })
      .expectStatus(200);
  });
  it('join channel User 2', () => {
    return pactum
      .spec()
      .post('/channels/{pubChannelId}/join')
      .withPathParams(
        'pubChannelId',
        '$S{pubChannelId}',
      )
      .withHeaders({
        Authorization: 'Bearer $S{U2AT}',
      })
      .expectStatus(200);
  });

  describe('send message', () => {
    it('send message with user1', () => {
      return pactum
        .spec()
        .post('/channels/{pubChannelId}/messages')
        .withPathParams(
          'pubChannelId',
          '$S{pubChannelId}',
        )
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          content: 'Hello world',
        })
        .expectStatus(200)
        .expectJsonMatch({
          content: 'Hello world',
        })
        .stores('messageId', 'id');
    });
    it('send message with user2', () => {
      return pactum
        .spec()
        .post('/channels/{pubChannelId}/messages')
        .withPathParams(
          'pubChannelId',
          '$S{pubChannelId}',
        )
        .withHeaders({
          Authorization: 'Bearer $S{U2AT}',
        })
        .withBody({
          content: 'Message 2',
        })
        .expectStatus(200)
        .expectJsonMatch({
          content: 'Message 2',
        });
    });
    it('should throw if content empty', () => {
      return pactum
        .spec()
        .post('/channels/{pubChannelId}/messages')
        .withPathParams(
          'pubChannelId',
          '$S{pubChannelId}',
        )
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          content: '',
        })
        .expectStatus(400);
    });
    it('should throw if bad channelid', () => {
      return pactum
        .spec()
        .post('/channels/1234/messages')
        .withPathParams('id', '1234')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          content: 'Hello world',
        })
        .expectStatus(403);
    });
    it.todo('should throw if user muted');
    it.todo('should throw if user ban');
  });

  describe('get messages from channel', () => {
    it('get messages from channel', () => {
      return pactum
        .spec()
        .get('/channels/{pubChannelId}/messages')
        .withPathParams(
          'pubChannelId',
          '$S{pubChannelId}',
        )
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('Hello world')
        .expectBodyContains('Message 2');
    });
  });
  describe('Get messages by id', () => {
    it('get messages by id', () => {
      return pactum
        .spec()
        .get(
          '/channels/{pubChannelId}/{messageId}',
        )
        .withPathParams({
          pubChannelId: '$S{pubChannelId}',
          messageId: '$S{messageId}',
        })
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('Hello world');
    });
  });
});
*/
