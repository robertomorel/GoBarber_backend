/**
 * - Repositório para os agendamentos -
 * Detentor das operações que serão feitas em cima dos dados dos agendamentos (criar, ler, editar, deletar)
 * Tira as responsabilidades das rotas.
 * Este repositório faz a conexão entre a "persistência dos dados" e as "rotas"
 * Persistência <-> Repositório <-> Rota
 */
// import { isEqual } from 'date-fns';
import { Repository, getRepository, Raw } from 'typeorm';
// -- Interface para ser extendida neste repositório
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '../entities/Appointment';

/**
 * Sempre que uma função no typescript for assíncrona, o seu retorno não é uma variável
 * ou objeto comum, mas uma Promise, cujo parâmetro é aquela variável ou objeto
 * Exemplo: "Promise<Appointment | null>"
 */

/**
 * Este arquivo só está sendo necessário pelo uso do método customizado 'findByDate'.
 * Se ele não existisse, poderíamos usar os métodos padrão do Repository e este script
 * não seria necessário
 */
// @EntityRepository(Appointment) -> foi jogado para a interface
/* class AppointmentsRepository extends Repository<Appointment> */
class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    /*
    const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );
    */
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });
    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      // -- Cria uma relação com a tabela users (user.id = appointments.user_id) e traz na requisição as informações dos user.
      relations: ['user'],
    });
    return findAppointment;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });
    /**
     * Salva o objeto criado no DB
     */
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
