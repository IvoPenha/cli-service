import { Router } from 'express';

import { dataSource } from '#/useCases/datasource.service';

import { paginateService } from '../paginate.service';

import { <%= className %>Controller } from './<%= name %>.controller';
import { <%= className %>Service } from './<%= name %>.service';

const <%= instanceName %>Service = new <%= className %>Service(dataSource, paginateService);

const controller = new <%= className %>Controller(<%= instanceName %>Service);

const <%= className %>Route = Router();

<%= className %>Route.get('/', (...n) => controller.noop(...n));

export { <%= className %>Route, <%= instanceName %>Service };
