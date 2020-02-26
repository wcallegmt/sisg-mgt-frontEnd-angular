import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from '../../services/branch-office.service';
import { ExpenseService } from '../../services/expense.service';
import { UtilitieModel, ComissionUtilidad } from '../../models/utilitie.model';
import { UtilitiesService } from '../../services/utilities.service';
import { PeriodService } from '../../services/period.service';
import { ConfigUtilitiesService } from '../../services/config-utilities.service';
import * as $ from 'jquery';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})

export class UtilitiesComponent implements OnInit {

  dataUtilities: any[] = [];
  dataPattern: any[] = [];
  dataOfficeBranch: any[] = [];
  dataComissionProduct: ComissionUtilidad[] = [];
  
  bodyUtilitie: UtilitieModel;

  showInactive = false;

  qPartner = '';
  qBranch = '';
  qResponsable = '';
  qNumeration = '';
  qLteUtilitie = 0;
  qGteUtilitie = 0;
  qEqUtilitie = 0;
  
  statusPeriod = false;
  loading = false;
  loadData = false;
  titleModal = 'Nueva utilidad';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  constructor(private branchSvc: BranchOfficeService, private expenseSvc: ExpenseService, private utilitieSvc: UtilitiesService, private periodSvc: PeriodService, private configUSvc: ConfigUtilitiesService, private pagerSvc: PagerService) { }

  ngOnInit() {

    this.bodyUtilitie = new UtilitieModel();

    this.branchSvc.onPartnetGetAll( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataPattern = res.data;

    });

