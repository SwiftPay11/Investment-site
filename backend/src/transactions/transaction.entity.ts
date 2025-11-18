import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number; // ✅ foreign key reference

  @Column()
  type: string; // deposit, withdraw, transfer_in, transfer_out, invest, etc.

  @Column({ type: 'numeric', precision: 18, scale: 8, default: 0 })
  amount: string; // numeric stored as string; convert when returning

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
