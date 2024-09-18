# Serviço de CLI

Bem-vindo ao **Serviço de CLI**! Este gerador de templates ajuda você a criar rapidamente um novo módulo CRUD ou CRON com uma estrutura consistente para o seu projeto. 🚀

## Funcionalidades

- Gera um novo módulo dentro da pasta `src/useCases`.
- Cria automaticamente um arquivo de serviço em TypeScript.
- Aceita um nome de banco de dados personalizado como parâmetro opcional.

## Pré-requisitos

Antes de usar este gerador, certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

## Instalação

Para começar a usar o Gerador de CRUD, você precisará clonar este repositório e linkar o gerador globalmente:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/IvoPenha/cli-service.git
   ```

2. **Navegue até o diretório clonado:**

   ```bash
   cd cli-service
   ```

3. **Link o gerador globalmente com npm ou yarn:**

   Com npm:

   ```bash
   npm run setup
   ```

   Ou, se preferir usar yarn:

   ```bash
   yarn setup
   ```

## Uso

Depois de instalar e linkar o gerador, você pode usá-lo para gerar um novo módulo CRUD:

```bash
cis <tipo> --name <nome> --db <nomeDoBancoDeDados>
```

### Exemplo:

```bash
cis crud --name user --db meuBancoDeDados
```

```bash
cis cron --n  user
```

Isso criará uma nova pasta `src/useCases/user` com um arquivo `user.ts` dentro dela, usando `meuBancoDeDados` como o nome do banco de dados.

E no caso da Cron criará dentro de useCases os 
    'job.ts',
    'queue.ts',
    'route.ts',
    'index.ts'

### Opções:

- `--name || --n <nome>`: O nome do seu módulo (por exemplo, `user`).
- `--db || --dbName <nomeDoBancoDeDados>`: O nome da tabela no banco de dados a ser usado na entidade (por exemplo, `usuarios`).
