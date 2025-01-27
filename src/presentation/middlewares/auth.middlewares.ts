import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { Role, Status, User } from '../../data';

export class AuthMiddleware {
	static async protect(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('Authorization');

		if (!authorization)
			return res.status(401).json({ message: 'No token provided' });

		if (!authorization.startsWith('Bearer'))
			return res.status(401).json({ message: 'Invalid Token' });

		const token = authorization.split(' ').at(1) || '';

		try {
			const payload = (await JwtAdapter.validateToken(token)) as { id: string };
			if (!payload) return res.status(401).json({ message: 'Invalid Token!' }); //ya tenemos el Id del usuario

			const user = await User.findOne({
				where: {
					id: payload.id,
					status: Status.Available,
				},
			});
			if (!user) return res.status(401).json({ message: 'Invalid User' });

			req.body.sessionUser = user;
			next();

			console.log(payload);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	static restrictTo = (...roles: Role[]) => {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!roles.includes(req.body.sessionUser.role)) {
				return res
					.status(403)
					.json({ message: 'You are not authorizated to access this route' });
			}
			next();
		};
	};
}
