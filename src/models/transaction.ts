export class TransactionData {
  _id: string;
  name: string;
  price: number;
  category: string;
  payment: string;
  type: string;
  date: number;
  month: string;
  isIncome: string;
  isEssential: string = "false";

  details: any;
  detailsView: any;
  
  constructor(category: string, month: string, isIncome: string, isEssential: string) {
    this.name = "";
    this.price = 0;
    this.category = category;
    this.payment = "D";
    this.type = "";
    this.date = 1;
    this.month = month;
    this.isIncome = isIncome;
    this.isEssential = isEssential;

    this.details = [];
    this.detailsView = null;
  }
}

export class DetailsData {

}

