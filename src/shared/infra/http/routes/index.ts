import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.router';
import sessiosnRouter from '@modules/users/infra/http/routes/sessions.router';
import passwordRouter from '@modules/users/infra/http/routes/password.router';

const routes = Router();

routes.use('/sessions', sessiosnRouter);

routes.use('/users', usersRouter);

routes.use('/appointments', appointmentsRouter);

routes.use('/password', passwordRouter);

export default routes;
