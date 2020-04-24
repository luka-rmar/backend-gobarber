import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentsService from '../services/CreateAppointmentsService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return res.json(appointments);
});

appointmentsRouter.post('/', async (req, res) => {
  try {
    const { provider, date } = req.body;
    const parseDate = parseISO(date);

    const createAppointments = new CreateAppointmentsService();

    const appointment = await createAppointments.run({
      provider,
      date: parseDate,
    });

    return res.json(appointment);
  } catch (err) {
    return res.status(400).json({ error: err.message, name: err.name });
  }
});

export default appointmentsRouter;
