import { fileService } from '#/service';
import { toCamelCase, toInstanceName } from '#/utils';

interface InputData {
  name: string;
  dbName: string;
}

export const generateCrud = async ({ dbName, name }: InputData) => {
  const className = toCamelCase(name);
  const instanceName = toInstanceName(name);

  const variables = {
    className,
    dbName,
    instanceName,
    name
  };

  console.info(variables);

  const files = ['controller.ts', 'service.ts', 'dto.ts', 'validation.ts', 'entity.ts', 'index.ts', 'route.ts'];

  await fileService.generateTemplate({ files, name, templateFolder: 'crud', variables });
};
