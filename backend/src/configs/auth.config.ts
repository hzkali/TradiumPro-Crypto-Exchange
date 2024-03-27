import { registerAs } from '@nestjs/config';
import { AuthConfig as AuthConfigInterface } from './config.interface';
import { User } from '../app/models/db/user.model';
import { Staff } from '../app/models/db/staff.model';
import { B_AuthService } from '../app/modules/auth/backoffice/b.auth.service';
import { F_AuthService } from '../app/modules/auth/frontend/f.auth.service';

export const AuthConfig = registerAs(
  'auth',
  (): AuthConfigInterface => ({
    default: 'user',
    providers: {
      user: {
        model: User,
        service: F_AuthService,
      },
      staff: {
        model: Staff,
        service: B_AuthService,
      },
    },
  }),
);
