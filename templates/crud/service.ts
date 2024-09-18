import { type DeepPartial, type Repository } from 'typeorm';

import type { DataSourceService } from '#/services/DataSourceService';
import { LogClass } from '#/services/LoggerService/log-class.decorator';
import type { IResponsePaginated, PaginateService } from '#/services/PaginateService';

import { parseOrderDto } from '#/database/db.helper';

import type { <%= className %>Dto, <%= className %>Paginate } from './<%= name %>.dto';
import { <%= className %> } from './<%= name %>.entity';

type <%= className %>FindOption = {
  id: number;
};

@LogClass
export class <%= className %>Service {
  private repo: Repository<<%= className %>>;

  constructor(
    private readonly dataSource: DataSourceService,
    private readonly paginateService: PaginateService
  ) {
    this.repo = this.dataSource.getRepository(<%= className %>);
  }

  async create(data: DeepPartial<<%= className %>>) {
    data.createdAt = new Date();
    const save = this.repo.create(data);
    const result = await this.repo.save(save);
    return result;
  }

  async update(id: number, data: DeepPartial<<%= className %>>) {
    const result = await this.repo.update(id, {
      ...data
    });
    return result;
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    return result;
  }

  async findOne(data: <%= className %>FindOption) {
    const { id } = data;
    const repository = this.dataSource.getRepository(<%= className %>);
    const result = await repository.findOne({
      where: {
        id
      }
    });
    return result;
  }

  async paginate({ name, order, search, ...pagination }: <%= className %>Paginate): Promise<IResponsePaginated<<%= className %>Dto>> {
    const searchFields = ['<%= className %>.ip', '<%= className %>.title', '<%= className %>.id'];

    const query = this.repo.createQueryBuilder('<%= className %>').select(); 

    const querySearch = search ? searchFields.map(field => `<%= className %>.${field} LIKE :search`) : null;

    if (querySearch) query.andWhere(`(${querySearch.join(' OR ')})`, { search: `%${search}%` });

    if (name) query.andWhere('<%= className %>.name = :name', { name });

    // order
    parseOrderDto({ order, table: '<%= className %>' }).querySetup(query);
    query.addOrderBy('<%= className %>.id', 'DESC');

    const paginated = (await this.paginateService.paginate(query, pagination)) as IResponsePaginated<<%= className %>Dto>;

    return paginated;
  }
}