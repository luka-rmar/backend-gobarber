import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentesRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';

import Appointments from '@modules/appointments/infra/typeorm/entities/Appointments';

class FakeAppointmentsRepository implements IAppointmentesRepository {
  private appointments: Appointments[] = [];

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointments> {
    const appointment = new Appointments();
    Object.assign(appointment, { id: uuid(), provider_id, date });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointments | undefined> {
    const findAppointments = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointments;
  }
}

export default FakeAppointmentsRepository;
