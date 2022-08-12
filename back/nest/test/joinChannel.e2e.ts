import { ChannelType } from '@prisma/client';
import * as pactum from 'pactum';

describe('Join/Leave Suite', () => {
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
        email: 'us324assa@a.com',
        password: 'pass',
        username: 'acharlas2as',
      })
      .expectStatus(201)
      .stores('U1AT', 'access_token');
  });
  it('Create User2', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        email: 'useds3242dfsa@a.com',
        password: 'pass',
        username: 'tcosse2asd',
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
        name: 'join public channel',
        type: ChannelType.public,
        password: 'password',
      })
      .stores('pubChannelId', 'id');
  });
  it('should create a protected test channel', () => {
    return pactum
      .spec()
      .post('/channels')
      .withHeaders({
        Authorization: 'Bearer $S{U1AT}',
      })
      .withBody({
        name: 'join protected channel',
        type: ChannelType.protected,
        password: 'password',
      })
      .stores('proChannelId', 'id');
  });
  describe('Join channel', () => {
    describe('Join public channel', () => {
      it('join public channel', () => {
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
    });
    describe('Join protected channel', () => {
      it('should throw if password incorrect', () => {
        return pactum
          .spec()
          .post('/channels/{proChannelId}/join')
          .withPathParams(
            'pubChannelId',
            '$S{proChannelId}',
          )
          .withHeaders({
            Authorization: 'Bearer $S{U2AT}',
          })
          .withBody({
            password: 'pass',
          })
          .expectStatus(403);
      });
      it('should throw if password null', () => {
        return pactum
          .spec()
          .post('/channels/$S{proChannelId}/join')
          .withPathParams(
            'id',
            '$S{proChannelId}',
          )
          .withHeaders({
            Authorization: 'Bearer $S{U2AT}',
          })
          .withBody({
            password: null,
          })
          .expectStatus(403);
      });
      it('should throw if password undefined', () => {
        return pactum
          .spec()
          .post('/channels/{proChannelId}/join')
          .withPathParams(
            'proChannelId',
            '$S{proChannelId}',
          )
          .withHeaders({
            Authorization: 'Bearer $S{U2AT}',
          })
          .withBody({})
          .expectStatus(403);
      });
      it('should join protected channel', () => {
        return pactum
          .spec()
          .post('/channels/{proChannelId}/join')
          .withPathParams(
            'proChannelId',
            '$S{proChannelId}',
          )
          .withHeaders({
            Authorization: 'Bearer $S{U2AT}',
          })
          .withBody({
            password: 'password',
          })
          .expectStatus(200);
      });
    });
    describe('Errors', () => {
      it('Error if channelId incorrect', () => {
        return pactum
          .spec()
          .post('/channels/12345/join')
          .withPathParams('id', '12345')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            password: 'password',
          })
          .expectStatus(403);
      });
    });
  });
  describe('Leave channel', () => {
    it('leave channel', () => {
      return pactum
        .spec()
        .post('/channels/$S{proChannelId}/leave')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200);
    });
    it('throw if channelId incorrect', () => {
      return pactum
        .spec()
        .post('/channels/1234/leave')
        .withPathParams('id', '1234')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(403);
    });
  });
});
