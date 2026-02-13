import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Security: Don't return password in queries by default
  password: string;

  @Column({ type: "text", nullable: true, select: false })
  refreshTokenHash: string | null;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  // preferences
  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: 'English' })
  language: string;

  @Column({ default: 'system' })
  theme: string;

  // monthly budget
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500.00 })
  monthlyLimit: number;

  // --- NOTIFICATIONS ---
  @Column({ default: true })
  emailAlerts: boolean;

  @Column({ default: false })
  pushAlerts: boolean;

  @Column({ type: 'int', default: 3 })
  daysBeforeBill: number;

  // Budget reset cycle
  @Column({ type: 'int', default: 1 })
  budgetResetDay: number; 

  @Column({ default: 'monthly' })
  budgetCycle: 'monthly' | 'weekly';

  // Timestamps and relationships
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // We will uncomment this once we generate the Subscriptions resource
  @OneToMany(() => Subscription, (sub) => sub.user)
  subscriptions: Subscription[];
}