import { Role } from '../../../data/postgres/models/user.model';

export class CreateUserDTO {
	constructor(
		public readonly name: string,
		public readonly email: string,
		public readonly password: string,
		public readonly role: Role,
	) {}

	static create(object: { [key: string]: any }): [string?, CreateUserDTO?] {
		const { name, email, password, role } = object;

		// AQUI EMPEZAMOS A VALIDAR
		if (!name) return ['Name is required'];
		if (name.length < 4) return ['Name must have at least 4 letters'];

		if (!email) return ['Email is required'];
		if (email.length < 6) return ['Email must have at least 4 letters'];

		if (!password) return ['Email is required'];
		if (password.length < 8) return ['Email must have at least 8 letters'];

		if (!role) return ['Missing role '];

		return [undefined, new CreateUserDTO(name, email, password, role)];
	}
}
