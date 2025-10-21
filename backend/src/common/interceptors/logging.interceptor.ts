import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


export class LogginInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();
        console.log(`${method} ${url} ${now}`);
        return next.handle().pipe(
            tap(()=>{
                const response = Date.now(); - now;
                console.log(`${method} ${url} ${response}`);
            })
        );
    }

}