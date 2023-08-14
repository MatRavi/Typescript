import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { ensureAuthenticate } from '../middlewares/ensureAuthenticate';

const tasksRoutes = Router();
const controller = new TaskController();

tasksRoutes.use(ensureAuthenticate);

tasksRoutes.get('/', controller.list);
tasksRoutes.get('/:id', controller.show);
tasksRoutes.post('/', controller.create);
tasksRoutes.put('/:id', controller.update);
tasksRoutes.delete('/:id', controller.delete);

export { tasksRoutes };
