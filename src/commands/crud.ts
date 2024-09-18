import { fileService } from '#/service';
import { toCamelCase, toInstanceName } from '#/utils';

interface InputData {
  name: string;
  dbName: string;
}

export const generateCrud = async ({ name, dbName }: InputData) => {
  const className = toCamelCase(name);
  const instanceName = toInstanceName(name);

  const variables = {
    name,
    className,
    instanceName,
    dbName
  };

  console.info(variables);

  const files = [
    'controller.ts',
    'service.ts',
    'dto.ts',
    'validation.ts',
    'entity.ts',
    'index.ts',
    'route.ts'
  ];

  await fileService.generateTemplate({name, files, variables, templateFolder: 'crud'});
};

