import { Request, Response } from 'express';
import { CreateRepairDTO, CustomError } from '../../domain';
import { RepairService } from '../services/repair.service';

export class RepairController {
	constructor(private readonly repairService: RepairService) {}

	private handleEror = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		console.log(error);
		return res.status(500).json({ message: 'Something went wrong! 🤨💀🧨' });
	};

	createRepair = (req: Request, res: Response) => {
		const [error, createRepairDTO] = CreateRepairDTO.create(req.body);

		if (error) return res.status(422).json({ message: error });

		this.repairService
			.createRepair(createRepairDTO!) //el ! nos dice CONFIA jajaj que aquí si hay data
			.then((data: unknown) => {
				return res.status(201).json({ errors: error });
			})
			.catch((error: unknown) => this.handleEror(error, res));
	};

	findAllRepairs = (req: Request, res: Response) => {
		this.repairService
			.findAllRepairs()
			.then((data: unknown) => {
				return res.status(200).json(data);
			})
			.catch((error: unknown) => this.handleEror(error, res));
	};

	findOneRepair = (req: Request, res: Response) => {
		const { id } = req.params;

		this.repairService
			.findOneRepair(id)
			.then((data: any) => {
				res.status(200).json(data);
			})
			.catch((error: unknown) => this.handleEror(error, res));
	};

	updateRepair = (req: Request, res: Response) => {
		const { id } = req.params;

		const [error, createRepairDTO] = CreateRepairDTO.create(req.body);

		if (error) return res.status(422).json({ message: error });

		this.repairService
			.updateRepair(id, createRepairDTO!) // ! confia xD
			.then((data: any) => {
				return res.status(200).json(data);
			})
			.catch((error: unknown) => this.handleEror(error, res));
	};

	deleteRepair = (req: Request, res: Response) => {
		const { id } = req.params;

		this.repairService
			.deleteRepair(id)
			.then((data: any) => {
				return res.status(204).json(null);
			})
			.catch((error: unknown) => this.handleEror(error, res));
	};
}
