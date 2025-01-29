import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

export enum StatusOfRepair {
	Pending = 'Pending',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
}

@Entity()
export class Repair extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('date', {
		nullable: false,
	})
	date: Date;

	@Column('varchar', {
		nullable: false,
	})
	motorsNumber: string;

	@Column('text', {
		nullable: false,
	})
	description: string;

	@Column('enum', {
		enum: StatusOfRepair,
		default: StatusOfRepair.Pending,
	})
	status: StatusOfRepair;

	@Column('varchar', {
		nullable: false,
	})
	userId: string;

	@ManyToOne(() => User, (user) => user.repairs)
	user: User;
}
