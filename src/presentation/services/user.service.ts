import { encriptAdapter } from '../../config';
import { JwtAdapter } from '../../config/jwt.adapter';
import { Status, User } from '../../data/postgres/models/user.model';
import {
	CustomError,
	LoginUserDto,
	UpdateUserDTO,
	CreateUserDTO,
} from '../../domain';

export class UserService {
	constructor() {}

	async findUsers() {
		try {
			const users = User.find({
				where: {
					status: Status.Available,
				},
			});
			return users;
		} catch (error) {
			CustomError.internalServer('Error getting the User');
		}
	}
	async findOneUser(id: string) {
		const user = await User.findOne({
			where: {
				id: id,
				status: Status.Available,
			},
		});
		if (!user) {
			throw CustomError.notFound('User not found');
		}
		return user;
	}

	async createUser(userData: CreateUserDTO) {
		const user = new User();

		user.name = userData.name;
		user.email = userData.email;
		user.password = userData.password;
		user.role = userData.role;

		try {
			const newUser = await user.save();

			return {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
			};
		} catch (error) {
			throw CustomError.internalServer('Error creating User');
		}
	}

	async updateUser(id: string, userData: UpdateUserDTO) {
		const user = await this.findOneUser(id);

		user.name = userData.name.toLowerCase().trim();
		user.email = userData.email.toLowerCase().trim();

		try {
			await user.save();

			return {
				message: 'The user has been updated',
			};
		} catch (error) {
			throw CustomError.internalServer('Error updating User');
		}
	}

	async deleteUser(id: string) {
		const user = await this.findOneUser(id);

		console.log('delete', user);
		user.status = Status.Disabled;

		try {
			return await user.save();
		} catch (error) {
			throw CustomError.internalServer('Error deleting User');
		}
	}

	async login(credentials: LoginUserDto) {
		const user = await this.findUserByEmail(credentials.email);

		const isMatching = encriptAdapter.compare(
			credentials.password,
			user.password,
		);
		if (!isMatching) throw CustomError.unAuthorized('Invalid Credentials');

		const token = await JwtAdapter.generateToken({ id: user.id });
		if (!token) throw CustomError.internalServer('Error creating token');

		return {
			token: token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}

	async findUserByEmail(email: string) {
		const user = await User.findOne({
			where: {
				email,
				status: Status.Available,
			},
		});

		if (!user)
			throw CustomError.notFound(`User with email: ${email} not found`);

		return user;
	}
}
