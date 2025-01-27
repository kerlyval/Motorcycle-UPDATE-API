import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middlewares';

export class UserRoutes {
	static get routes(): Router {
		const router = Router();

		const userService = new UserService();
		const userController = new UserController(userService);

		router.post('/', userController.createUser);
		router.post('/login', userController.login);

		router.use(AuthMiddleware.protect);

		router.get('/', userController.findAllUsers);
		router.get('/:id', userController.findOneUser);
		router.patch('/:id', userController.updateUser);
		router.delete('/:id', userController.deleteUser);

		return router;
	}
}
