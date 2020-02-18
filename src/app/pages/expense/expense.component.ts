import { Component, OnInit } from '@angular/core';
import { ExpenseModel, DetailExpenseModel } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { PagerService } from '../../services/pager.service';
import { BranchOfficeService } from '../../services/branch-office.service';
import * as $ from 'jquery';
import { Options, SearchOptions, OptGroupData, QueryOptions } from 'select2';


import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  dataMoney: any[] = [];
  dataTypeExpense: any[] = [];
  dataTypeVoucher: any[] = [];
  dataExpense: any[] = [];
  dataPattern: any[] = [];
  dataOfficeBranch: any[] = [];
  bodyExpense: ExpenseModel;
  qNumeration = '';
  qEmision = '';
  qArea = '';
  qEmpresa = '';
  showInactive = false;
  loading = false;
  loadData = false;
  titleModal = 'Nueva área';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  constructor(private expenseSvc: ExpenseService, private pagerSvc: PagerService, private branchSvc: BranchOfficeService) { }

  ngOnInit() {
    this.bodyExpense = new ExpenseModel();

    $('#cbxPartner').trigger('select2');
    this.expenseSvc.onGetMoneyAll( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataMoney = res.data;
    });

    this.branchSvc.onPartnetGetAll( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataPattern = res.data;

      console.log(res);
    });

    this.expenseSvc.onGetTypeExpense( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeExpense = res.data;
    });

    this.expenseSvc.onGetTypeVoucher( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeVoucher = res.data;
    });


  }

  onGetListExpense( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }


  }

  onEditExpense() {

  }

  onShowConfirm() {

  }

  onSubmitExpense(form: any) {
    if (form.valid) {
      console.warn(this.bodyExpense);
    }
  }

  onResetForm() {

  }

  onUpdateStatus() {

  }

  onChangePartner() {

    this.expenseSvc.onGetBranchByPartner( '', this.bodyExpense.idPartner ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataOfficeBranch = res.data;
    });

  }

  onAddDetailExpense() {
    this.bodyExpense.detailExpense.push( new DetailExpenseModel() );
  }

  onChangeTypeExpense( item: DetailExpenseModel ) {
    const dataExist = this.bodyExpense.detailExpense.filter( element => element.idTypeExpense === item.idTypeExpense );
    if (dataExist.length > 1) {
      item.idTypeExpense = null;
      $('#frmDetailExpense').trigger('reset');
    }
  }

  onDeleteDetailExpense( index: number ) {
    this.bodyExpense.detailExpense[index] = null;
    this.bodyExpense.detailExpense = this.bodyExpense.detailExpense.filter( item => item !== null );
    this.bodyExpense.onCalculate();
  }
}
