import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { encriptAdapter } from '../../../config';
import { Repair } from './repair.model';

export enum Role {
	Employee = 'Employee',
	Client = 'Client',
}

export enum Status {
	Available = 'Available',
	Disabled = 'Disabled',
}

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string; //id, name, email, password, role, status

	@Column('varchar', {
		length: 90,
		nullable: false,
	})
	name: string;

	@Column('varchar', {
		length: 90,
		nullable: false,
		unique: true,
	})
	email: string;

	@Column('varchar', {
		length: 90,
		nullable: false,
	})
	password: string;

	@Column('enum', {
		enum: Role,
		default: Role.Client,
	})
	role: Role;

	@Column('enum', {
		enum: Status,
		default: Status.Available,
	})
	status: Status;

	@OneToMany(() => Repair, (repair) => repair.user)
	repairs: Repair[];

	@BeforeInsert()
	encryptedPassword() {
		this.password = encriptAdapter.hash(this.password);
	}
}
