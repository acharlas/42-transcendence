import * as pactum from 'pactum';

import { EditUserDto } from '../src/user/dto';
import { FriendDto } from 'src/friend/dto';
import { BlockDto } from 'src/block/dto';
import { AuthSigninDto, AuthSignupDto } from 'src/auth/dto';

describe('Friend Block Suite', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl('http://5.182.18.157:3334');
  });

  //mockres
  it('create amis1', () => {
    const authDto: AuthSignupDto = {
      password: 'string',
      username: 'amis1.toto',
    };
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody(authDto)
      .stores('userToken1', 'access_token')
      .expectStatus(201);
  });
  it('get amis1 id', () => {
    return pactum
      .spec()
      .get('/users/me')
      .withHeaders({
        Authorization: 'Bearer $S{userToken1}',
      })
      .stores('userId1', 'id')
      .stores('username1', 'username');
  });
  it('create amis2', () => {
    const authDto: AuthSignupDto = {
      password: 'string',
      username: 'amis2.toto',
    };
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody(authDto)
      .stores('userToken2', 'access_token')
      .expectStatus(201);
  });
  it('get amis2 id', () => {
    return pactum
      .spec()
      .get('/users/me')
      .withHeaders({
        Authorization: 'Bearer $S{userToken2}',
      })
      .stores('userId2', 'id')
      .stores('username2', 'username');
  });

  describe('Friend', () => {
    describe('add/remove friend', () => {
      it('should add a friend to amis2', () => {
        const dto: FriendDto = {
          userId: '$S{userId1}',
        };
        return pactum
          .spec()
          .post('/friend/add')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            myfriend: [
              {
                id: '$S{userId1}',
                username: 'amis1.toto',
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            error: 'Must add an existing user',
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            error: 'already friend',
          });
      });
      it('should get friend', () => {
        return pactum
          .spec()
          .get('/friend/$S{userId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJsonLike({
            myfriend: [
              {
                id: '$S{userId1}',
                username: 'amis1.toto',
              },
            ],
          });
      });
      it("should throw can't look someone else friend", () => {
        return pactum
          .spec()
          .get('/friend/$S{userId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken1}',
          })
          .expectStatus(403)
          .expectJsonLike({
            error: "can't access friend from a other user",
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
            Authorization: 'Bearer $S{userToken2}',
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            error: 'no matching friend',
          })
          .expectStatus(403);
      });
      it('should get friend empty', () => {
        return pactum
          .spec()
          .get('/friend/$S{userId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJson({
            myfriend: [],
          });
      });
    });
  });
  describe('Block', () => {
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            myblock: [
              {
                id: '$S{userId1}',
                username: 'amis1.toto',
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            error: 'Must add an existing user',
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(403)
          .expectJsonLike({
            error: 'already block',
          });
      });
      it('should get block', () => {
        return pactum
          .spec()
          .get('/block/$S{userId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(200)
          .expectJsonLike({
            myblock: [
              {
                id: '$S{userId1}',
                username: 'amis1.toto',
              },
            ],
          });
      });
      it("should throw can't look someone else block", () => {
        return pactum
          .spec()
          .get('/block/$S{userId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken1}',
          })
          .expectStatus(403)
          .expectJsonLike({
            error: "can't access block from a other user",
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
            Authorization: 'Bearer $S{userToken2}',
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
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectJsonLike({
            error: 'no matching block',
          })
          .expectStatus(403);
      });
      it('should get block empty', () => {
        return pactum
          .spec()
          .get('/block/$S{userId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
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
