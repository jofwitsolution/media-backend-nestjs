import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, catchError, of } from 'rxjs';
  import { map } from 'rxjs/operators';

  interface Error {
    status: string,
    message: string
  }

  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          // const { statusCode } = context.switchToHttp().getResponse();

          return {
            status: data?.status,
            message: data?.message,
            data: data?.data,          
          };
        }),
        catchError((err) => {
          const error: Error = {
            status: 'error',
            message: err.message,
          };
          return of(error);
        }),
      );
    }
  }
  