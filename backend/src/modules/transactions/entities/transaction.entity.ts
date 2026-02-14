import { Subscription } from "src/modules/subscriptions/entities/subscription.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Entity,
    Column, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

export enum ExpenseType {
    income = "income",
    expense = "expense"
}

@Entity('transactions')
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 12, scale: 2 })
    amount: number;

    // income vs expense — REQUIRED for reports
    @Column({
        type: 'enum',
        enum: ExpenseType,
    })
    type: ExpenseType;

    @Column()
    description: string;

    // user-defined category
    @Column({ nullable: true })
    category: string;

    // when transaction actually happened
    @Column({ type: 'date' })
    date: Date;

    // optional note
    @Column({ nullable: true })
    notes: string;

    // -------- RELATIONS --------
    @Index()
    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Index()
    @Column({ nullable: true })
    subscriptionId: string;

    @ManyToOne(() => Subscription, sub => sub.transactions, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'subscriptionId' })
    subscription: Subscription;

    // -------- AUDIT --------
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
