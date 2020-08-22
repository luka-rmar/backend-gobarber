import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import AppErros from '../../errors/AppErros';
import uploadConfig from '../../../config/upload';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));

// O routes se torna um middleware, por isso passamos dentro o app.use. Assim a rota funciona
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppErros) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.listen(3000, () => {
  console.log('Servidor rodando da porta 3000');
});
