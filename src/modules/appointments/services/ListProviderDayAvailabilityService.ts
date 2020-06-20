import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/erros/AppError';
// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

// -- Para indicar que esta classe aceita injeção de dependências
@injectable()
class ListProviderDayAvailabilityService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    // -- Busca os appointments de um dia específico
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    // -- Hora inicial de appoints permitida pela regra de negócio
    const startHour = 8;

    // -- Cria um array de horas permitidas. de 8 às 18
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour,
    );

    const currentDate = new Date(Date.now());

    // -- Percorre o array de horas e retorna outro array de mesmo tamanho.
    const availability = eachHourArray.map(hour => {
      // -- Busca um appointment em uma hr específica
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      // -- Retorna objeto
      return {
        hour,
        // -- O horário precisa estar disponível e a data e hora de agendamento precisa ser depois da atual
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
