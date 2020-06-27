import { startOfHour, isBefore, getHours, format } from 'date-fns';
// import { getCustomRepository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/erros/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
// import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
// import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/**
 * Neste service, ficará todas as regras de negócio para a criação de agendamentos
 * Objetivos:
 *   1. Recebimento das informações
 *   2. Tratative de erros e exceções
 *   3. Acesso ao repositório
 *
 *   Obs.: os services nunca tem acesso diretamente aos request e response
 *
 *   Vamos usar aqui o princípio "Dependency Inversion (SOLID)"
 *      Sempre que o service tiver uma dependência externa (AppointmentsRepository),
 *      ao invés que intanciarmos novamente uma nova instância, vamos receber a dependência
 *      como parâmetro no constructor. Para que sempre manipulemos a mesma instância.
 */

// -- Conceito do DTO
/**
 * Data Transfer Object - Quando queremos passar informação (dados) de um arquivo para outro.
 * É sempre recomendado utilizar objetos no JS.
 * Este "Request" é um DTO
 */
interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

// -- Para indicar que esta classe aceita injeção de dependências
@injectable()
class CreateAppointmentService {
  /**
   * Iremos usar aqui outra característica do SOLID: Dependency Inversion
   * Ao invés do meu service, que tá precisando saber qual é o repositório que está
   * utilizando diretamente, vamos inverter as coisas.
   *
   * Vamos fazer com que a class que utilizar o services (rotas), informe pra ele
   * qual repositório irá usar.
   *
   * O repositório será passado como parâmetro no construtor.
   */
  // private appointmentsRepository: IAppointmentsRepository;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('AppointmentsRepository') // -- Injeção de dependências do constructor
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository') // -- Injeção de dependências do constructor
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  /**
   * Sempre que uma função no typescript for assíncrona, o seu retorno não é uma variável
   * ou objeto comum, mas uma Promise, cujo parâmetro é aquela variável ou objeto
   * Exemplo: "Promise<Appointment>"
   */
  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    /**
     * É feito isso para que o nosso AppointmentsRepository possa ser usado para
     * acoplar todos os métodos do "Repository" (sava, update, del...)
     */
    // const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    // -- A data do agendamento não pode ser retroativa
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You can´t create an appointment on a past date!');
    }

    // console.log(date, provider_id, user_id);
    // -- O usuário não pode marcar um agendamente para ele mesmo
    if (user_id === provider_id) {
      throw new AppError('You can´t create an appointment to yourself!');
    }

    // -- Não podem ser marcados agendamentos fora dos horários permitidos
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      console.log(getHours(appointmentDate));
      console.log('--------- HERE ----------');
      throw new AppError('You can only create appontments between 8am and 5pm');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked!');
    }

    /**
     * Cria um objeto do tipo EntityRepository(Appointment)
     */
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dataFomated = format(appointment.date, "dd/MM/yyyy', às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dataFomated}.`,
    });

    const cacheKey = `providers-appointments:${provider_id}:${format(
      appointmentDate,
      'yyyy-M-d',
    )}`;
    await this.cacheProvider.invalidate(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentService;
