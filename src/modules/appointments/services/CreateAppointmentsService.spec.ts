import AppErros from '@shared/errors/AppErros';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentsService from './CreateAppointmentsService';

describe('CreateAppointments', () => {
  it('should be able to create a new appointments', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentsService = new CreateAppointmentsService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentsService.run({
      date: new Date(),
      provider_id: '22',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('22');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentsService = new CreateAppointmentsService(
      fakeAppointmentsRepository,
    );

    const newDate = new Date();

    await createAppointmentsService.run({ date: newDate, provider_id: '22' });

    await expect(
      createAppointmentsService.run({
        date: newDate,
        provider_id: '22',
      }),
    ).rejects.toBeInstanceOf(AppErros);
  });
});
