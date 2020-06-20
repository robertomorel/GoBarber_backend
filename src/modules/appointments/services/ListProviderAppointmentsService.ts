import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

// -- Para indicar que esta classe aceita injeção de dependências
@injectable()
class ListProviderAppointmentsService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `providers-appointments:${provider_id}:${year}-${month}-${day}`;
    // -- Usando Generics no "recover" para garantir que o retorno do recover será do tipo Appointment[]
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          day,
          month,
          year,
        },
      );

      console.log('Opa!! A query no banco foi feita...');

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
