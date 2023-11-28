import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '.././src/prisma/prisma.service'
import { AuthDto } from '.././src/auth/dto/auth.dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService)

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333')

  });

  afterAll(() => {
    app.close();
  });
  
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ian@gmail.com',
      password: '123'
    }
    describe('Signup', () => {
      it('Should throw an error if email if empty', () => {
        return pactum
            .spec()
            .post(
              '/auth/signup',
            ).withBody({
              password: dto.password
            })
            .expectStatus(400)
      });

      it('Should throw an error if password if empty', () => {
        return pactum
            .spec()
            .post(
              '/auth/signup',
            )
            .expectStatus(400)
      });

      it('Should throw an error if no value is provided', () => {
        return pactum
            .spec()
            .post(
              '/auth/signup',
            ).withBody({
              password: dto.email
            })
            .expectStatus(400)
      });

      it('Should signup', () => {
    
        return pactum
            .spec()
            .post(
              '/auth/signup',
            ).withBody(dto)
            .expectStatus(201)
      });
    });

    describe('Signin', () => {

      it('Should throw an error if email if empty', () => {
        return pactum
            .spec()
            .post(
              '/auth/signin',
            ).withBody({
              password: dto.password
            })
            .expectStatus(400)
      });

      it('Should throw an error if password if empty', () => {
        return pactum
            .spec()
            .post(
              '/auth/signin',
            ).withBody({
              password: dto.email
            })
            .expectStatus(400)
      });

      it('Should throw an error if no value is provided', () => {
        return pactum
            .spec()
            .post(
              '/auth/sigin',
            )
            .expectStatus(404)
      });

      it('Should signin', () => {
        return pactum
            .spec()
            .post(
              '/auth/signin',
            ).withBody(dto)
            .expectStatus(200)
            .stores('userAt', 'access_token')
      });
  });
});

  describe('User', () => {
    describe('Get me', () => {

      it('Should get current user', () => {
        return pactum
            .spec()
            .get(
              '/users/me',
            ).withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
      });
    });

    describe('Edit user', () => {

      it('Should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Emmanuel',
          email: 'ian@mtgh.com'
        }
        return pactum
            .spec()
            .patch(
              '/users',
            ).withHeaders({
              Authorization: 'Bearer $S{userAt}',
            }).withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email)
      });
    });
  });

  describe('Bookmarks', () => {

    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
            .spec()
            .get(
              '/bookmarks',
            ).withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBody([])
      })
    });

    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
});
