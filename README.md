# SECOMP Final — Implementando Defesas Arquiteturais

**Aluno:** Glisbel Aponte  
**Disciplina:** DCC 704 — Arquitetura e Tecnologias de Sistemas WEB  
**Professor:** Jean Bertrand  

---

## Visão Geral

Este repositório contém a versão final do projeto desenvolvido para a disciplina
DCC 704, com foco na implementação de **defesas arquiteturais em aplicações web**.
O sistema foi construído utilizando **Node.js**, **Express** e **MongoDB**, e
implementa mecanismos de segurança contra **SQL Injection (SQLi)**,
**Cross-Site Scripting (XSS)**, **Cross-Site Request Forgery (CSRF)**,
**ataques de força bruta** e **exposição de credenciais sensíveis**.

---

## Estrutura do Projeto

secomp_final/
├── models/
│ └── User.js
├── utils/
│ └── userUtils.js
├── tests/
│ └── userUtils.test.js
├── views/
│ ├── index.ejs
│ ├── login.ejs
│ ├── profile.ejs
│ ├── contato.ejs
│ ├── admin.ejs
│ └── 404.ejs
├── public/
├── server.js
├── package.json
├── .gitignore
└── README.md

yaml
Copiar código

---

## Como Executar o Projeto

### 1. Criar o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` com o seguinte conteúdo:

SESSION_SECRET=uma_senha_forte
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/secomp_db
PORT=3000

yaml
Copiar código

O arquivo `.env` não é versionado e serve para armazenar informações sensíveis.

---

### 2. Instalar as dependências

```bash
npm install
3. Iniciar o servidor
bash
Copiar código
npm start
A aplicação ficará disponível em:

arduino
Copiar código
http://localhost:3000
Defesas Arquiteturais Implementadas
1. Proteção contra SQL Injection (SQLi)
O projeto utiliza o Mongoose como ODM para acesso ao banco de dados.
As consultas são realizadas por meio de objetos estruturados, como
User.findOne({ email }), evitando concatenação de strings e mitigando ataques
de injeção de comandos.

2. Proteção contra Cross-Site Scripting (XSS)
As views utilizam o mecanismo de escape automático do EJS (<%= %>),
garantindo que dados fornecidos por usuários sejam renderizados apenas como texto.
Não é utilizado <%- %> para renderização de entradas de usuário.

3. Proteção contra Força Bruta
Foi implementado rate limiting com o middleware express-rate-limit.
A rota POST /login permite no máximo 5 tentativas por minuto,
bloqueando tentativas excessivas de autenticação.

4. Proteção contra CSRF
O middleware csurf foi utilizado para proteção contra Cross-Site Request Forgery.
Tokens CSRF são incluídos em todos os formulários POST.
A rota de login foi mantida como exceção, conforme orientação do enunciado.

5. Hardening HTTP e Proteção de Credenciais
O middleware helmet é utilizado para configurar cabeçalhos HTTP de segurança.
Credenciais e segredos sensíveis são armazenados em variáveis de ambiente (.env),
que são ignoradas pelo Git através do arquivo .gitignore.

Refatoração e Testes — Aula 24
Módulo Escolhido
O módulo selecionado para refatoração foi o módulo de usuários.

Refatoração
Foram aplicadas boas práticas de desenvolvimento, incluindo:

uso de const

arrow functions

destructuring

redução de aninhamentos condicionais

melhoria na legibilidade do código

A lógica foi separada em funções puras no arquivo utils/userUtils.js.

Testes Unitários
Foram implementados testes unitários utilizando Jest, cobrindo:

validação de e-mail

validação de senha forte

casos de sucesso e erro

Para executar os testes:

bash
Copiar código
npm test
Observações Finais
Em ambiente de produção, recomenda-se:

ativar cookie.secure = true

utilizar HTTPS

restringir IPs permitidos no MongoDB Atlas

utilizar segredos mais robustos e rotativos

Repositório

https://github.com/glisbel/secomp_final
