import {Component, OnInit, Injector} from '@angular/core';
import { Router } from '@angular/router';
import {TransactionService} from "../../../../services/transactions.service";
import {TransactionData} from "../../../../models/transaction";
import {Month} from "../../../../data/enums/months";

@Component({
  selector: 'education-loan',
  template: `
             <div layout-gt-xs="row" flex>
               <div flex-gt-xs="50">
                <md-card>
                  <md-card-title>Current</md-card-title>
                  <md-card-subtitle>{{selectedMonth}}</md-card-subtitle>
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
export class EducationLoan implements OnInit {

  totalEducationLoan: number = 2000000; //Should come from database
  educationLoanPaid: number = 1;
  lastPaid: string = "";
  percentagePaid: number = 0;

  selectedTransaction: TransactionData;
  selectedMonth: string = "";

  selectedLoanData: any = [];
  totalLoanData: any = [];

  constructor(private monthlyService: TransactionService, private injector: Injector) {
    //this.selectedMonth = this.injector.get('selectedMonth');
    this.selectedTransaction = this.injector.get('selectedTransaction');
    //console.log("Selected ", this.selectedTransaction);
  }

  ngOnInit(): void {
    this.getDataBySearchTag();
    let totalLoan = {"name": "Total Loan (Rs)", "value": 2000000};
    this.selectedLoanData.push(totalLoan);
    this.updateInputs();
    this.selectedMonth = this.selectedTransaction.month + ", " + this.selectedTransaction.year;
  }

  getDataBySearchTag() {
    this.monthlyService.getAllDataBasedOnQuery("India Education Loan")
      .subscribe (
        monthlyData => {
          this.renderPaidAmount(monthlyData);
          this.updatePaidAmount(monthlyData);
        },
        err => {
          console.log(err);
        }
      );
  }

  renderPaidAmount(monthlyData: TransactionData[]) {
    //console.log(monthlyData);
  }

  updatePaidAmount(monthlyData: TransactionData[]) {
    this.educationLoanPaid = 0;
    // if(this.selectedMonth != "") {
    //   monthlyData = monthlyData.filter((monthData: TransactionData) => {
    //     return Month[monthData.month] <= Month[this.selectedMonth];
    //   });
    //   //console.log("Filtered ", monthlyData.length);
    // }

    monthlyData.forEach((monthData: TransactionData) => {
      if (monthData.details) {
        monthData.details.forEach(detail => {
          let columns: string[] = Object.keys(detail);
          columns.forEach(colDetail => {
            if(colDetail === "For Loan") {
              let paidAmount: number = +detail[colDetail];
              //console.log(paidAmount);
              this.educationLoanPaid += paidAmount;
              //this.calculatePercent();
              console.log("Total 2", this.educationLoanPaid);
            }
          });
        });
      }
    });

    //this.totalLoanData[1].value = this.educationLoanPaid;
    //console.log("Total ", this.totalLoanData);
    this.updateInputs();
  }

  updateInputs() {
    this.totalLoanData = [];
    let totalLoan = {"name": "Total Loan (Rs)", "value": 2000000};
    this.totalLoanData.push(totalLoan);
    let totalPaid = {"name": "Paid (Rs)", "value": this.educationLoanPaid};
    this.totalLoanData.push(totalPaid);
  }

  calculatePercent() {
    this.percentagePaid = 100 - Math.round(((this.totalEducationLoan - this.educationLoanPaid)/this.totalEducationLoan)*100);
    //console.log("Percentage ", this.percentagePaid);
  }
}
