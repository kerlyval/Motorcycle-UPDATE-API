import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import {
	CustomError,
	CreateUserDTO,
	UpdateUserDTO,
	LoginUserDto,
} from '../../domain';
import { protectAccountOwner } from '../../config/validate-owner';

export class UserController {
	constructor(private readonly userService: UserService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error💀' });
	};

	createUser = (req: Request, res: Response) => {
		const [error, CreateUserDto] = CreateUserDTO.create(req.body);

		if (error) return res.status(422).json({ message: error });
		this.userService
			.createUser(CreateUserDto!) //! confía
			.then((data: any) => res.status(200).json(data))
			.catch((error: any) => this.handleError(error, res));
	};

	findAllUsers = (req: Request, res: Response) => {
		this.userService
			.findUsers()
			.then((data: any) => res.status(200).json(data))
			.catch((error: any) => this.handleError(error, res));
	};

	findOneUser = (req: Request, res: Response) => {
		const { id } = req.params;
		this.userService
			.findOneUser(id)
			.then((data) => res.status(200).json(data))
			.catch((error: any) => this.handleError(error, res));
	};

	updateUser = (req: Request, res: Response) => {
		const { id } = req.params;
		const sessionUserId = req.body.sessionUser.id;
		if (!protectAccountOwner(id, sessionUserId)) {
			return res
				.status(401)
				.json({ message: 'You are not the owner of this account ' });
		}

		const [error, UpdateUserDto] = UpdateUserDTO.create(req.body);
		if (error) return res.status(422).json({ message: error });
		this.userService
			.updateUser(id, UpdateUserDto!)
			.then((data) => res.status(200).json(data))
			.catch((error: any) => this.handleError(error, res));
	};

	deleteUser = (req: Request, res: Response) => {
		const { id } = req.params;
		const sessionUserId = req.body.sessionUser.id;

		if (!protectAccountOwner(id, sessionUserId)) {
			return res
				.status(401)
				.json({ message: 'You are not the owner of this account ' });
		}

		this.userService
			.deleteUser(id)
			.then((data) => res.status(204).json(data))
			.catch((error: any) => this.handleError(error, res));
	};

	login = (req: Request, res: Response) => {
		const [error, loginUserDto] = LoginUserDto.create(req.body);

		if (error) return res.status(422).json({ message: error });

		this.userService
			.login(loginUserDto!)
			.then((data) => {
				return res.status(201).json(data);
			})
			.catch((error: any) => this.handleError(error, res));
	};
}
