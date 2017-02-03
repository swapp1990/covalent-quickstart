export class Amount {
  total: number;
  essential: number;
  once: number;

  constructor() {
    this.total = 0;
    this.essential = 0;
    this.once = 0;
  }
}

export class Category {
  name: string;
  icon: string;
  monthlyAmount: Amount;
  expectedAmount: number;
}
