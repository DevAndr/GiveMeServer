import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>   {
        console.log("interceptor");
        const isCached = true;
        if (isCached) {
          return of([]);
        }
        return next.handle();
    }

}