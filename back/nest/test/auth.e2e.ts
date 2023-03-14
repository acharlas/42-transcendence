import * as pactum from 'pactum';
import { AuthSignupDto } from 'src/auth/dto';

describe('Auth Suite', () => {
  beforeAll(async () => {
    pactum.request.setBaseUrl('http://5.182.18.157:3334');
  });

  const dto: AuthSignupDto = {
    password: 'pass',
    username: 'acharlas',
  };

  describe('Signup', () => {
    it('should throw if no body', () => {
      return pactum.spec().post('/auth/signup').expectStatus(400);
    });
    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ password: dto.password })
        .expectStatus(400);
    });
    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ email: dto.username })
        .expectStatus(400);
    });
    it('should signup', () => {
      return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
    });
  });
  describe('Signin', () => {
    it('should throw if no body', () => {
      return pactum.spec().post('/auth/signin').expectStatus(400);
    });
    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({ password: dto.password })
        .expectStatus(400);
    });
    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({ email: dto.username })
        .expectStatus(400);
    });
    it('should throw if password incorrect', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          password: 'bad-password',
          username: 'dasdad',
        })
        .expectStatus(403);
    });
    it('should signin', () => {
      return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(201);
    });
  });
});
