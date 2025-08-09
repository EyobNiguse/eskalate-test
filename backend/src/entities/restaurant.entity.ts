import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';

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

    @Column({ nullable: true })
    profileImage?: string;

    @OneToOne('User', 'restaurant')
    owner: any;

    @OneToMany('Meal', 'restaurant')
    meals: any[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}