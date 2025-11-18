export class DepositDto {
  userId: number; // required
  amount: number; // required, positive
  currency?: string; // optional (e.g., 'USD')
  source?: string; // optional (card/wire/crypto)
}
