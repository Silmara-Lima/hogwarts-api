# API Hogwarts School

- Crie uma pasta chamada 'hogwarts-school-api'
- Inicialize o package.json:  
`npm init -y`  

# Em seguida instale as dependências
`npm install express @prisma/client dotenv zod swagger-ui-express swagger-jsdoc express-async-errors`

Explicação:  
#express → framework para criar a API e gerenciar rotas.   
#@prisma/client → cliente Prisma que comunica o código com o PostgreSQL.   
#dotenv → permite usar variáveis de ambiente, como a URL do banco.    
#zod → validação de dados (evita salvar informações erradas).  
#swagger-ui-express e swagger-jsdoc → documentação interativa da API.  
#express-async-errors: Para tratamento de erros em funções assíncronas. 

# Em seguida instale as dependências de desenvolvimento
`npm install -D typescript tsx @types/node @types/express @types/swagger-ui-express prisma`

Explicação:   
#typescript / tsx → escrever código tipado e rodar direto sem build.  
#prisma → ORM para criar tabelas e manipular banco de dados.  
#@types/... → adiciona tipagens ao TypeScript para essas bibliotecas.

# Criar o arquivo tsconfig.json
`npx tsc --init`  

Explicação:  
#typescript → Cria um arquivo chamado tsconfig.json, que define como o TypeScript vai compilar o código.  

→ configurar o arquivo tsconfig.json  
```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@utils/*": ["utils/*"],
      "@routes/*": ["routes/*"],
      "@middlewares/*": ["middlewares/*"]
    }
  }
}

```
Explicação: 
#rootDir: onde estão seus arquivos .ts (pasta src/).  
#outDir: onde o TypeScript vai colocar os .js gerados após o build.  
#strict: força o TypeScript a verificar erros de tipo com mais rigor.  
#esModuleInterop: permite importar módulos JS com a sintaxe import express from "express".  
#skipLibCheck: ignora verificação de tipos de bibliotecas externas (torna a build mais rápida).

# Criar estrutura de pastas

```
mkdir src
mkdir src/controllers src/schemas src/utils
touch src/server.ts src/routes.ts src/utils/prisma.ts
touch src/utils/swagger.config.ts
```

# Configurar a parte de scripts no package.json
```
//(apenas a seção scripts)
"scripts": {
  "dev": "tsx watch src/index.ts",
  "start": "node dist/index.js",
  "prisma:init": "npx prisma init --datasource-provider postgresql",
  "prisma:migrate": "npx prisma migrate dev --name init",
  "prisma:generate": "npx prisma generate"
},
``` 

# Criar o prisma
`npx prisma init`  

Explicação:   
#Cria a pasta prisma/ com schema.prisma → define tabelas e relacionamentos.  
#Cria .env → arquivo de variáveis de ambiente, onde você vai colocar a URL do banco.  
#No .env, configure:  
`DATABASE_URL="postgresql://usuario:senha@localhost:5432/hogwarts"  
PORT=3000` 

Substitua usuario e senha pelo seu usuário do PostgreSQL.

# Criar banco no PostgreSQL
`CREATE DATABASE hogwarts;`

Explicação:   
#Criar no terminal do PostgreSQL a tabela

# Criar os models no schema.prisma

Explicação:   
#O @id @default(uuid()) garante que cada registro terá um identificador único longo (UUID).  
#O campo houseId String? na tabela Character é a chave estrangeira.  
#O house House? @relation(...) é a forma como o Prisma entende a ligação. Ele permite que usemos a sintaxe de objeto (como o include) no código TypeScript.  
#A tabela Enrollment é a de tabela de junção para a relação de Muitos-para-Muitos entre Character e Subject.  

# Após criar models, rodar as migrations
`npm run prisma:migrate --name hogwarts_init`  

Explicação:  
#migrate → usa o CLI do Prisma para comparar o schema.prisma com o banco e gerar o código SQL necessário para criar as tabelas.  
#sempre que modificar models, rodar o migrate

# Prisma client
```
// src/utils/prisma.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

Explicação:  
#conectar ao banco e e exporta para usar nas routes e services (instanciar e exportar o client prisma)

# lê o schema.prisma
`npx prisma generate`  

#Lê o arquivo schema.prisma  
#Cria automaticamente o código do cliente dentro da pasta node_modules/@prisma/client  
#É necessário rodar esse comando toda vez que você modificar o schema.prisma (por exemplo, adicionar uma nova tabela/modelo)

# criar diretorio services dentro do src
#Contém toda a lógica de negócio e manipula os dados via Prisma.
#para cada model, cria o arquivo .ts
#consulta o banco de dados, cria, atualiza e deleta registros
#tem regras de negócios e encapsula a lógica de dados para o controller chamar as funções do service e retornar a resposta ao cliente

# criar diretorio controllers dentro do src
#Recebe requisição HTTP, chama service, trata erros, devolve a resposta com um json.

# criar as routes
#irão mapear URLs para controllers
#o arquivo index.ts dentro de routes unifica as rotas

# criar o index principal

# verificar o arquivo tsconfig para que todos os arquivos .ts estejam dentro de src

# Validação usando o Zod  
#certificar que o zod está instalado  
`npm install zod`  
`npm install --save-dev @types/express`

Explicação:  
#no diretório do middlewares irá interceptar o request e aplica o validator antes de chegar no controller
#no validators irá garantir que os dados enviados na requisição estejam corretos e retornem apenas dados corretos.

# para rodar  
`npm run dev`  