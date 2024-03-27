import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { graphqlUploadExpress } from 'graphql-upload';
import { getApplication } from './utils/e2e/get_application';
import { B_AuthService } from '../src/app/modules/auth/backoffice/b.auth.service';

describe('StaffAuth Resolver (e2e) test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getApplication();
    app.use(graphqlUploadExpress());
  });

  describe('StaffLogin', () => {
    it('Should return a access token', async () => {
      const mutation = () => `
          mutation login($username: String!, $password: String!){
            data: m_b_auth_login(data: {username : $username, password: $password}){
                accessToken
                refreshToken
                expireAt
            }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation(),
          variables: {
            username: 'admin@email.com',
            password: '12345678',
          },
        });
      expect(body).toHaveProperty('data');
      expect(body.data.data.accessToken).toBeDefined();
    });
  });

  describe('updateStaffProfile', () => {
    it('Should return a access token', async () => {
      const staffAuthService = app.get(B_AuthService);
      const user = await staffAuthService.login({
        username: 'admin@email.com',
        password: '12345678',
      });
      const mutation = () => `
          mutation UpdateStaffProfile($name: String!, $email: String!, $username: String!, $avatarFile: Upload, $description: String, $phone: String!){
            data: m_b_staff_updateStaffProfile(data: {email : $email, name : $name, username: $username, phone: $phone, avatarFile: $avatarFile, description:$description}){
                success
                message
            }
        }`;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send({
          query: mutation(),
          variables: {
            name: 'admin',
            email: 'admin@email.com',
            username: 'admin',
            phone: '123456789',
          },
        });

      expect(body).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data.data.success).toBeTruthy();
      expect(body.data.data.message).toBe('Profile updated successfully!');
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