    this.onLoadStatusPeriod();
    this.onLoadConfigUtilitie();
    this.ongetListUtilities(1);
  }

  onLoadConfigUtilitie() {
    this.configUSvc.onGetConfigUtilities().subscribe( (res: any) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyUtilitie.incomeTax = res.data.impuestoRenta || 0.00;

    });
  }

  onLoadStatusPeriod() {
    this.periodSvc.onGetStatusPeriod().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      if (!res.data) {
        this.statusPeriod = true; // perioodo cerrado
        this.onShowAlert( '¡Periodo cerrado, por favor aperturar primero!', 'warning' );
        this.onShowAlert( '¡Periodo cerrado, por favor aperturar primero!', 'warning' , 'alertUtilitieModal');
      } else {
        this.bodyUtilitie.idPeriod = res.data.idPeoriodo || 0;
      }

    });
  }

  onChangePartner() {

    this.expenseSvc.onGetBranchByPartner( '', this.bodyUtilitie.idPartner ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.dataOfficeBranch = res.data;
    });

  }

  ongetListUtilities( page: number, chk = false ) {

    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.utilitieSvc.onGetUtilities( page, this.rowsForPage, this.qPartner, this.qBranch, this.qResponsable, this.qNumeration, this.qLteUtilitie, this.qGteUtilitie, this.qEqUtilitie, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataUtilities = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataUtilities.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }

    });

  }

  onEditUtilitie( id: number ) {

  }

  onShowConfirm() {

  }

  onSubmitUtilitie( frm: any ) {
    if (frm.valid) {

      let verifyUtility = false;

      for (const iterator of this.bodyUtilitie.utilities) {
        if (!iterator.utilitieProduct || Number( iterator.utilitieProduct ) < 0) {
          verifyUtility = true;
        }
      }

      if (verifyUtility) {
        this.onShowAlert( '¡Por favor verifique los datos de utilidad, el ingreso por producto no puede ser menor a cero!', 'warning', 'alertUtilitieModal');
        return;
        // alertUtilitieModal
      }

      if (this.bodyUtilitie.utilities.length === 0) {
        this.onShowAlert( '¡No puede crear una utilidad sin productos asignados a la sucursal!', 'warning', 'alertUtilitieModal');
        return;
      }
      
      console.log(this.bodyUtilitie);
      // tslint:disable-next-line: no-debugger
      debugger;

      if (! this.loadData  ) {

        this.loading = true;
        this.utilitieSvc.onAddUtilitie( this.bodyUtilitie ).subscribe( (res: any) => {

          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css , idComponent} = this.onGetErrors( res.data.showError );
          const { messageDetail, cssDetail, successDetail } = this.onGetErrorsDetail( res.errorsDetail );


          if ( res.data.showError === 0 && successDetail) {
            this.onResetForm();
            this.onShowAlert(message, css, idComponent);
            $('#btnCloseModalUtilitie').trigger('click');
          } else {
            this.onShowAlert(message, css, idComponent);
          }

          if (!successDetail) {
            this.onShowAlert( messageDetail, cssDetail, 'alertUtilitieDetailModal' );
          }

          this.loading = false;

        });

      }

    }
  }

  onResetForm() {
    $('#frmUtilitie').trigger('reset');
    this.bodyUtilitie = new UtilitieModel();
  }

  onUpdateStatus() {

  }

  onChangeBranch() {
    this.bodyUtilitie.totalBrutoUtilities = 0;
    this.bodyUtilitie.totalNetoPatent = 0;
    this.bodyUtilitie.totalIncomeTax = 0;

    this.bodyUtilitie.totalBrutoCompany = 0;
    this.bodyUtilitie.totalBrutoPartner = 0;
    this.bodyUtilitie.totalBrutoResponsable = 0;

    this.bodyUtilitie.totalNetoCompany = 0;
    this.bodyUtilitie.totalNetoPartner = 0;
    this.bodyUtilitie.totalNetoRepsonsable = 0;
    this.bodyUtilitie.utilities = [];

    this.loading = true;
    this.utilitieSvc.onGetTotalBranch( this.bodyUtilitie.idPartner, this.bodyUtilitie.idOfficeBranch ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyUtilitie.totalExpense = res.data.totalGasto;

    });

    this.utilitieSvc.onGetProductComission( this.bodyUtilitie.idPartner, this.bodyUtilitie.idOfficeBranch ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyUtilitie.idResponsable = res.data[0].idResponsable || 0;
      this.bodyUtilitie.responsable = res.data[0].responsable || '';
      this.bodyUtilitie.typeSeller = res.data[0].tipoVendedor || '';

      for (const item of res.data) {
        this.bodyUtilitie.utilities.push( new ComissionUtilidad( item.idProducto, item.nombreProducto, item.porcentajeSocio, item.porcentajeEmpresa, item.porcentajeResponsable, item.porcentajePatente  ) );
      }
      // this.bodyUtilitie.onCalculate();
      this.loading = false;

      // this.dataComissionProduct = res.data;
      console.warn(res);
    });
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertUtilitieTable' ) {

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
    const idComponent = showError === 0 ? 'alertUtilitieTable' : 'alertUtilitieModal';

    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors = ['¡Ya existe una utilidad para esta sucursal en el presente periodo!'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors = ['¡No se encontró un periodo aperturado!'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['No se encontró registro de socio'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de sucursal'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No se encontró registro del responsable'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró registro de empresa'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

  onGetErrorsDetail( errors: any[] ) {
    let successDetail = true;
    const arrErrors = [];
    const cssDetail = errors.length === 0 ? 'success' : 'danger';

    for (const item of errors) {

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 1 ) {
        successDetail = false;
        arrErrors.push('No se encontró registro de socio');
      }

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 2 ) {
        successDetail = false;
        arrErrors.push('No se encontró registro de sucursal');
      }

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 4 ) {
        successDetail = false;
        arrErrors.push('Ya existe una comisión con el mismo producto');
      }

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 8 ) {
        successDetail = false;
        arrErrors.push('No se encontró registro del detalle');
      }

    }


    return { messageDetail: arrErrors.join(', '), cssDetail , successDetail};

  }

  onCalculateTotal( index: number ) {
    this.bodyUtilitie.onChangeUtilidadProducto( index ).then( (respItem: any) => {
      console.log(respItem);
      this.bodyUtilitie.onCalculate();
    });
    
  }

}
