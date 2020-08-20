import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentsService from '@modules/appointments/services/CreateAppointmentsService';

class AppointmentsController {
  public async create(
    resquest: Request,
    response: Response,
  ): Promise<Response> {
    const { provider_id, date } = resquest.body;
    const parseDate = parseISO(date);

    const createAppointments = container.resolve(CreateAppointmentsService);

    const appointment = await createAppointments.run({
      provider_id,
      date: parseDate,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
