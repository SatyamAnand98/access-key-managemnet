import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = req.headers['x-request-id'];

    this.logger.log(
      `Request ${requestId}: ${method} ${originalUrl} - ${userAgent} ${req.ip}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `Response ${requestId}: ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${req.ip}`,
      );
    });

    next();
  }
}
