import {Component, OnInit, OnChanges, Input, ViewChild} from "@angular/core";

@Component({
  selector: 'my-ngx-table',
  template:
    `
<ngx-datatable
        #myTable
        class="material fullscreen"
        [rows]="rows"
        [columns]="cols"
        [rowHeight]="50"
        [headerHeight]="30"
        [footerHeight]="40"
        [selectionType]="'single'"
        (select)='onSelect($event)'
        [scrollbarV]="true"
        [scrollbarH]="false">

         <!--<ngx-datatable-column>-->
          <!--<template ngx-datatable-cell-template let-value="value">-->
           <!--C{{value}}-->
          <!--</template>-->
         <!--</ngx-datatable-column>-->
        <!-- Row Detail Template -->
        <ngx-datatable-row-detail #myDetailRow [rowHeight]="100" #myDetailRow (toggle)="onDetailToggle($event)">
          <template let-row="row" ngx-datatable-row-detail-template>
            <div style="padding-left:35px;">
              <div><strong>Address1</strong></div>
            </div>
          </template>
        </ngx-datatable-row-detail>
        <ngx-datatable-column
          [width]="50"
          [resizeable]="false"
          [sortable]="false"
          [draggable]="false"
          [canAutoResize]="false">
          <template let-row="row" ngx-datatable-cell-template>
            <a
              href="#"
              [class.icon-right]="!row.$$expanded"
              [class.icon-down]="row.$$expanded"
              title="Expand/Collapse Row"
              (click)="toggleExpandRow(row)">
            </a>
          </template>
        </ngx-datatable-column>
        
        <ngx-datatable-column name="Name">
         <template ngx-datatable-cell-template let-value="value" let-row="row">
          <span
              title="Double click to Edit"
              (dblclick)="editing[row.$$index + '-name'] = true"
              *ngIf="!editing[row.$$index + '-name']">
              {{value}}
          </span>
          <input
              autofocus
              (blur)="updateValue($event, 'name', value, row)"
              *ngIf="editing[row.$$index + '-name']"
              type="text"
              [value]="value"
            />
            </template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Date">
          <template ngx-datatable-cell-template let-value="value">
            {{value}}
          </template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Price">
          <template ngx-datatable-cell-template let-value="value">
            {{value}}
          </template>
        </ngx-datatable-column>
</ngx-datatable>
    `,
})

export class MyNGXTable implements OnInit, OnChanges {
  @Input() rows: any;
  @Input() cols: any;
  @ViewChild('myTable') table: any;

  selected = [];
  editing = {};
  ngOnInit(): void {

  }

  ngOnChanges(changes) {

  }

  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index + '-' + cell] = false;
    this.rows[row.$$index][cell] = event.target.value;
  }

  onSelect({ selected }) {
    console.log('Select Event', selected);
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
}
