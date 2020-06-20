/**
 * Interface criada para padronizar os métodos principais de controle dos
 * Appointments, independente da tecnologia usada de infra.
 * Por exemplo, hoje usamos typeorm. O script abaixo é totalmente dependente disso.
 * @module/appointments/infra/typeorm/repositories/AppointmentsRepository.ts
 * Caso mudemos esta tecnologia, podemos perder tudo o que tá lá.
 *
 * Deste modo é necessário criar uma Interface para criar regras para definir quais
 * métodos (om seus retornos) o repositório terá.
 *
 * Atende à um critério do SOLID chamado 'Liskov Substitution Principle'
 *   Princípio da programação que indica que camadas que fazem integrações com
 *   outras bibliotecas (como DB) podem ser substituíveis, definindo um conjunto
 *   de regras. Esta interface é para atender à este princípio.
 */

export default interface ICreateAppointmentDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}
