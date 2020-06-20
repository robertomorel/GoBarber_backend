import { Request, Response } from 'express';
// import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreactAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    // -- Não precisa mais da linha abaixo, pois o celebrate/Joi já está convertendo o campo para .date() na validação da rota
    // const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date,
      user_id,
      provider_id,
    });

    return response.json(appointment);
  }
}
