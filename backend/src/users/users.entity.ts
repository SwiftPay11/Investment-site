import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Notification } from '../notifications/notifications.entity';
import { TradingAccount } from "../trading-accounts/trading-account.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  country: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: true })
  accountNumber: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @Column({ nullable: true })
  walletId: string;

  @Column({ nullable: true, default: 0 })
  accountBalance: number;

  @Column({ default: false })
  restricted: boolean;

  @OneToMany(() => Notification, notif => notif.user)
  notifications: Notification[];

  @Column({ type: 'varchar', nullable: true })
  resetCode: string | null;

  @Column({ type: 'bigint', nullable: true })
  resetCodeExpires: number | null;

  @Column({ type: "varchar", nullable: true })
  loginCode: string | null;

  @Column({ type: "bigint", nullable: true })
  loginCodeExpires: number | null;

  // user.entity.ts
  @Column({ nullable: true })
  mt5AccountNumber: string;

  @Column({ nullable: true, default: 0 })
  freeMargin: number;

  @Column({ nullable: true, default: "1:500" })
  leverage: string;

  // 👇 THIS is the relationship that caused the error
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => TradingAccount, (acc: TradingAccount) => acc.user)
  tradingAccounts: TradingAccount[];
}
