/**
 * - Rotas para a sessão e autenticação -
 */
import { Router } from 'express';
// -- Usado para validações de rotas
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();

const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
