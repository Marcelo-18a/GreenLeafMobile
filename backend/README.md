# Backend GreenLeaf

## Rodar localmente

```bash
npm install
npm start
```

## Variáveis de ambiente

Crie um arquivo `.env` com:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/greenleaf
JWT_SECRET=change-this-secret
```

## Deploy no Render

1. Suba este repositório no GitHub.
2. No Render, crie um novo serviço Web.
3. Use o repositório e confirme que o root é `backend`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Adicione a variável `MONGODB_URI` apontando para seu MongoDB Atlas.
7. Adicione `JWT_SECRET` com um valor forte.
8. Faça deploy e copie a URL pública gerada.

## API

- `POST /api/users`
- `POST /api/users/login`
- `GET /health`