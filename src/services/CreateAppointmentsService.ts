import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointments from '../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequesteRun {
  provider: string;
  date: Date;
}

class CreateAppointmentsService {
  public async run({ provider, date }: RequesteRun): Promise<Appointments> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentsHour = startOfHour(date);
    const appointmentsHourFound = await appointmentsRepository.findBydate(
      appointmentsHour,
    );

    if (appointmentsHourFound) {
      throw Error('This appointment is already');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentsHour,
    });

    await appointmentsRepository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentsService;
