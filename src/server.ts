import 'reflect-metadata';

import express from 'express';
import routes from './routes';

import './database';

const app = express();

app.use(express.json());

// O routes se torna um middleware, por isso passamos dentro o app.use. Assim a rota funciona
app.use(routes);

app.listen(3000, () => {
  console.log('Servidor rodando da porta 3000');
});
