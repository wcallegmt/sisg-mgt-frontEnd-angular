import { Component, OnInit } from '@angular/core';
import { ExpenseModel, DetailExpenseModel } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { PagerService } from '../../services/pager.service';
import { BranchOfficeService } from '../../services/branch-office.service';
import * as $ from 'jquery';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';
import { PeriodService } from '../../services/period.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})

export class ExpenseComponent implements OnInit {
  
  filesValid = ['JPG', 'JPEG', 'PDF', 'XLSX', 'XLS'];

  dataMoney: any[] = [];
  dataTypeExpense: any[] = [];
  dataTypeVoucher: any[] = [];
  dataExpense: any[] = [];
  dataPattern: any[] = [];
  dataOfficeBranch: any[] = [];
  bodyExpense: ExpenseModel;
  qNumeration = '';
  qPartner = '';
  qDoc = '';
  qOffice = '';
  qVoucher = '';
  qEmpresa = '';
  
  qGteTotal = 0;
  qLteTotal = 0;
  qEqTotal = 0;
  
  statusPeriod = false;
  showInactive = false;
  loading = false;
  loadData = false;
  validFile = false;
  titleModal = 'Nuevo gasto';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  srcFile = './assets/images/017-upload.png';
  apiDonwland = environment.URI_API + `/Document/expense/`;
  token = '';
  fileExpense: File = null;
  nameFileExpense = '';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  constructor(private expenseSvc: ExpenseService, private pagerSvc: PagerService, private branchSvc: BranchOfficeService, private uploadSvc: UploadService, private periodSvc: PeriodService) { }

  ngOnInit() {
    this.bodyExpense = new ExpenseModel();
    this.token = localStorage.getItem('token');

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

    this.onGetListExpense(1);
    this.onLoadStatusPeriod();
  }

