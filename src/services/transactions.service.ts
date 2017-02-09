
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Http, Response, Headers} from "@angular/http";
import {TransactionData} from "../models/transaction";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

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
    let newUrl = this.monthsUrl + '?category='+ category+'&month='+ month;//+'&year=2016';
    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }

  //Create Monthly Data.
  createMonthData(body: TransactionData) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(this.monthsUrl, JSON.stringify(body), { headers: headers })
      .map((response: Response) => response.json());
  }

  //Update Monthly Data.
  updateMonthlyData(monthDataId: string, monthBody: TransactionData) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let newUrl = this.monthsUrl + '/'+monthDataId;
    console.log(monthBody);
    return this.http
      .put(newUrl, JSON.stringify(monthBody), { headers: headers })
      .map((response: Response) => response.json());
  }

  //Delete Monthly Data by Id.
  deleteMonthlyData(monthDataId: string) {
    let newUrl = this.monthsUrl + '/'+monthDataId;
    return this.http
      .delete(newUrl)
      .map((response: Response) => null);
  }
}
