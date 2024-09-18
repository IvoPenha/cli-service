import fs from 'fs-extra';
import path from 'path';

import type { CliService } from '../cli-service/cli-service';

interface Variables {
  name: string;
  className: string;
  instanceName: string;
  dbName?: string;
  keyName?: string;
}

export class FileService {
  private templateDir: string;
  private destDir: string;

  constructor(private readonly cliService: CliService) {
    this.templateDir = path.resolve(__dirname, '../../../templates');
  }

  /**
   * Gera um template de arquivo a partir de um arquivo de template e variáveis
   * @param name - Nome do caso de uso
   * @param files - Lista de arquivos a serem gerados
   * @param variables - Mapa de variáveis a serem substituídas
   */
  public async generateTemplate({
    files,
    name,
    templateFolder,
    variables
  }: {
    name: string;
    files: string[];
    variables: Variables;
    templateFolder: string;
  }): Promise<void> {
    this.destDir = path.join(process.cwd(), `src/useCases/${name}`);

    for (const file of files) {
      const fileName = file === 'index.ts' ? file : `${name}.${file}`;
      const templatePath = path.join(this.templateDir, templateFolder, `${file}`);
      const destPath = path.join(this.destDir, fileName);
      try {
        let content = await fs.readFile(templatePath, 'utf8');

        console.log();

        content = this.replacePlaceholders(content, variables);

        await fs.outputFile(destPath, content);
        this.cliService.success(`Arquivo criado: ${destPath}`);
      } catch (err) {
        this.cliService.error(`Erro ao processar o arquivo: ${file}`);
      }
    }

    await this.cliService.done();
  }

  /**
   * Altera as placeholders no conteúdo do arquivo com os valores das variáveis de mesmo nome
   * @param content - O conteúdo do arquivo com as placeholders
   * @param variables - Mapa de placeholders e seus valores de substituição
   * @returns O conteúdo com as placeholders substituídas
   */
  private replacePlaceholders(content: string, variables: Variables): string {
    return content.replace(/<%=\s*(\w+)\s*%>/g, (match, placeholderName) => {
      return variables[placeholderName] !== undefined ? variables[placeholderName] : match;
    });
  }
}
