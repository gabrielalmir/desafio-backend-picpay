# Desafio Backend PicPay (em desenvolvimento)

## Visão Geral

Este projeto é uma solução para o desafio técnico de backend do PicPay. A aplicação simula uma plataforma de pagamentos onde usuários podem realizar transferências entre si. O projeto é desenvolvido utilizando Node.js com o framework NestJS, Prisma como ORM, e Redis para mensageria usando Bull.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **NestJS**: Framework para construção de aplicações Node.js escaláveis e de fácil manutenção.
- **Prisma**: ORM para TypeScript e Node.js que facilita o acesso ao banco de dados.
- **Redis**: Plataforma de mensageria open-source usando Bull para gerenciar filas.
- **Zod**: Biblioteca para validação de esquemas.

## Configuração do Ambiente

### Pré-requisitos

- Node.js
- Docker (para executar o Kafka e o banco de dados)
- PostgreSQL (caso não utilize Docker para o banco de dados)

### Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/gabrielalmir/desafio-backend-picpay.git
    cd desafio-backend-picpay
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:

    Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

    ```env
    PORT=3000
    NODE_ENV=development
    DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
    AUTHORIZATION_SERVICE_URL=https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc
    NOTIFICATION_SERVICE_URL=https://run.mocky.io/v3/54dc2cf1-3add-45b5-b5a9-6bf7e7f1f4a6
    ```

### Executando a Aplicação

1. Suba os serviços Docker (Kafka e PostgreSQL):

    ```bash
    docker-compose up -d
    ```

2. Execute as migrações do Prisma para configurar o banco de dados:

    ```bash
    npm run db:push
    ```

3. Inicie a aplicação:

    ```bash
    npm run start
    ```

    A aplicação estará disponível em `http://localhost:3000`.

## Endpoints da API

### Usuários

- **POST /wallets**
  - Cria um novo usuário.
  - Payload:
    ```json
    {
      "fullName": "John Doe",
      "cpf": "12345678900",
      "email": "john.doe@example.com",
      "password": "strongpassword",
      "type": "common"
    }
    ```

### Transações

- **POST /transactions**
  - Cria uma nova transação.
  - Payload:
    ```json
    {
      "value": 100.0,
      "payerId": 1,
      "payeeId": 2
    }
    ```

## Arquitetura

A aplicação segue os princípios de arquitetura limpa, separando as responsabilidades em diferentes módulos. Utilizamos Prisma como ORM para facilitar o acesso ao banco de dados e Kafka para mensageria entre serviços.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Faça o push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## Contato

Gabriel Almir - [LinkedIn](https://www.linkedin.com/in/gabrielalmir/) - @gabrielalmir

Projeto Link: [https://github.com/gabrielalmir/desafio-backend-picpay](https://github.com/gabrielalmir/desafio-backend-picpay)
