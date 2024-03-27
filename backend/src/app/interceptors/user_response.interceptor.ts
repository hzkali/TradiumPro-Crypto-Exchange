import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilesystemService } from '../filesystem/filesystem.service';
import { app, getCountry } from '../helpers/functions';
import { User } from '../models/db/user.model';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UserResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return data;
        if (!isArray(data)) {
          if (data.edges && data.edges.length) {
            data.edges.forEach((edge) => {
              processUser(edge.node);
            });
          } else {
            processUser(data);
          }
        } else if (data.length) {
          data.forEach((user) => {
            processUser(user);
          });
        }
        return data;
      }),
    );
  }
}

function processUser(user: User) {
  const fileService = app.get(FilesystemService);
  user.avatar = fileService.url(user.avatar);
  // user.user_infos.country = user.user_infos.country
  //   ? getCountry(user.user_infos.country)
  //   : user.user_infos.country;
}
