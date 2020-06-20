/**
 * - Rotas para os usuários -
 * Objetivos da rota para agendamentos:
 *   1. Receber a requisição;
 *   2. Chamar outro arquivo para aplicar as regras de negócio em cima da requisição;
 *   3. Retornar uma resposta.
 *   Obs.: o que for transformação e manipulação de dados, pode ficar aqui.
 *     Exemplo: "const parsedDate = parseISO(date);"
 */
import { Router } from 'express';
// -- Usado para validações de rotas
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// -- Cria uma instância do multer, ou seja, teremos acesso aos métodos do multer.
const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  usersController.create,
);

// -- Necessário o usuário estar logado para alterar o avatar
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single(
    'avatar',
  ) /* Adiciona esse middleware obrigatoriamente para evitar duplicidade na imagem */,
  userAvatarController.update,
);

export default usersRouter;
