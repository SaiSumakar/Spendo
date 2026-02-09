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

  @Column({ nullable: true })
  name: string;

  // Settings
  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: 'system' })
  theme: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500.00 })
  monthlyLimit: number;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // We will uncomment this once we generate the Subscriptions resource
  @OneToMany(() => Subscription, (sub) => sub.user)
  subscriptions: Subscription[];
}