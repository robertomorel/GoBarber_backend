/* eslint-disable no-console */
/**
 * Dependência que o typescript tem, principalmente quando
 * usamos a sintaxe do Decorator
 */
import 'reflect-metadata';
/**
 * Para que todos os arquivos da aplicação tenham acesso às variáveis de ambiente.
 * Para que o typescript possa importar arquivos JS, no nosso "tsconfig.json",
 * add a linha:  allowJs": true,
 */
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
// -- Este pacote deve ser importado obrigatoriamente logo após o express
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/erros/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Criando uma rota estática para mostrar para o usuário final o arquivo físico,
 * ou seja, a imagem em tela
 * Exemplo: http://localhost:3333/files/c093a514f454de81c619-sorcerers-00.webp
 */
app.use('/files', express.static(uploadConfig.uploadsFolder));

// app.use(rateLimiter);

app.use(routes);

// -- Para que os erros do celebrate sejam exibidos como resposta.
app.use(errors());

/**
 * Os middlewares que são exclusivos para tratativa de erros no express tevem ser
 * chamados depois de todas as rotas e, diferente dos outros, precisam que quatro
 * parêmtros (err, request, response, next).
 *
 * Para este middleware funcionar, o pacote "yard add express-async-errors" deve ser
 * instalado.
 *
 * A importação do 'express-async-errors' deve ser feita logo após o express
 */
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // -- Erro inesperado do sistema.
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error!',
  });
});

app.listen(3333, () => {
  console.log('🚀Server started on port 3333!');
});
