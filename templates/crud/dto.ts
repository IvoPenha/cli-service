import { type DeepPartial } from 'typeorm';

import type { QueryPagination } from '#/services/PaginateService';

import { type <%= className %> } from './<%= name %>.entity';

export type <%= className %>Dto = DeepPartial<<%= className %>>;

export type <%= className %>Paginate = QueryPagination & { name: string };
