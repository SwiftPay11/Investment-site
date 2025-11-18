export class WithdrawDto {
  userId: number;
  amount: number;
  destination?: string; // bank account or wallet address
}
