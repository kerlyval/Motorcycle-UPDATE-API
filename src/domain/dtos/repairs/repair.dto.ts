import { z } from 'zod';

const createRepairSchema = z.object({
	date: z
		.string({ message: 'Date is required' })
		.refine((data) => !isNaN(new Date(data).getTime()), {
			message: 'Invalid date format',
		}),

	motorsNumber: z
		.string()
		.min(2, { message: 'The Motors number cannot be left blank' }),
	description: z.string().min(1, { message: 'Please provide a description' }),
	userId: z.string().uuid({ message: 'UserID is required' }),
});

export class CreateRepairDTO {
	constructor(
		public readonly date: Date,
		public readonly userId: string,
		public readonly motorsNumber: string,
		public readonly description: string,
	) {}

	static create(object: {
		[key: string]: any;
	}): [Record<string, string>?, CreateRepairDTO?] {
		const { date, userId, motorsNumber, description } = object;

		const result = createRepairSchema.safeParse(object);

		if (!result.success) {
			const errorMessages = result.error.errors.reduce((acc: any, err: any) => {
				const field = err.path.join('.');
				acc[field] = err.message;
				return acc;
			}, {} as Record<string, string>);

			return [errorMessages];
		}

		return [
			undefined,
			new CreateRepairDTO(date, userId, motorsNumber, description),
		];
	}
}
