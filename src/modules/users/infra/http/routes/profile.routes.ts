/**
 * - Rotas para a atualização de status -
 */
import { Router } from 'express';
// -- Usado para validações de rotas
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../middleware/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();

const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

profileRouter.get('/', profileController.show);

export default profileRouter;
