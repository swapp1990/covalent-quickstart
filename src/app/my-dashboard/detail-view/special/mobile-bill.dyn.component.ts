import {Component, OnInit, Injector} from '@angular/core';
import {TransactionService} from "../../../../services/transactions.service";
import {TransactionData} from "../../../../models/transaction";

@Component({
  selector: 'mobile-bill',
  template: `
              <div layout-gt-xs="row" flex>
               <div flex-gt-xs="50">
                <md-card>
                  <md-card-title>Current</md-card-title>
                  <md-card-subtitle>{{subtitle}}</md-card-subtitle>
                  <md-divider></md-divider>
                  <my-chart [mode]="'Pie'" [single]="familyPlanDivision"></my-chart>
                </md-card>
               </div>
               <div flex-gt-xs="50">
                <md-card>
                  <md-card-title>Total</md-card-title>
                  <md-card-subtitle></md-card-subtitle>
                  <md-divider></md-divider>
                  <!--<my-chart [mode]="'Gauge'" [single]="totalLoanData"></my-chart>-->
                </md-card>
               </div>
             </div> 
            `
})

export class MobileBill {
  selectedTransaction: TransactionData;
  familyPlanDivision: any = [];
  subtitle: string = "";
  totalAmountPaid: number = 0;

  constructor(private monthlyService: TransactionService, private injector: Injector) {
    //this.selectedMonth = this.injector.get('selectedMonth');
    this.selectedTransaction = this.injector.get('selectedTransaction');
  }

  ngOnInit(): void {
    this.updateInputs();
    this.subtitle = this.selectedTransaction.month + ", " + this.selectedTransaction.year;
    this.subtitle += " - (Total Paid - "+ this.totalAmountPaid+")";
  }

  updateInputs() {
    if(this.selectedTransaction.details) {
      if(this.selectedTransaction.details[0]) {
        let familyPlan = this.selectedTransaction.details[0]["Family Plan"];
        let columns: string[] = Object.keys(familyPlan);
        columns.forEach(col => {
          let singleRow = {"name": "Column 1", "value": 0};
          singleRow.name = col;
          singleRow.value = familyPlan[col]["Amount"];
          this.familyPlanDivision.push(singleRow);
        });
        let paidAmount = this.selectedTransaction.details[0]["Paid"];
        this.totalAmountPaid = paidAmount["Amount"];
      }
    }
  }
}
