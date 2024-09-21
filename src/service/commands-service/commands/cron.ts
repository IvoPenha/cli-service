import { fileService } from '#/service';
import { toCamelCase, toConstantCase, toInstanceName } from '#/utils';

interface InputData {
  name: string;
}

export const generateCron = async ({ name }: InputData) => {
  const className = toCamelCase(name);
  const instanceName = toInstanceName(name);
  const keyName = toConstantCase(name);

  const variables = {
    className,
    instanceName,
    keyName,
    name
  };

  console.info(variables);

  const files = ['job.ts', 'queue.ts', 'route.ts', 'index.ts'];

  await fileService.generateTemplate({ files, name, templateFolder: 'cron', variables });
};
