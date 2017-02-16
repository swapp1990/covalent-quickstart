import {Component, OnInit, Injector} from '@angular/core';
import { Router } from '@angular/router';
import {TransactionService} from "../../../../services/transactions.service";
import {Month} from "../../../../data/enums/months";
import {TransactionData} from "../../../../models/transaction";

@Component({
  selector: 'car-loan',
  template: `<div layout-gt-xs="row" flex>
               <div flex-gt-xs="50">
                <md-card>
                  <md-card-title>Current</md-card-title>
                  <md-card-subtitle>{{selectedTransaction.month}}, {{selectedTransaction.year}}</md-card-subtitle>
                  <md-divider></md-divider>
                  <my-chart [mode]="'Gauge'" [single]="selectedLoanData"></my-chart>
                </md-card>
               </div>
               <div flex-gt-xs="50">
                <md-card>
                  <md-card-title>Total</md-card-title>
                  <md-divider></md-divider>
                  <my-chart [mode]="'Gauge'" [single]="totalLoanData"></my-chart>
                </md-card>
               </div>
             </div>            
             `
})
export class CarLoan implements OnInit {

  totalCarLoan: number = 15000; //Should come from database
  carLoanPaid: number = 1;
  carLoanPaidFiltered: number = 1;
  lastPaid: string = "";
  percentagePaid: number = 0;

  selectedTransaction: TransactionData;

  selectedLoanData: any = [];
  totalLoanData: any = [];

  constructor(private monthlyService: TransactionService, private injector: Injector) {
    //this.selectedMonth = this.injector.get('selectedMonth');
    this.selectedTransaction = this.injector.get('selectedTransaction');
  }

  ngOnInit(): void {
    this.getDataBySearchTag();
    this.updateInputs();
  }

  getDataBySearchTag() {
    this.monthlyService.getAllDataBasedOnQuery("Car Loan")
      .subscribe (
        monthlyData => {
          this.updatePaidAmount(monthlyData);
        },
        err => {
          console.log(err);
        }
      );
  }

  updateInputs() {
    this.totalLoanData = [];
    this.selectedLoanData = [];
    let totalLoan = {"name": "Total Loan (Rs)", "value": this.totalCarLoan};
    this.totalLoanData.push(totalLoan);
    this.selectedLoanData.push(totalLoan);
    let totalPaid = {"name": "Paid (Rs)", "value": this.carLoanPaid};
    this.totalLoanData.push(totalPaid);
    let selectedPaid = {"name": "Paid (Rs)", "value": this.carLoanPaidFiltered};
    this.selectedLoanData.push(selectedPaid);
  }

  updatePaidAmount(monthlyData: TransactionData[]) {
    this.carLoanPaid = 0;
    this.carLoanPaidFiltered = 0;
    let isLessThanSelectedMonth: boolean = false;
    monthlyData.forEach((monthData: TransactionData) => {
      if(monthData.year <= this.selectedTransaction.year) {
        if(Month[monthData.month] <= Month[this.selectedTransaction.month]) {
          isLessThanSelectedMonth = true;
        }
      } else {
        isLessThanSelectedMonth = false;
      }
      if (monthData.details) {
        monthData.details.forEach(detail => {
          let columns: string[] = Object.keys(detail);
          columns.forEach(colDetail => {
            if(colDetail === "For Loan") {
              let paidAmount: number = +detail[colDetail];
              //console.log(paidAmount);
              this.carLoanPaid += paidAmount;
              if(isLessThanSelectedMonth) {
                this.carLoanPaidFiltered += paidAmount;
              }
              //this.calculatePercent();
            }
          });
        });
      }
    });
    this.updateInputs();
  }

  calculatePercent() {
    this.percentagePaid = 100 - Math.round(((this.totalCarLoan - this.carLoanPaid)/this.totalCarLoan)*100);
    //console.log("Percentage ", this.percentagePaid);
  }
}
