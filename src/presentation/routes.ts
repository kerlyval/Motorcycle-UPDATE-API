import { Router } from 'express';
import { UserRoutes } from './user/router';
import { RepairRoutes } from './repairs/router';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/v1/users', UserRoutes.routes);
		router.use('/api/v1/repairs', RepairRoutes.routes);

		return router;
	}
}
