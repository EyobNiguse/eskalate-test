import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum UserRole {
    CUSTOMER = 'customer',
    RESTAURANT_OWNER = 'restaurant_owner',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @OneToOne(() => Restaurant, (restaurant) => restaurant.owner, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn()
    restaurant?: Restaurant | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}