  onLoadStatusPeriod() {
    this.periodSvc.onGetStatusPeriod().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      if (!res.data) {
        this.statusPeriod = true; // perioodo cerrado
        this.onShowAlert( '¡Periodo cerrado, por favor aperturar primero!', 'warning' );
        this.onShowAlert( '¡Periodo cerrado, por favor aperturar primero!', 'warning' , 'alertExpenseModal');
      }

    });
  }

  onGetListExpense( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.expenseSvc.onGetExpense( page, this.rowsForPage, this.qNumeration, this.qPartner, this.qDoc, this.qOffice, this.qVoucher, this.qGteTotal, this.qLteTotal, this.qEqTotal, this.showInactive )
    .subscribe( (res: any) => {

      this.dataExpense = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataExpense.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }

    });

  }

  onEditExpense( idExpense: number) {
    const dataTemp = this.dataExpense.find( expense => expense.idGastoSucursal === idExpense );

    if (!dataTemp) {
      throw new Error('No se encontró registro de gasto');
    }

    this.titleModal = 'Editar gasto';
    this.textButton = 'Guardar cambios';
    this.loadData = true;
    this.bodyExpense.idExpense = dataTemp.idGastoSucursal;
    this.bodyExpense.idPartner = dataTemp.idSocio;
    this.bodyExpense.idBranchOffice = dataTemp.idSucursal;
    this.bodyExpense.idMoney = dataTemp.idMoneda;
    this.bodyExpense.idTypeVoucher = dataTemp.idComprobante;
    this.bodyExpense.idTypeExpense = dataTemp.idTipoGasto;

    const emisionTemp = new Date( dataTemp.fechaEmision );
    const monthTemp = emisionTemp.getMonth() + 1;

    this.bodyExpense.dateEmission = `${ emisionTemp.getFullYear() }-${ monthTemp < 10 ? '0' + monthTemp : monthTemp }-${ emisionTemp.getDate() }`;

    this.validFile = true;
    this.nameFileExpense = dataTemp.nombreArchivo || 'No se cargo archivo!';
    this.srcFile = !dataTemp.nombreArchivo ? './assets/images/017-upload.png' : './assets/images/001-accepted.png';


    this.bodyExpense.observation = dataTemp.observacion;
    this.bodyExpense.totalExpense = dataTemp.totalGasto;

    this.expenseSvc.onGetBranchByPartner( '', dataTemp.idSocio ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataOfficeBranch = res.data;
    });

    $('#btnShowModalExpense').trigger('click');
  }

  onShowConfirm(idExpense: number) {
    const dataTemp = this.dataExpense.find( expense => expense.idGastoSucursal === idExpense );

    if (!dataTemp) {
      throw new Error('No se encontró registro de gasto');
    }

    this.bodyExpense.idExpense = dataTemp.idGastoSucursal;
    this.bodyExpense.statusRegister = !dataTemp.estadoRegistro;
  }

  onChangeFileExpense( file: FileList ) {

    const auxtype = file[0].name;
    const typeFile = auxtype.split('.');
    const extension = typeFile[typeFile.length - 1];
    // console.log( extension.toUpperCase() );

    if (this.filesValid.indexOf( extension.toUpperCase() ) < 0) {
      this.validFile = false;
      this.srcFile = './assets/images/005-declined.png';
      return;
    }
    this.validFile = true;
    this.nameFileExpense = file[0].name;
    this.srcFile = './assets/images/001-accepted.png';
    this.fileExpense = file.item(0);
  }

  onSubmitExpense(form: any) {
    if (form.valid) {

      this.loading = true;

      if (!this.loadData) {
        this.expenseSvc.onAddExpense( this.bodyExpense ).subscribe( (res: any) => {
          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {

            if (this.fileExpense !== null && this.validFile) {
              this.uploadSvc.onUploadDocument( 'expense', res.data.idGasto, this.fileExpense ).subscribe( (resUpload: any) => {

                if (!resUpload.ok) {
                  throw new Error( resUpload.error );
                }

                // tslint:disable-next-line: no-console
                console.info('Respuesta upload', resUpload);

              });
            }

            $('#btnCloseModalExpense').trigger('click');
            this.onResetForm();
            this.onGetListExpense(1);

          }

          this.loading = false;

        });
      } else {
        this.expenseSvc.onUpdateExpense( this.bodyExpense ).subscribe( (res: any) => {

          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {

            if (this.fileExpense !== null && this.validFile) {
              this.uploadSvc.onUploadDocument( 'expense', this.bodyExpense.idExpense, this.fileExpense ).subscribe( (resUpload: any) => {

                if (!resUpload.ok) {
                  throw new Error( resUpload.error );
                }

                // tslint:disable-next-line: no-console
                console.info('Respuesta upload', resUpload);

              });
            }

            $('#btnCloseModalExpense').trigger('click');
            this.onResetForm();
            this.onGetListExpense(1);

          }

          this.loading = false;
        });
      }

    }
  }

  onResetForm() {
    $('#frmExpense').trigger('reset');
    this.bodyExpense = new ExpenseModel();
    this.fileExpense = null;
    this.validFile = false;
    this.loadData = false;
    this.titleModal = 'Nuevo gasto';
    this.textButton = 'Guardar';
    this.srcFile = './assets/images/017-upload.png';
  }

  onUpdateStatus() {
    this.loading = true;
    this.expenseSvc.onDeleteExpense( this.bodyExpense ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      const { css, idComponent } = this.onGetErrors( res.data.showError );
      this.onShowAlert( `Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, idComponent);

      if ( res.data.showError === 0) {

        $('#btnCloseConfirmExpense').trigger('click');
        this.onResetForm();
        this.onGetListExpense(1);

      }

      this.loading = false;
    });
  }

  onChangePartner() {

    this.expenseSvc.onGetBranchByPartner( '', this.bodyExpense.idPartner ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.dataOfficeBranch = res.data;
    });

  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertExpenseTable' ) {

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
    let arrErrors = showError === 0 ? [`Se ${ action } con éxito`] : [];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertExpenseTable' : 'alertExpenseModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors = ['No existe el socio especificado'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['No existe la sucursal especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No existe la moneda especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No existe el tipo de comprobante especificado'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['No existe el tipo de gasto especificado'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 128 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 256 ) {
      arrErrors = ['¡Periodo cerrado, por favor aperturar primero!'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
