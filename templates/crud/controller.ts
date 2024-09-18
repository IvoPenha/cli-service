import type { NextFunction, Request, Response } from 'express';

import { Catch } from '#/services/HttpServer/exceptions/catch-controller.decorator';
import { NotImplementedException } from '#/services/HttpServer/exceptions/NotImplementedException';
 
import type { <%= className %>Service } from './<%= name %>.service';

@Catch()
export class <%= className %>Controller {
  constructor(private readonly <%= instanceName %>Service: <%= className %>Service) {}

  async noop(_req: Request, _res: Response, _next: NextFunction) {
    throw new NotImplementedException();
  }
}
