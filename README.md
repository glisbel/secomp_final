# Projeto SECOMP
**Aluno:** Glisbel Aponte  
**Disciplina:** DCC 704 — Arquitetura e Tecnologias de Sistemas WEB  
**Professor:** Jean Bertrand

## O que há neste repositório
# Implementando Defesas Arquiteturais

## Visão Geral
Este repositório contém a versão final do projeto solicitado na Aula 18, com autenticação, Mongoose e defesas arquiteturais contra XSS, CSRF e força bruta. O trabalho segue as instruções do enunciado do professor. fileciteturn0file0

## Estrutura do Projeto
```
secomp_final/
├── models/
│   └── User.js
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── contato.ejs
│   ├── admin.ejs
│   └── 404.ejs
├── public/
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Dependências principais
Instale as defesas e utilitários conforme a especificação:
```bash
npm install helmet csurf express-rate-limit dotenv connect-mongo express-session mongoose bcrypt
```
(Conforme exigido no enunciado). fileciteturn0file0

## Como rodar (local)
1. Copie `.env.example` para `.env` e preencha:
```
SESSION_SECRET=uma_senha_forte_aqui
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.../secomp_db
```
2. Instale dependências:
```bash
npm install
```
3. Inicie:
```bash
node server.js
```

---

## Proteções implementadas (mapa para o professor)

### 1) Proteção contra SQL Injection (SQLi)
- **Motivo / justificativa:** Uso de Mongoose com queries parametrizadas evita concatenação manual de strings e, portanto, mitiga SQLi na camada de persistência (Model e Controller). fileciteturn0file0
- **Arquivos relevantes:** `models/User.js`, uso de `User.findOne({ email })` em `server.js`. fileciteturn2file0

### 2) Proteção contra Cross-Site Scripting (XSS)
- **Ação:** Todas as saídas de dados de usuário que aparecem nas views utilizam o mecanismo de escape do EJS (`<%= %>`). Exemplo: `profile.ejs` exibe o email com `<%= user.email %>`. fileciteturn1file4
- **Observação sobre includes:** Os templates usam `include()` com `<%- include(...) %>` apenas para inserir partes estáticas (layout), não conteúdo vindo diretamente do usuário; isso é documentado no relatório. fileciteturn1file0turn1file7

### 3) Proteção contra Força Bruta (Rate Limiting)
- **Implementação:** `express-rate-limit` aplicado à rota `POST /login` com janela de 60 segundos e máximo de 5 tentativas. Mensagem configurada: `'Too many login attempts, try again later.'`. fileciteturn2file0
- **Como testar (pedido do professor):** Fazer 6 requisições POST em menos de 1 minuto para `/login` e observar a mensagem de erro. (Print de tentativa bloqueada incluído no PDF.)

### 4) Hardening HTTP (Helmet) e Proteção de Credenciais (dotenv)
- **Helmet:** Middleware aplicado no topo do `server.js` para configurar headers seguros. fileciteturn2file0
- **dotenv / .env:** Segredos (SESSION_SECRET e MONGO_URI) extraídos de variáveis de ambiente com fallback para desenvolvimento em `server.js`. fileciteturn2file0

### 5) Proteção contra CSRF (Tokens)
- **Regra aplicada:** CSRF (`csurf`) habilitado para todas as rotas POST **exceto** `POST /login` (exceção conforme enunciado do professor). fileciteturn0file0turn2file0
- **Forms protegidos:** `contato.ejs` já contém o token:
```html
<input type='hidden' name='_csrf' value='<%= csrfToken %>'>
```
fileciteturn1file2
- **Login:** `login.ejs` foi mantido sem token CSRF por ser exceção pedido pelo professor. fileciteturn1file3

---

## Trechos importantes do código (explicados)

### server.js — pontos chave
- Helmet aplicado antes das rotas. fileciteturn2file0
- Sessões com `connect-mongo` e cookie `httpOnly` e `sameSite: 'lax'`. fileciteturn2file0
- Rate limiter configurado e aplicado em POST /login. fileciteturn2file0
- CSRF configurado com exceção para login; o token é passado para as views através de `res.locals.csrfToken`. fileciteturn2file0

---

## Observações e justificativas finais

- Em ambiente de produção, recomenda-se ativar `cookie.secure = true` e servir via HTTPS, além de rotinas de rotação de secrets e uso de variáveis de ambiente seguras.
