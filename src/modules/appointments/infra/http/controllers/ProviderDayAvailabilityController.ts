import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    // -- Query: http://localhost:3333/rota?year=2020&month=6&day=16
    const { year, month, day } = request.query;

    const listProviderDayMonthAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProviderDayMonthAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    return response.json(availability);
  }
}
