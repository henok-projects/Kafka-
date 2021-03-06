export interface IPayment {
  id?: number;
  cik?: number | null;
  ccc?: string | null;
  paymentAmout?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: number | null;
  approvalStatus?: string | null;
}

export class Payment implements IPayment {
  constructor(
    public id?: number,
    public cik?: number | null,
    public ccc?: string | null,
    public paymentAmout?: string | null,
    public name?: string | null,
    public email?: string | null,
    public phone?: number | null,
    public approvalStatus?: string | null
  ) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
