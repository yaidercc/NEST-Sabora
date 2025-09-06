import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CleanEmptyFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    if (request.body) {
      Object.keys(request.body).forEach(key => {
        if (request.body[key] === '' || request.body[key] === null) {
          delete request.body[key];
        }
      });
    }

    return next.handle();
  }
}
