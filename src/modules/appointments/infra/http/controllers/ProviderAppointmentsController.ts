import { Request, Response } from 'express';
import { container } from 'tsyringe';
// import { parseIso } from 'date-fns';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    // -- Para que o user do appointment também não venha com o password.
    /**
     * Na Entidade User.ts, a propriedade "password" está com um "@Exclude()"
     */
    return response.json(classToClass(appointments));
  }
}
