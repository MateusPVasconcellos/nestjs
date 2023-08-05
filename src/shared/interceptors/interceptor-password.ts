import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (value) {
          if (isArray(value)) {
            value.forEach((e) => {
              e.password = undefined;
            });
          }
          if (value.password) value.password = undefined;
          return value;
        }
      }),
    );
  }
}
