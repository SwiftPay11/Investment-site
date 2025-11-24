// src/wallet/dto/deposit-giftcard.dto.ts
export class DepositGiftcardDto {
  userId: number;
  amount: number;
  cardType: string;
  note?: string;
}
