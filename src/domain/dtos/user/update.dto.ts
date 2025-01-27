export class UpdateUserDTO {
	constructor(public readonly name: string, public readonly email: string) {}

	static create(object: { [key: string]: any }): [string?, UpdateUserDTO?] {
		const { name, email } = object;

		// AQUI EMPEZAMOS A VALIDAR
		if (!name) return ['Name is required'];
		if (name.length < 4) return ['Name must have at least 4 letters'];

		if (!email) return ['Email is required'];
		if (email.length < 6) return ['Email must have at least 4 letters'];

		return [undefined, new UpdateUserDTO(name, email)];
	}
}
