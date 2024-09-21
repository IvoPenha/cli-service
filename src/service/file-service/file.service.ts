import type { CliService } from '#/service/cli-service/cli.service';
import fs from 'fs-extra';
import path from 'path';

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

        content = this.replacePlaceholders(content, variables);

        await fs.outputFile(destPath, content);
        this.cliService.success(`Arquivo criado: ${destPath}`);
      } catch (err) {
        this.cliService.error(`Erro ao processar o arquivo: ${file}`);
      }
    }
    
    this.cliService.done();
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

  private replaceFieldsOnFile(content: string, variables: Variables, oldVariables: Variables): string {
    const replaceableFields = ['name', 'className', 'instanceName', 'keyName'];
    
    replaceableFields.forEach((field) => {
      if (!variables[field]) { 
        return;
      } 
      
      const regex = new RegExp(oldVariables[field], 'g');
      content = content.replace(regex, variables[field]);
    });
  
    return content;
  }
    /**
   * Lê todos os arquivos em um diretório e retorna seu conteúdo
   * @param dirPath - Caminho do diretório a ser lido
   * @param templateFileName - Nome do arquivo que vai ser alterado - Se passo teste ele vai tirar o teste do nome do arquivo
   * @returns Uma lista de objetos contendo o nome e o conteúdo de cada arquivo
   */
    private async readFilesFromDir(dirPath: string, templateVariables: Variables, newVariables: Variables): Promise<{ fileName: string, content: string }[]> {
      const fileContents: { fileName: string, content: string }[] = [];
    
      try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stat = await fs.lstat(filePath);
    
          if (stat.isDirectory()) {
            // Chama a função recursivamente se for um diretório
            const nestedFiles = await this.readFilesFromDir(filePath, templateVariables, newVariables);
            fileContents.push(...nestedFiles); // Adiciona os arquivos lidos da subpasta
          } else if (stat.isFile()) {
            // Lê o conteúdo do arquivo se for um arquivo
            const content = await fs.readFile(filePath, 'utf8');
            const replacedFilename = file.replace(templateVariables.name, newVariables.name);
            console.warn({ replacedFilename });
            fileContents.push({
              fileName: replacedFilename,
              content: this.replaceFieldsOnFile(content, newVariables, templateVariables)
            });
          }

        }
      } catch (err) {
        this.cliService.error(`Erro ao ler arquivos do diretório: ${dirPath}`);
        throw err;
      }
    
      return fileContents;
    }
    

    /**
     * Cria um diretório e seus arquivos a partir do conteudo do diretorio lido na função readFilesFromDir
     * @param destPath - Caminho do diretório a ser criado
     * @param dirPath - Caminho do diretório a ser lido
     * @param variables - Mapa de variáveis a serem substituídas name -> parte do arquivo que vai ser alterado
     */
    public async createFilesFromDir({
      destPath,
      dirPath, 
      variables
    }: {
      destPath: string;
      dirPath: string; 
      variables: {
        from : Variables;
        to : Variables;
      };
    }): Promise<void> {
      try { 
        const files = await this.readFilesFromDir(dirPath, variables.from, variables.to);
        this.destDir = path.join(process.cwd(), '/',destPath);
        await Promise.all(
          files.map(async ({ fileName, content }) => {
            const filePath = path.join(this.destDir, fileName);
            await fs.outputFile(filePath, content);
            this.cliService.success(`Arquivo criado: ${filePath}`);
          })
        );
      } catch (err) {
        this.cliService.error(`Erro ao criar arquivos no diretório: ${destPath}`);
        throw err;
      }
    }
}
