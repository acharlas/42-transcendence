import { ChannelType } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthSignupDto } from 'src/auth/dto';
import { CreateChannelDto } from 'src/channel/dto';

describe('Channel Suite', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl('http://localhost:3334');
  });
  it('Create User1', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        email: 'useddfsassa@a.com',
        password: 'pass',
        username: 'acharlas1',
      })
      .expectStatus(201)
      .stores('U1AT', 'access_token');
  });
  it('Create User2', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        email: 'usedsdfsa@a.com',
        password: 'pass',
        username: 'tcosse1',
      })
      .expectStatus(201)
      .stores('U2AT', 'access_token');
  });
  describe('Create channels', () => {
    describe('Create public channels', () => {
      it('should create a public channel', () => {
        return pactum
          .spec()
          .post('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            name: 'First public channel',
            type: ChannelType.public,
            password: 'password',
          })
          .expectStatus(201)
          .expectBodyContains(ChannelType.public)
          .stores('pubChannelId', 'id');
      });
    });
    describe('Create protected channels', () => {
      const dto: CreateChannelDto = {
        name: 'First Channel',
        type: ChannelType.protected,
        password: 'password',
      };
      it('should create a protected channel', () => {
        return pactum
          .spec()
          .post('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            name: 'First protected channel',
            type: ChannelType.protected,
            password: 'password',
          })
          .expectStatus(201)
          .expectJsonMatch({
            type: ChannelType.protected,
          })
          .stores('proChannelId', 'id');
      });
      it('should throw if protected channel has no password', () => {
        return pactum
          .spec()
          .post('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            name: 'No password',
            type: dto.type,
          })
          .expectStatus(403);
      });
      it('should throw if protected channel has null password', () => {
        return pactum
          .spec()
          .post('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            name: 'null password',
            type: dto.type,
            password: null,
          })
          .expectStatus(403);
      });
    });
    describe('Channels errors', () => {
      const dto: CreateChannelDto = {
        name: 'First Channel',
        type: ChannelType.public,
        password: 'password',
      };
      it('should throw if name empty', () => {
        return pactum
          .spec()
          .post('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            name: '',
            type: ChannelType.protected,
            password: 'password',
          })
          .expectStatus(400);
      });
      it('should throw if name already taken', () => {
        return pactum
          .spec()
          .post('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .withBody({
            name: 'First protected channel',
            type: ChannelType.protected,
            password: 'password',
          })
          .expectStatus(403);
      });
    });
  });
  describe('Get channels', () => {
    it('should get all channels', () => {
      return pactum
        .spec()
        .get('/channels')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{pubChannelId}')
        .expectBodyContains('$S{proChannelId}');
    });
    it('should get public channels', () => {
      return pactum
        .spec()
        .get('/channels?type=public')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{pubChannelId}');
    });
    it('should get protected channels', () => {
      return pactum
        .spec()
        .get('/channels?type=protected')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{proChannelId}');
    });
    it('should throw if type not valid', () => {
      return pactum
        .spec()
        .get('/channels?type=notvalid')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(400);
    });
    describe('Get channels by id', () => {
      it('should get channel by id', () => {
        return pactum
          .spec()
          .get('/channels/$S{proChannelId}')
          .withPathParams('id', '$S{proChannelId}')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{proChannelId}');
      });
      it('should get empty channel with bad id', () => {
        return pactum
          .spec()
          .get('/channels/1234')
          .withPathParams('id', '1234')
          .withHeaders({
            Authorization: 'Bearer $S{U1AT}',
          })
          .expectStatus(403);
      });
    });
  });
  describe('Edit channel', () => {
    it('should edit channel name', () => {
      return pactum
        .spec()
        .patch('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          name: 'new name',
        })
        .expectStatus(200)
        .expectBodyContains('new name');
    });
    it('should edit channel type to protected', () => {
      return pactum
        .spec()
        .patch('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          type: ChannelType.protected,
          password: 'pass',
        })
        .expectStatus(200)
        .expectJsonMatch({
          type: ChannelType.protected,
        });
    });
    it('should edit channel type to public', () => {
      return pactum
        .spec()
        .patch('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          type: ChannelType.public,
        })
        .expectStatus(200)
        .expectJsonMatch({
          type: ChannelType.public,
        });
    });
    it('should throw error if new type is protected and no password', () => {
      return pactum
        .spec()
        .patch('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody({
          type: ChannelType.protected,
        })
        .expectStatus(403);
    });
    it('should throw if user not owner', () => {
      return pactum
        .spec()
        .patch('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U2AT}',
        })
        .withBody({
          type: ChannelType.protected,
        })
        .expectStatus(403);
    });
  });
  describe('Delete channels', () => {
    it('should throw if user not owner', () => {
      return pactum
        .spec()
        .patch('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U2AT}',
        })
        .withBody({
          type: ChannelType.protected,
        })
        .expectStatus(403);
    });
    it('should delete channel', () => {
      return pactum
        .spec()
        .delete('/channels/$S{proChannelId}')
        .withPathParams('id', '$S{proChannelId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(204);
    });
    it('should get one channel', () => {
      return pactum
        .spec()
        .get('/channels')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{pubChannelId}');
    });
  });
});
