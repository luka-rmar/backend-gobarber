import { EntityRepository, Repository } from 'typeorm';

import Appointments from '../models/Appointments';

@EntityRepository(Appointments)
class AppointmentsRepository extends Repository<Appointments> {
  public async findBydate(date: Date): Promise<Appointments | null> {
    const findAppointment = await this.findOne({ where: { date } });
    return findAppointment || null;
  }
}

export default AppointmentsRepository;
