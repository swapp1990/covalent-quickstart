
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
}
