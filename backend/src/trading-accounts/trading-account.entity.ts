import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../users/users.entity";

@Entity()
export class TradingAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tradingAccounts, { onDelete: "CASCADE" })
  user: User;

  @Column()
  hedgingNumber: string; // MT5-XXXX-HDG

  @Column({ type: 'decimal', default: 0 })
  accountBalance: number;

  @Column({ type: 'decimal', default: 0 })
  freeMargin: number;

  @Column({ default: "1:500" })
  leverage: string;

  @Column({ default: false })
  activated: boolean;
}
