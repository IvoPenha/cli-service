import { celebrate, Joi, Segments } from 'celebrate';

import { queryPaginationValidation } from '#/services/PaginateService';

const common<%= className %>Schema = {
  name: Joi.string().required()
};

export const create<%= className %>Schema = celebrate({
  [Segments.BODY]: {
    ...common<%= className %>Schema
  }
});

export const update<%= className %>Schema = celebrate({
  [Segments.BODY]: {
    ...common<%= className %>Schema
  },
  [Segments.PARAMS]: {
    id: Joi.number().positive().required()
  }
});

export const delete<%= className %>Schema = celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().positive().required()
  }
});

export const get<%= className %>Schema = celebrate({
  [Segments.QUERY]: {
    ...queryPaginationValidation,
    name: Joi.string().optional().allow('')
  }
});
