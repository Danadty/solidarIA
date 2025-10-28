import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction , Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = uuidv4();
        req.headers['x-request-id'] = requestId;//uso interno
        res.setHeader('X-Request-Id', requestId);//uso externo
        console.log(
            `Request ID: ${requestId} - ${req.method} ${req.url}`
        );
        next();
    }
    
}