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
import { FriendDto } from 'src/friend/dto';
import { UserController } from 'src/user/user.controller';
import { userInfo } from 'os';
import { BlockDto } from 'src/block/dto';

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
    describe('Get user', () => {
      describe('Get me', () => {
        it('should get current user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLike({
              email: 'a@a.com',
            })
            .stores('userId', 'id')
            .stores('userEmail', 'email');
        });
      });
      it('should get User with id', () => {
        return pactum
          .spec()
          .get('/users/$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .stores('userId', 'id')
          .expectJsonLike({
            email: 'a@a.com',
          });
      });
      it('should throw error invalid id', () => {
        return pactum
          .spec()
          .get('/users/hihohoho')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'no such user',
          });
      });
      it('get Users', () => {
        return pactum
          .spec()
          .get('/users/')
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
    describe('add/remove friend', () => {
      it('should create amis1', () => {
        const authDto: AuthDto = {
          email: 'amis1@a.com',
          password: 'string',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .stores('userToken1', 'access_token')
          .expectStatus(201);
      });
      it('should get amis1 id', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .stores('userId1', 'id')
          .stores('userEmail1', 'email');
      });
      it('should create amis2', () => {
        const authDto: AuthDto = {
          email: 'amis2@a.com',
          password: 'string',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .stores('userToken2', 'access_token')
          .expectStatus(201);
      });
      it('should get amis2 id', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .stores('userId2', 'id')
          .stores('userEmail2', 'email');
      });
      it('should add a friend to amis2', () => {
        const dto: FriendDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/friend/add')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            myfriend: [
              {
                id: '$S{userId1}',
                email: 'amis1@a.com',
              },
            ],
          })
          .expectStatus(200);
      });
      it('should throw error invalid id', () => {
        const dto: FriendDto = {
          userId: 'totot',
        };
        return pactum
          .spec()
          .post('/friend/add')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Must add an existing user',
          });
      });
      it('should throw already friend', () => {
        const dto: FriendDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/friend/add')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'already friend',
          });
      });
      it('should get friend', () => {
        return pactum
          .spec()
          .get('/friend/$S{userId2}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJsonLike({
            myfriend: [
              {
                id: '$S{userId1}',
                email: 'amis1@a.com',
              },
            ],
          });
      });
      it("should throw can't look someone else friend", () => {
        return pactum
          .spec()
          .get('/friend/$S{userId2}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message:
              "can't access friend from a other user",
          });
      });
      it('should remove friend', () => {
        const dto: FriendDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/friend/remove')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectJson({
            myfriend: [],
          })
          .expectStatus(200);
      });
      it('should throw no matching friend', () => {
        const dto: FriendDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/friend/remove')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            message: 'no matching friend',
          })
          .expectStatus(403);
      });
      it('should get friend empty', () => {
        return pactum
          .spec()
          .get('/friend/$S{userId2}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJson({
            myfriend: [],
          });
      });
    });
    describe('add/remove block', () => {
      it('should add a block to amis2', () => {
        const dto: BlockDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/block/add')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            myblock: [
              {
                id: '$S{userId1}',
                email: 'amis1@a.com',
              },
            ],
          })
          .expectStatus(200);
      });
      it('should throw error invalid id', () => {
        const dto: BlockDto = {
          userId: 'totot',
        };
        return pactum
          .spec()
          .post('/block/add')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Must add an existing user',
          });
      });
      it('should throw already block', () => {
        const dto: BlockDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/block/add')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'already block',
          });
      });
      it('should get block', () => {
        return pactum
          .spec()
          .get('/block/$S{userId2}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJsonLike({
            myblock: [
              {
                id: '$S{userId1}',
                email: 'amis1@a.com',
              },
            ],
          });
      });
      it("should throw can't look someone else block", () => {
        return pactum
          .spec()
          .get('/block/$S{userId2}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken1}',
          })
          .expectStatus(403)
          .expectJsonLike({
            message:
              "can't access block from a other user",
          });
      });
      it('should remove block', () => {
        const dto: BlockDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/block/remove')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectJson({
            myblock: [],
          })
          .expectStatus(200);
      });
      it('should throw no matching block', () => {
        const dto: BlockDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/block/remove')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            message: 'no matching block',
          })
          .expectStatus(403);
      });
      it('should get block empty', () => {
        return pactum
          .spec()
          .get('/block/$S{userId2}')
          .withHeaders({
            Authorization:
              'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJson({
            myblock: [],
          });
      });
    });
  });

  describe('history', () => {
    it.todo('add a new history');
    it.todo('remove a hitory');
    it.todo('show history');
  });
});
