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
        const dto: CreateChannelDto = {
          name: 'First Channel',
          type: ChannelType.public,
        };
        it('should create a channel', () => {
          return pactum
            .spec()
            .post('/channels')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(201);
        });
        it.todo(
          'should throw if name bad formated',
        );
      });
    });

    describe('get channels', () => {
      it.todo('get channel by id');
      it.todo('get channels');
    });

    describe('edit channel', () => {
      it.todo('edit channel');
      it.todo(
        'should throw if name bad formated',
      );
    });

    describe('delete channels', () => {
      it.todo('delete channel');
      it.todo('throw if user not owner');
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
