import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('restaurants')
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    cuisine?: string;

    @OneToOne(() => User, (user) => user.restaurant)
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}