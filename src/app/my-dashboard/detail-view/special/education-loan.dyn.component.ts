import {Component, OnInit, Injector} from '@angular/core';
import { Router } from '@angular/router';
import {TransactionService} from "../../../../services/transactions.service";
import {TransactionData} from "../../../../models/transaction";
import {Month} from "../../../../data/enums/months";

@Component({
  selector: 'education-loan',
  template: `<div> Total Loan: {{totalEducationLoan}}</div>
             <div> Paid Till Now: {{educationLoanPaid}}</div>
             <!--<my-progress-bar [showNum]="percent<my-progress-bar [showNum]="percentagePaid"></my-progress-bar>agePaid"></my-progress-bar>-->
             <md-progress-bar mode="determinate" value="{{percentagePaid}}"></md-progress-bar>
             <div></div> 
            `
})
export class EducationLoan implements OnInit {

  totalEducationLoan: number = 2000000; //Should come from database
  educationLoanPaid: number = 1;
  lastPaid: string = "";
  percentagePaid: number = 0;

  selectedTransaction: TransactionData;
  selectedMonth: string = "";
  constructor(private monthlyService: TransactionService, private injector: Injector) {
    //this.selectedMonth = this.injector.get('selectedMonth');
    this.selectedTransaction = this.injector.get('selectedTransaction');
    //console.log("Selected ", this.selectedTransaction);
  }

  ngOnInit(): void {
    this.getDataBySearchTag();
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
    if(this.selectedMonth != "") {
      monthlyData = monthlyData.filter((monthData: TransactionData) => {
        return Month[monthData.month] <= Month[this.selectedMonth];
      });
      //console.log("Filtered ", monthlyData.length);
    }

    monthlyData.forEach((monthData: TransactionData) => {
      if (monthData.details) {
        monthData.details.forEach(detail => {
          let columns: string[] = Object.keys(detail);
          columns.forEach(colDetail => {
            if(colDetail === "For Loan") {
              let paidAmount: number = +detail[colDetail];
              //console.log(paidAmount);
              this.educationLoanPaid += paidAmount;
              this.calculatePercent();
            }
          });
        });
      }
    });
  }

  calculatePercent() {
    this.percentagePaid = 100 - Math.round(((this.totalEducationLoan - this.educationLoanPaid)/this.totalEducationLoan)*100);
    console.log("Percentage ", this.percentagePaid);
  }
}
