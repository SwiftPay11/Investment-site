export class TransferDto {
  fromUserId: number;
  toUserEmail?: string; // recipient identification (email or accountNumber)
  toAccountNumber?: string;
  amount: number;
  note?: string;
}
