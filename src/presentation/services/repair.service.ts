import { Repair } from '../../data/postgres/models/repair.model';
import { StatusOfRepair } from '../../data/postgres/models/repair.model';
import { CreateRepairDTO, CustomError } from '../../domain';

export class RepairService {
	constructor() {}

	async findAllRepairs() {
		try {
			return await Repair.find({
				where: {
					status: StatusOfRepair.Pending,
				},
			});
		} catch (error) {
			throw CustomError.internalServer('Error getting data about the repair');
		}
	}

	async findOneRepair(id: string) {
		const repair = await Repair.findOne({
			where: {
				id,
				status: StatusOfRepair.Pending,
			},
		});

		if (!repair) {
			throw CustomError.notFound('Repair not found');
		}

		return repair;
	}

	async createRepair(repairData: CreateRepairDTO) {
		const repair = new Repair();

		repair.date = repairData.date;
		repair.userId = repairData.userId;
		repair.motorsNumber = repairData.motorsNumber;
		repair.description = repairData.description;

		try {
			return await repair.save();
		} catch (error) {
			throw CustomError.internalServer('Error creating repair');
		}
	}

	async updateRepair(id: string, repairData: any) {
		const repair = await this.findOneRepair(id);

		repair.status = StatusOfRepair.Completed;

		try {
			await repair.save();

			return {
				message: 'Repair has been completed',
			};
		} catch (error) {
			throw CustomError.internalServer('Error updating repair');
		}
	}

	async deleteRepair(id: string) {
		const repair = await this.findOneRepair(id);

		repair.status = StatusOfRepair.Cancelled;

		try {
			await repair.save();

			return {
				message: 'Repair has been cancelled',
			};
		} catch (error) {
			throw CustomError.internalServer('Error deleting repair');
		}
	}
}
