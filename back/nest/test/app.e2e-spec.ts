import { Test } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateChannelDto } from 'src/channel/dto';
import { ChannelType } from '@prisma/client';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3334);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3334',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'a@a.com',
      password: 'pass',
    };
    describe('Signup', () => {
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if email bad formated', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'bad-email',
          })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if email incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'bademail@fsdf.com',
            password: dto.password,
          })
          .expectStatus(403);
      });
      it('should throw if password incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: 'bad-password',
          })
          .expectStatus(403);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('shoult edit current user', () => {
        const dto: EditUserDto = {
          username: 'acharlas',
          email: 'b@b.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.username)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Channel', () => {
    describe('Get empty channels', () => {
      it('should get all channels', () => {
        return pactum
          .spec()
          .get('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
      it('should get all public channels', () => {
        return pactum
          .spec()
          .get('/channels?type=public')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
      it('should get all protected channels', () => {
        return pactum
          .spec()
          .get('/channels?type=protected')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Create channels', () => {
      describe('Create public channels', () => {
        it('should create a public channel', () => {
          return pactum
            .spec()
            .post('/channels')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody({
              name: 'First public channel',
              type: ChannelType.public,
              password: 'password',
            })
            .expectStatus(201)
            .expectBodyContains(
              ChannelType.public,
            );
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
              Authorization: 'Bearer $S{userAt}',
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
            .stores('channelId', 'id');
        });
        it('should throw if protected channel has no password', () => {
          return pactum
            .spec()
            .post('/channels')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
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
              Authorization: 'Bearer $S{userAt}',
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
              Authorization: 'Bearer $S{userAt}',
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
              Authorization: 'Bearer $S{userAt}',
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
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(2);
      });
      it('should get public channels', () => {
        return pactum
          .spec()
          .get('/channels?type=public')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
      it('should get protected channels', () => {
        return pactum
          .spec()
          .get('/channels?type=protected')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
      it('should throw if type not valid', () => {
        return pactum
          .spec()
          .get('/channels?type=notvalid')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });
      describe('Get channels by id', () => {
        it('should get channel by id', () => {
          return pactum
            .spec()
            .get('/channels/$S{channelId}')
            .withPathParams('id', '$S{channelId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBodyContains('$S{channelId}');
        });
        it('should get empty channel with bad id', () => {
          return pactum
            .spec()
            .get('/channels/1234')
            .withPathParams('id', '1234')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBody('');
        });
      });
    });

    describe('Edit channel', () => {
      it('should edit channel name', () => {
        return pactum
          .spec()
          .patch('/channels/$S{channelId}')
          .withPathParams('id', '$S{channelId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
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
          .patch('/channels/$S{channelId}')
          .withPathParams('id', '$S{channelId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
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
          .patch('/channels/$S{channelId}')
          .withPathParams('id', '$S{channelId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
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
          .patch('/channels/$S{channelId}')
          .withPathParams('id', '$S{channelId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            type: ChannelType.protected,
          })
          .expectStatus(403);
      });
    });

    describe('Delete channels', () => {
      it('should delete channel', () => {
        return pactum
          .spec()
          .delete('/channels/$S{channelId}')
          .withPathParams('id', '$S{channelId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
      it('should get one channel', () => {
        return pactum
          .spec()
          .get('/channels')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('join channels', () => {
      it.todo('join channel');
      it.todo('join protected channel');
      it.todo('throw if password incorrect');
    });

    describe('send message', () => {
      it.todo('send message');
      it.todo('throw if content empty');
    });

    describe('get channel', () => {
      it.todo('get messages from channel');
      it.todo('throw if user not on channel');
    });
  });
});
