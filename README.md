# Projeto SECOMP

## O que há neste repositório
- `server.js` - servidor Express com Helmet, CSRF, rate-limit, sessões armazenadas em MongoDB, Mongoose.
- `models/User.js` - modelo Mongoose para usuários.
- `views/` - páginas EJS estilizadas e parciais de layout.
- `public/css/style.css` - CSS para as páginas.
- `.env.example` - exemplo de variáveis de ambiente.
- `package.json` - dependências.

## Instruções para rodar (local)
1. Instale Node.js e MongoDB (ou use Atlas).
2. Copie `.env.example` para `.env` e edite `SESSION_SECRET` e `MONGO_URI`.
3. No diretório do projeto:
   ```bash
   npm install
   npm start
   ```
4. Abra `http://localhost:3000`

Usuário admin seeded: **admin@ufrr.br / Admin@123**

## Testes rápidos (evidências)
- CSRF: formulário `/contato` contém `<input name="_csrf">`.
- Rate-limit: `POST /login` limitado (5 tentativas/min).
- Helmet: cabeçalhos de segurança presentes (`curl -I http://localhost:3000`).
- Sessões: guardadas em MongoDB via `connect-mongo`.

## Notas
Não comite `.env` com segredos. Em produção ative `cookie.secure: true` e HTTPS.
