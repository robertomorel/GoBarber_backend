import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/erros/AppError';
// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

// -- Para indicar que esta classe aceita injeção de dependências
@injectable()
class ListProviderMonthAvailabilityService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    // -- Retorna todos os appointments de um determinado prestaor, mês e ano
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    // -- Retorna a quantidade de dias de um mês específico
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // -- Array.from() -> Criar um array considerando alguns parêmetros
    // -- Cria um array com todos os dias do mês [1,2,3,4,...,30]
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    /**
     * O MAP retorna um array do mesmo tamanho, mas pode ter formato diferente
     */
    // -- Percorre o array de dias do mês
    const availability = eachDayArray.map(day => {
      // -- Pega o último horário do dia
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      // -- Para cada dia, filtra do appoitments feito naquele dia
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
        // appointment => appointment.date.getDate() === day,
      );

      // -- Só podem ter 10 agendimentos por dia. Regra: de 8 Às 18
      const available =
        isAfter(compareDate, new Date()) && appointmentsInDay.length < 10;

      return {
        day,
        available,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
