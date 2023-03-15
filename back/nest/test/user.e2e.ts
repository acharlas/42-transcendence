import * as pactum from 'pactum';
import { EditUserDto } from 'src/user/dto';

describe('User Suite', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl('http://5.182.18.157:3334');
  });
  it('Create User1', () => {
    return pactum
      .spec()
      .post('/auth/signup')
      .withBody({
        password: 'pass',
        username: 'asfsdfgdfgdsf',
      })
      .expectStatus(201)
      .stores('U1AT', 'access_token');
  });
  describe('Get me', () => {
    it('should get current user', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200);
    });
  });
  describe('Edit user', () => {
    it('shoult edit current user', () => {
      const dto: EditUserDto = {
        username: 'dasdadasd',
      };
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.username);
    });
  });
  describe('Get user', () => {
    it('should get current user', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectJsonLike({
          username: 'dasdadasd',
        })
        .stores('userId', 'id')
        .stores('username', 'username');
    });
    it('should get User with id', () => {
      return pactum
        .spec()
        .get('/users/$S{userId}')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200)
        .expectJsonLike({
          username: '$S{username}',
        });
    });
    it('should throw error invalid id', () => {
      return pactum
        .spec()
        .get('/users/hihohohooooooooooooooooooo')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
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
          Authorization: 'Bearer $S{U1AT}',
        })
        .expectStatus(200);
    });
  });
});
