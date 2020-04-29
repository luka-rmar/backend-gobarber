import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.router';
import sessiosnRouter from './sessions.router';

const routes = Router();

routes.use('/sessions', sessiosnRouter);

routes.use('/appointments', appointmentsRouter);

routes.use('/users', usersRouter);

export default routes;
