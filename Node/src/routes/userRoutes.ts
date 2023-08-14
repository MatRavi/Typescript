import { Router } from "express"
import { UserController } from "../controllers/UserController";
import { ensureAuthenticate } from '../middlewares/ensureAuthenticate';

const userRoutes = Router();
const controller = new UserController();

userRoutes.use(ensureAuthenticate)

userRoutes.get('/list/', controller.list)
userRoutes.get('/show/:id', controller.show)
userRoutes.post('/create/', controller.create)
userRoutes.put('/update/:id', controller.update)
userRoutes.delete('/delete/:id', controller.delete)

export { userRoutes };