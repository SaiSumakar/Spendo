import { User } from "src/modules/users/entities/user.entity";
import { Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  INR = 'INR',
  GBP = 'GBP'
}

export enum BillingFrequency {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  WEEKLY = 'WEEKLY'
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: Currency,
        default: Currency.INR
    })
    currency: Currency;

    @Column({
        type: 'enum',
        enum: BillingFrequency,
        default: BillingFrequency.MONTHLY
    })
    frequency: BillingFrequency;

    @Column({nullable: true})
    category: string;

    @Column({type: 'date'})
    startDate: string;

    @Column({type: 'date'})
    nextBillingDate: string;

    @Column({ nullable: true })
    websiteUrl: string;

    @Column({ default: false })
    isTrial: boolean;

    // 3. Relationships
    @Column()
    userId: string; // Foreign Key

    @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
