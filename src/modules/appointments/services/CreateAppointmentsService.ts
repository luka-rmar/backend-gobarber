import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppErros from '@shared/errors/AppErros';
import Appointments from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequesteRun {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async run({ provider_id, date }: IRequesteRun): Promise<Appointments> {
    const appointmentsHour = startOfHour(date);
    const appointmentsHourFound = await this.appointmentsRepository.findByDate(
      appointmentsHour,
    );

    if (appointmentsHourFound) {
      throw new AppErros('This appointment is already');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentsHour,
    });

    return appointment;
  }
}

export default CreateAppointmentsService;
