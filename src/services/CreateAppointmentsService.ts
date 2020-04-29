import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppErros from '../errors/AppErros';
import Appointments from '../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequesteRun {
  provider_id: string;
  date: Date;
}

class CreateAppointmentsService {
  public async run({ provider_id, date }: RequesteRun): Promise<Appointments> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentsHour = startOfHour(date);
    const appointmentsHourFound = await appointmentsRepository.findBydate(
      appointmentsHour,
    );

    if (appointmentsHourFound) {
      throw new AppErros('This appointment is already');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentsHour,
    });

    await appointmentsRepository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentsService;
