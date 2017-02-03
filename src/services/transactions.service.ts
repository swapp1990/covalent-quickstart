
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Http, Response} from "@angular/http";
import {TransactionData} from "../models/transaction";

@Injectable()
export class TransactionService {
  private monthsUrl = '/api/months';

  constructor(private http: Http) { }

  //Get all monthly data
  getMonthlyData(): Observable<TransactionData[]> {
    return this.http
      .get(this.monthsUrl)
      .map((response: Response) => response.json());
  }

  //Get monthly data for category types
  getMonthlyDataByCategory(month: string, category: string): Observable<TransactionData[]> {
    let newUrl = this.monthsUrl + '?category='+ category+'&month='+ month;
    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }
}
