import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('meals')
export class Meal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    image?: string;

    @Column({ default: true })
    isAvailable: boolean;

    @Column()
    restaurantId: number;

    @ManyToOne('Restaurant', 'meals')
    @JoinColumn({ name: 'restaurantId' })
    restaurant: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
