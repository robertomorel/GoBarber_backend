/**
 * - Rotas para os agendamentos -
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

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

// SoC: Separation of Concerns

appointmentsRouter.use(ensureAuthenticated);

/*
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = new AppointmentsRepository();
  // const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  return response.json(
    await appointmentsRepository.find({
      relations: ['category'],
    }),
  );
});
*/

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

// -- Buscar os appointments do usuário logado
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
