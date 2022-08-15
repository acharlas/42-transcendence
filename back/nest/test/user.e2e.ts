import * as pactum from 'pactum';
import { AuthSignupDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('User Suite', () => {
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
        email: 'usedsa@a.com',
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
        email: 'b@b.com',
      };
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{U1AT}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.username)
        .expectBodyContains(dto.email);
    });
  });
});
