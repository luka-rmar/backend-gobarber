import { Router } from 'express';
import CreateSessionsService from '../services/CreateSessionsService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const sessionsUsers = new CreateSessionsService();
  const { email, password } = req.body;

  const { user, token } = await sessionsUsers.run({ email, password });

  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
