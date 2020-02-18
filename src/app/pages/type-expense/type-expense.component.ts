import { Component, OnInit } from '@angular/core';
import { TypeExpenseModel } from '../../models/typeExpense';
import { TypeExpenseService } from 'src/app/services/type-expense.service';
import { PagerService } from '../../services/pager.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-type-expense',
  templateUrl: './type-expense.component.html',
  styleUrls: ['./type-expense.component.css']
})
export class TypeExpenseComponent implements OnInit {

  dataTypeExpense: any[] = [];
  bodyTypeExpense: TypeExpenseModel;
  qName = '';
  showInactive = false;
  loading = false;
  loadData = false;
  titleModal = 'Nuevo tipo de gasto';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  constructor(private tExpenseSvc: TypeExpenseService, private pagerSvc: PagerService) { }

  ngOnInit() {
    this.bodyTypeExpense = new TypeExpenseModel();

    this.onGetListTypeExpense(1);
  }

  onGetListTypeExpense( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }

    this.tExpenseSvc.onGetListTypeExpense( page, this.rowsForPage, this.qName, this.showInactive ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataTypeExpense = res.data;
      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataTypeExpense.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }

    });

  }

  onEditTypeExpense( id: number ) {
    const dataTemp = this.dataTypeExpense.find( element => element.idTipoGasto === id );
    if (!dataTemp) {
      console.warn('¡No se encontró registro!');
    }

    this.bodyTypeExpense.idTypeExpense = dataTemp.idTipoGasto;
    this.bodyTypeExpense.name = dataTemp.nombreGasto;
    this.bodyTypeExpense.description = dataTemp.descripcionGasto;

    this.loadData = true;
    this.titleModal = 'Editar tipo de gasto';
    this.textButton = 'Guardar cambios';
    
    $('#btnShowModalTypeExpense').trigger('click');
  }

  onShowConfirm( id: number ) {
    const dataTemp = this.dataTypeExpense.find( element => element.idTipoGasto === id );
    if (!dataTemp) {
      console.warn('¡No se encontró registro!');
    }

    this.bodyTypeExpense.idTypeExpense = dataTemp.idTipoGasto;
    this.bodyTypeExpense.statusRegister = !dataTemp.estadoRegistro;
  }

  onResetForm() {
    $('#frmTypeExpense').trigger('reset');
    this.bodyTypeExpense = new TypeExpenseModel();
    this.loadData = false;
    this.titleModal = 'Nuevo tipo de gasto';
    this.textButton = 'Guardar';
  }

  onSubmiTypeExpense( frmTypeExpense: any ) {
    if (frmTypeExpense.valid) {
      if (!this.loadData) {
        this.tExpenseSvc.onAddTypeExpense( this.bodyTypeExpense ).subscribe( (res: any) => {
          if (!res.ok) {
            throw new Error( res.error );
          }
  
          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);
  
          if ( res.data.showError === 0) {
            $('#btnCloseModalTypeExpense').trigger('click');
            this.onResetForm();
            this.onGetListTypeExpense(1);
          }
          this.loading = false;
  
        });
      } else {
        this.tExpenseSvc.onUpdateTypeExpense( this.bodyTypeExpense ).subscribe( (res: any) => {
          if (!res.ok) {
            throw new Error( res.error );
          }
  
          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);
  
          if ( res.data.showError === 0) {
            $('#btnCloseModalTypeExpense').trigger('click');
            this.onResetForm();
            this.onGetListTypeExpense(1);
          }
          this.loading = false;
  
        });
      }
    }
  }

  onUpdateStatus() {
    this.loading = true;

    this.tExpenseSvc.onDeleteTypeExpense( this.bodyTypeExpense ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      
      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertTypeExpenseTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertTypeExpenseTable');
        this.onResetForm();
        this.onGetListTypeExpense(1);
      }
      $('#btnCloseConfirmTypeExpense').trigger('click');
      this.loading = false;

    });
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertTypeExpenseTable' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;

    $(`#${ idComponent }`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    const action = this.loadData ? 'actualizó' : 'insertó';
    let arrErrors = showError === 0 ? [`Se ${ action } con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertTypeExpenseTable' : 'alertTypeExpenseModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de tipo de gasto'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['¡Existen gastos asociados con este tipo, elimine gastos primero!'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
