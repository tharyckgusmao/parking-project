## Objetivo

O projeto tem como objetivo seguir a proposta e os requisitos solicitados pelo teste tecnico contido no link: [PROPOSTA](https://github.com/tharyckgusmao/parking-project/PROPOSAL.md).

## Projeto

O projeto em questão tem como finalidade o gerenciamento de um estacionamento de moto e carros, desenvolvido usando o ecossistema de Javascript para com o framework NestJs sendo elas:

   - NestJs
   - TypeOrm
   - Swagger
   - Mysql
   - Testes Unitários
   - Commitizen

### Intruções para execução em um ambiente de desenvolvimento

Ambiente encontra-se disponibilizado em [AMBIENTE](https://parking-api.fly.dev/docs)


#### Requisitos

Configurar um banco de dados em MYSQL 8, ou iniciar o banco pelo arquivo do docker compose, para a execução de relatórios é necessario uma diretiva de banco de dados sendo ela, previamente configurada no arquivo de compose:

```bash
      --sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

```

#### Instalação dos pacotes

```bash
$ npm install
```

#### Execução da aplicação

```bash
# dev mode
$ npm run start:dev
```

#### Test

```bash
# tests unitarios
$ npm run test
```

#### Instruções para teste

Recomendo seguir os passos anteriormente e para o consumo da api, criar alguns dados no banco de dados seguindo os endpoints abaixo, disponibilizado na collection para o [Insomnia](https://github.com/tharyckgusmao/parking-project/diagrams/parking_collection.json), ou sendo possivel a execução e consumo pela docs no swagger, acessando o endpoint do projeto "/docs":

 - Usuario para teste (email:teste@gmail.com, senha: aA#123456)
 - Criar uma compania/estabelecimento endpoint de [Post]{{ _.api }}/company
 - Criar um cusuario associando a uma compania endpoint de [Post]{{ _.api }}/user
 - Realizar o fluxo de autenticação e seguir o consumo para demais endpoints

As entradas de veiculo e saida no estacionamento e realizada atraves dos endpoints de parking :
   - Representa uma entrada: [PUT]{{ _.api }}/parking/company/{{company_id}}/vehicle/{{vehicle_id}}/input
   - Representa uma saída: [PUT]{{ _.api }}/parking/company/{{company_id}}/vehicle/{{vehicle_id}}/input

### Modelo e Estrutura de dados

A modelagem dos dados para o banco se encontra no arquivo de [DBML](https://github.com/tharyckgusmao/parking-project/diagrams/modeling.dbml) podendo ser aplicado no [Diagram](https://dbdiagram.io/home), conforme imagem abaixo:

![diagram](https://user-images.githubusercontent.com/11817448/230642879-a9d08a89-37dc-4545-ada9-16c8c89d5dff.png)

### Lista de Endpoints 

Ver exemplos de payload de body no swagger ou na collection
   
#### Autenticação
- [POST] {{ _.api }}/auth/login
- [POST] {{ _.api }}/auth/refresh

#### Usuarios
- [GET] {{ _.api }}/user -> get de toda a listagem de usuarios com suporte a query (sort,perPage,order) *Todos os endpoint de listagem oferecem suporte
- [GET] {{ _.api }}/user/:id -> Listagem de um dado
- [PUT] {{ _.api }}/user/:id -> Atualização de um dado
- [POST] {{ _.api }}/user -> Criação de um novo dado
- [DELETE] {{ _.api }}/user/:id -> Deleção de um dado
 
#### Veiculos
- [GET] {{ _.api }}/vehicle -> get de toda a listagem todos veiculos associados a uma compania com suporte a query (sort,perPage,order) *Todos os endpoint de listagem oferecem suporte
- [GET] {{ _.api }}/vehicle/:id -> Listagem de um dado
- [PUT] {{ _.api }}/vehicle/:id -> Atualização de um dado
- [POST] {{ _.api }}/vehicle -> Criação de um novo dado
- [DELETE] {{ _.api }}/vehicle/:id -> Deleção de um dado

#### Companias/Estabelecimento
- [GET] {{ _.api }}/company -> get de toda a listagem todos dados com suporte a query (sort,perPage,order) *Todos os endpoint de listagem oferecem suporte
- [GET] {{ _.api }}/company/:id -> Listagem de um dado
- [PUT] {{ _.api }}/company/:id -> Atualização de um dado
- [POST] {{ _.api }}/company -> Criação de um novo dado
- [DELETE] {{ _.api }}/company/:id -> Deleção de um dado


#### Estacionamento
- [PUT] {{ _.api }}/parking/company/{{company_id}}/vehicle/{{vehicle_id}}/input -> lançamento de uma entrada em um estacionamento *possui consistências para saida x entrada
- [PUT] {{ _.api }}/parking/company/{{company_id}}/vehicle/{{vehicle_id}}/output-> lançamento de uma saida em um estacionamento *possui consistências para saida x entrada

#### Relatorios
- [GET] {{ _.api }}/reports/company/{{company_id}}/vehicle/{{vehicle_id}} -> Relatorio para com totais de tempo de uso em um dia para um veiculo, exemplo abaixo, (suporte a query de range):
     
 ```json
            {
            "info": {
               "total": {
                  "occupied": {
                     "car": 0,
                     "motorbike": 0
                  },
                  "available": {
                     "car": 20,
                     "motorbike": 40
                  }
               },
               "company": {
                  "id": "0c49aae8-698a-4a5d-b3f8-8bcf9641bf08",
                  "name": "tharyck",
                  "cnpj": "10000000000000",
                  "address": "Rua henrique gorceix 1770",
                  "phone": "31982695343",
                  "qtyVacancyCars": 20,
                  "qtyVacancyMotors": 40,
                  "createdAt": "2023-04-06T19:55:57.592Z",
                  "updatedAt": "2023-04-06T19:55:57.592Z"
               }
            },
            "data": [
               {
                  "day_group": 4,
                  "vehicle_id": "59079c07-f5db-4e11-b44d-80a4f31dfff4",
                  "parked_time": "162001.536205" //unixtime
               }
            ]
         }
      
```

- [GET] {{ _.api }}/parking/company/{{company_id}}/range -> Listagem de veiculos que consumiram o estacionamento em um periodo, suporte a range de datas;
- [GET] {{ _.api }}/parking/company/{{company_id}}/vehicle/{{vehicle_id}}/events-> Listagem de eventos realizados por um veiculo, entrada, saida;

### Faltas e Criticas
- GCP
- Adicionar Testes 2E2
- Abstrair querys dos relatorios para views 
- ACL para um controle de permissões mais maduro

### Agradecimento
Quaisquer duvidas e feedback estou a disposição

