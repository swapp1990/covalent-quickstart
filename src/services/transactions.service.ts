
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Http, Response, Headers} from "@angular/http";
import {TransactionData} from "../models/transaction";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class TransactionService {
  private monthsUrl = '/api/months';
  private searchurl = '/api/search';

  constructor(private http: Http) { }

  //Get all monthly data
  getMonthlyData(): Observable<TransactionData[]> {
    return this.http
      .get(this.monthsUrl)
      .map((response: Response) => response.json());
  }

  //Get monthly data for category types
  getMonthlyDataByCategory(year: string, month: string, category: string): Observable<TransactionData[]> {
    let newUrl = this.monthsUrl + '?category='+ category+'&month='+ month+'&year='+year;
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

  //Get all Amount (Income & Expense) for Monthly Data.
  monthGetAllAmount(month: string, year: string): Observable<any[]> {
    let newUrl = this.monthsUrl +'/price'+ '?month='+ month+ '&year='+ year;
    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }

  //Get all Essential
  monthGetAllEssentialCost(month: string): Observable<any[]> {
    let newUrl = this.monthsUrl +'/price'+ '?month='+ month +'&isEssential=true';
    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }

  //Get all Incomes for Monthly Data.
  monthGetAllIncomes(month: string, isIncome: string): Observable<any[]> {
    let newUrl = this.monthsUrl +'/price'+ '?month='+ month + '&isIncome' + isIncome;
    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }

  //Get Data based on Query.
  getAllDataBasedOnQuery(name: string): Observable<TransactionData[]> {
    let newUrl = this.searchurl;
    if(name) {
      newUrl = this.searchurl + '?name=' + name;
    }

    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }

  //Get all data based on details query
  getDataBasedOnDetails(key: string, value: string): Observable<TransactionData[]> {
    let newUrl = this.monthsUrl + '/details' + '?key=' + key + '&value=' + value;
    return this.http
      .get(newUrl)
      .map((response: Response) => response.json());
  }
}
