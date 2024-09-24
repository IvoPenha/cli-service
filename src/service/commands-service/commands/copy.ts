import { fileService } from '#/service/file-service';
import { isValidString, toCamelCase, toInstanceName } from '#/utils';


export const copyFromPath = async (
  {  destPath, dirPath, destName, dirName }: { 
  destPath: string;
  dirPath: string;
  destName?: string;
  dirName?: string;
}) => { 
  const bothBarRegex = /[/\\]/
  const name = isValidString(destName)|| destPath.split(bothBarRegex).pop();
  const templateFileName = isValidString(dirName) || dirPath.split(bothBarRegex).pop();
 
  const className = toCamelCase(name);
  const instanceName = toInstanceName(name);

  const variables = {
    from: {
      name: templateFileName,
      className: toCamelCase(templateFileName),
      instanceName: toInstanceName(templateFileName),
    },
    to: {
      name,
      className,
      instanceName,
    },
  };

  const path = __dirname + destPath;
 
  await fileService.createFilesFromDir({ 
    destPath,
    dirPath,
    variables,
  });
  

}