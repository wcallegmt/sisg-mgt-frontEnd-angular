import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from '../../services/branch-office.service';
import { ExpenseService } from '../../services/expense.service';
import { UtilitieModel, ComissionUtilidad } from '../../models/utilitie.model';
import { UtilitiesService } from '../../services/utilities.service';
import { PeriodService } from '../../services/period.service';
import { ConfigUtilitiesService } from '../../services/config-utilities.service';
import * as $ from 'jquery';
import { PagerService } from '../../services/pager.service';
import { ComisionProductInterface, UilitieDataChanges } from '../../interfaces/comisionProduct.interface';

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

  dataUtilitieUpdated: UilitieDataChanges = {
    idResponsable: 0,
    responsable: '',
    typeSeller: '',
    totalExpense: 0,
    incomeTax: 0,
    details: []
  };

  changedInfoUtilitie = false;
  
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
  loadingDetails = false;
  loadingCalculate = false;
  percentCalculate = 0;
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
    const dataTemp = this.dataUtilities.find( element => element.idUtilidad === id );

    if (!dataTemp) {
      throw new Error( 'No se encontró utilidad' );
    }

    this.utilitieSvc.onGetDetailUtilitie( id ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.loadData = true;
      this.titleModal = 'Edita utilidad';
      this.textButton = 'Guardar cambios';

      this.bodyUtilitie.idUtilitie = dataTemp.idUtilidad;
      this.bodyUtilitie.idPartner = dataTemp.idSocio;
      this.bodyUtilitie.idOfficeBranch = dataTemp.idSucursal;
      this.bodyUtilitie.idResponsable = dataTemp.idResponsable;
      this.bodyUtilitie.responsable = dataTemp.nombreResponsable;
      this.bodyUtilitie.typeSeller = dataTemp.tipoVendedor;
      this.bodyUtilitie.totalExpense = dataTemp.totalGasto;

      this.bodyUtilitie.incomeTax = Number(dataTemp.porcentajeImpuestoRenta);
      this.bodyUtilitie.idPeriod = dataTemp.idPeriodo;
      this.bodyUtilitie.totalBrutoUtilities = dataTemp.totalIngresoBruto;
      this.bodyUtilitie.totalNetoPatent = dataTemp.totalNetoPatente;
      this.bodyUtilitie.totalIncomeTax = dataTemp.totalImpuestoRenta;
      this.bodyUtilitie.totalBrutoCompany = dataTemp.totalBrutoEmpresa;
      this.bodyUtilitie.totalBrutoPartner = dataTemp.totalBrutoSocio;
      this.bodyUtilitie.totalBrutoResponsable = dataTemp.totalBrutoResponsable;
      this.bodyUtilitie.totalNetoCompany = dataTemp.totalNetoEmpresa;
      this.bodyUtilitie.totalNetoPartner = dataTemp.totalNetoSocio;
      this.bodyUtilitie.totalNetoRepsonsable = dataTemp.totalNetoResponsable;

      for (const detail of res.data) {
        // idProduct: number, nameProduct: string, percentPartner: number, percentCompany: number, percentResponsable: number, percentPatent: number
        const detailUtilitie = new ComissionUtilidad( detail.idProducto, detail.nombreProducto, detail.porcentajeSocio, detail.porcentajeEmpresa, detail.porcentajeResponsable, detail.porcentajePatente );

        detailUtilitie.idDetailUtilitie = detail.idDetalleUtilidad;
        detailUtilitie.inBrutaCompany = detail.inBrutaEmpresa;
        detailUtilitie.inBrutaPartner = detail.inBrutaSocio;
        detailUtilitie.uBrutaCompany = detail.uBrutaEmpresa;
        detailUtilitie.uBrutaPartner = detail.uBrutaSocio;
        detailUtilitie.uBrutaResponsable = detail.uBrutaResponsable;

        detailUtilitie.uNetaPatent = detail.uNetaPatente;
        detailUtilitie.uNetaCompany = detail.uNetaEmpresa;
        detailUtilitie.uNetaPartner = detail.uNetaSocio;
        detailUtilitie.uNetaResponsable = detail.uNetaResponsable;
        detailUtilitie.incomeTaxProduct = detail.impuestoProducto;
        detailUtilitie.utilitieProduct = detail.utilidadProducto;
        detailUtilitie.utilitieBrutaProduct = detail.utilidadBrutaProducto;
        detailUtilitie.utilitieNetaProduct = detail.utilidadNetaProducto;

        this.bodyUtilitie.utilities.push( detailUtilitie );
      }

      this.onChangePartner();

      this.onVeriifyUpdateInfo();

      console.log(res);
      $('#btnShowModalUtilitie').trigger('click');
    });

  }

  async onVeriifyUpdateInfo() {

    const newIncomeTax = await this.onGetIncomeTax();
    const newTotalExpense = await this.onGetTotalExpenseBranch();
    const newComission = await this.onGetComissionForProduct();
    console.log(newComission);

    if ( this.bodyUtilitie.incomeTax !== newIncomeTax ) {
      this.changedInfoUtilitie = true;
    }

    if (this.bodyUtilitie.totalExpense !== newTotalExpense) {
      this.changedInfoUtilitie = true;
    }

    this.dataUtilitieUpdated.idResponsable = newComission[0].idResponsable;
    this.dataUtilitieUpdated.responsable = newComission[0].responsable;
    this.dataUtilitieUpdated.typeSeller = newComission[0].tipoVendedor;
    this.dataUtilitieUpdated.incomeTax = newIncomeTax;
    this.dataUtilitieUpdated.totalExpense = newTotalExpense;

    const detailsUpdated: ComisionProductInterface[] = [];
    for (const comission of newComission) {

      let changePercentPatent = false;
      let changePercentCompany = false;
      let changePercentPartner = false;
      let changePercentResponsable = false;

      const oldComisionProduct = this.bodyUtilitie.utilities.find( element => element.idProduct === comission.idProducto );

      if (oldComisionProduct.percentPatent !== Number(comission.porcentajePatente)) {
        changePercentPatent = true;
        this.changedInfoUtilitie = true;
      }

      if (oldComisionProduct.percentCompany !== Number(comission.porcentajeEmpresa)) {
        changePercentCompany = true;
        this.changedInfoUtilitie = true;
      }

      if (oldComisionProduct.percentPartner !== Number(comission.porcentajeSocio)) {
        changePercentPartner = true;
        this.changedInfoUtilitie = true;
      }

      if (oldComisionProduct.percentResponsable !== Number(comission.porcentajeResponsable)) {
        changePercentResponsable = true;
        this.changedInfoUtilitie = true;
      }

      detailsUpdated.push( {
        idProduct: comission.idProducto,
        nameProduct: comission.nombreProducto,
        percentPatent: comission.porcentajePatente,
        percentCompany: comission.porcentajeEmpresa,
        percentPartner: comission.porcentajeSocio,
        percentResponsable: comission.porcentajeResponsable,
        idResponsable: comission.idResponsable,
        responsable: comission.responsable,
        typeSeller: comission.tipoVendedor,
        directComapny: comission.directoEmpresa,

        changePercentPatent,
        changePercentCompany,
        changePercentPartner,
        changePercentResponsable
      } );

    }
    this.dataUtilitieUpdated.details = detailsUpdated;

  }

  onGetTotalExpenseBranch(): Promise<number> {
    return new Promise( (resolve) => {

      this.utilitieSvc.onGetTotalBranch( this.bodyUtilitie.idPartner, this.bodyUtilitie.idOfficeBranch ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        resolve( res.data.totalGasto || 0 );

      });

    });
  }

  async onUpdateNewInfoAndCalculate() {
    this.loadingDetails = true;

    if (this.changedInfoUtilitie) {

      this.bodyUtilitie.idResponsable = this.dataUtilitieUpdated.idResponsable;
      this.bodyUtilitie.responsable = this.dataUtilitieUpdated.responsable;
      this.bodyUtilitie.typeSeller = this.dataUtilitieUpdated.typeSeller;

      this.bodyUtilitie.incomeTax = this.dataUtilitieUpdated.incomeTax;
      this.bodyUtilitie.totalExpense = this.dataUtilitieUpdated.totalExpense;

      for (const element of this.dataUtilitieUpdated.details) {


        let index = null;
        if (element.changePercentPatent || element.changePercentCompany || element.changePercentPartner || element.changePercentResponsable) {
          index = this.bodyUtilitie.utilities.findIndex( utilitie => utilitie.idProduct === element.idProduct );
          this.bodyUtilitie.utilities[index].nameProduct = element.nameProduct;
          this.bodyUtilitie.utilities[index].percentPatent = element.percentPatent;
          this.bodyUtilitie.utilities[index].percentCompany = element.percentCompany;
          this.bodyUtilitie.utilities[index].percentPartner = element.percentPartner;
          this.bodyUtilitie.utilities[index].percentResponsable = element.percentResponsable;
          console.log(this.bodyUtilitie.utilities[index].percentResponsable);

          await this.bodyUtilitie.onChangeUtilidadProducto( index );

        }
      }

      this.bodyUtilitie.onCalculate();

    }
    
    setTimeout(() => {
      
      this.loadingDetails = false;
    }, 400);
    console.log('update new info');
  }

  onGetComissionForProduct(): Promise<any[]> {
    return new Promise( (resolve) => {

      this.utilitieSvc.onGetProductComission( this.bodyUtilitie.idPartner, this.bodyUtilitie.idOfficeBranch ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        resolve( res.data || [] );

      });

    });
  }

  onGetIncomeTax(): Promise<number> {
    return new Promise( (resolve) => {

      this.configUSvc.onGetConfigUtilities().subscribe( (res: any) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        resolve( res.data.impuestoRenta || 0.00 );

      });

    });
  }

  onShowConfirm( id: number ) {
    const dataTemp = this.dataUtilities.find( element => element.idUtilidad === id );

    if ( ! dataTemp ) {
      throw new Error('No se encontró área');
    }
    this.bodyUtilitie.idUtilitie = dataTemp.idUtilidad;
    this.bodyUtilitie.statusRegister = !dataTemp.estadoRegistro;
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
        this.onShowAlert( '¡Verifique los datos de utilidad, el ingreso por producto no puede ser menor o igual a cero!', 'warning', 'alertUtilitieModal');
        return;
        // alertUtilitieModal
      }

      if (this.bodyUtilitie.utilities.length === 0) {
        this.onShowAlert( '¡No puede crear una utilidad sin productos asignados a la sucursal!', 'warning', 'alertUtilitieModal');
        return;
      }
      
      // console.log(this.bodyUtilitie);
      // tslint:disable-next-line: no-debugger
      // debugger;

      if (! this.loadData  ) {

        this.loading = true;
        this.utilitieSvc.onAddUtilitie( this.bodyUtilitie ).subscribe( (res: any) => {

          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css , idComponent} = this.onGetErrors( res.data.showError );
          const { messageDetail, cssDetail, successDetail } = this.onGetErrorsDetail( res.errorsDetail );


          if ( res.data.showError === 0 && successDetail) {
            this.ongetListUtilities(1);
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

      } else {
        this.loading = true;
        this.utilitieSvc.onUpdateUtilitie( this.bodyUtilitie ).subscribe( (res: any) => {

          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css , idComponent} = this.onGetErrors( res.data.showError );
          const { messageDetail, cssDetail, successDetail } = this.onGetErrorsDetail( res.errorsDetail );


          if ( res.data.showError === 0 && successDetail) {
            this.ongetListUtilities(1);
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
    this.loadData = false;
    this.titleModal = 'Nueva utilidad';
    this.textButton = 'Guardar';
    this.changedInfoUtilitie = false;
  }

  onUpdateStatus() {
    this.loading = true;
    this.utilitieSvc.onDeleteUtilitie( this.bodyUtilitie ).subscribe( (res: any) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertUtilitieTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertUtilitieTable');
        this.onResetForm();
        this.ongetListUtilities(1);
      }
      $('#btnCloseConfirmUtilitie').trigger('click');
      this.loading = false;

    });
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

    this.loadingDetails = true;
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
      this.loadingDetails = false;

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

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['¡La utilidad fue cerrada, comuniquese con el adminidtrador!'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 128 ) {
      arrErrors = ['No se encontró registro de utilidad'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 256 ) {
      arrErrors = ['¡El periodo de la utilidad ha sido cerrado!'];
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
