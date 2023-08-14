import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { authenticateRoutes } from './authenticateRoutes';
import { tasksRoutes } from './tasksRoutes';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/tasks', tasksRoutes);
routes.use('/sessions', authenticateRoutes);

export { routes };
