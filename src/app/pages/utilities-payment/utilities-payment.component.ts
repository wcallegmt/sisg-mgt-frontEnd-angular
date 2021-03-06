import { Component, OnInit } from '@angular/core';
import { PartnerService } from '../../services/partner.service';
import { PaymentUtilitieService } from '../../services/payment-utilitie.service';
import { PaymentUtilitieModel } from 'src/app/models/paymentUtilities.model';
import * as $ from 'jquery';
import { PagerService } from 'src/app/services/pager.service';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-utilities-payment',
  templateUrl: './utilities-payment.component.html',
  styleUrls: ['./utilities-payment.component.css']
})
export class UtilitiesPaymentComponent implements OnInit {

  today = this.calendar.getToday();
  maxDate = this.calendar.getToday();

  isDisabled: any;
  isWeekend: any;
  operationDate: any = this.calendar.getToday();

  filesValid = ['JPG', 'JPEG', 'PDF'];
  
  dataPayment: any[] = [];
  dataResponsable: any[] = [];
  dataPartner: any[] = [];
  dataSucursal: any[] = [];
  dataBank: any[] = [];

  dataDetail: any[] = [];
  
  bodyPayment: PaymentUtilitieModel;
  srcFile = '/assets/images/017-upload.png';
  srcVoucher = '';
  validFile = false;
  loading = false;
  loadingTable = false;
  loadingDebt = false;
  loadData = false;
  showInactive = false;
  bloquedPaymentType = false;
  filePayment: File;

  titleModal = 'Nuevo pago de utilidad';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  qPartner = '';
  qOffice = '';
  qPaymentType = '';
  qGteAmount = 0;
  qLteAmount = 0;
  qEqAmount = 0;
  qOperation = '';
  qPeriod = '';
  qBank = '';
  infoPagination = 'Mostrando 0 de 0 registros.';

  infoPayment: any = {};

  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  constructor(private partnerSvc: PartnerService, private paymentUtilitieSvc: PaymentUtilitieService, private pagerSvc: PagerService, private uploadSvc: UploadService, private calendar: NgbCalendar) { }

  ngOnInit() {
    
    this.isDisabled = (date: NgbDate, current: {month: number}) => date.month !== current.month;
    this.isWeekend = (date: NgbDate) =>  this.calendar.getWeekday(date) >= 6;

    this.bodyPayment = new PaymentUtilitieModel();

    this.paymentUtilitieSvc.onGetBank().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataBank = res.data;
    });

    this.onGetResponsable();
    this.onGetPartner();
    this.onGetBranch();
    this.onGetListPayment(1);
  }

  onGetListPayment( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.loading = true;
    this.loadingTable = true;
    this.paymentUtilitieSvc.onGetListPayment( page,
                                              this.showInactive,
                                              this.rowsForPage,
                                              this.qPartner,
                                              this.qOffice,
                                              this.qPaymentType,
                                              this.qGteAmount,
                                              this.qLteAmount,
                                              this.qEqAmount,
                                              this.qOperation,
                                              this.qPeriod,
                                              this.qBank ).subscribe( ( res: any) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      console.log('paginado', res);

      this.dataPayment = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataPayment.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }

      this.loading = false;
      this.loadingTable = false;

    });

  }

  onGetResponsable(): Promise<boolean> {

    return new Promise( ( resolve )  => {
      this.partnerSvc.onGetResponsable('').subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }
  
        this.dataResponsable = res.data;
        resolve( true );
      });
    });

  }

  onGetPartner(): Promise<boolean> {

    return new Promise( (resolve) => {
      this.paymentUtilitieSvc.onGetPartnerForResp( this.bodyPayment.idResponsable ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }
  
        this.dataPartner = res.data;
        resolve( true );
      });
    });

  }

  onGetBranch(): Promise<boolean> {
    return new Promise( (resolve) => {
      this.paymentUtilitieSvc.onGetOfficeBranch( this.bodyPayment.idPartner ).subscribe( (res: any) => {

        if (!res.ok) {
          throw new Error( res.error );
        }
  
        this.dataSucursal = res.data;
        resolve( true );
      });
    });
  }

  async onChangeBranch() {
    const dataTemp = this.dataSucursal.find( element => Number(element.idUtilidad) === Number(this.bodyPayment.idUtilitie) );
    if (!dataTemp) {
      return console.warn('No se encontró registro de sucursal');
    }

    this.bodyPayment.idResponsable = dataTemp.idResponsable;
    this.bodyPayment.idPartner = dataTemp.idSocio;

    // this.bodyPayment.idUtilitie = dataTemp.idUtilidad;
    this.bodyPayment.idOfficeBranch = dataTemp.idSucursal;
    this.bodyPayment.numerationUtilitie = dataTemp.correlativoUtilidad || '000-0000';
    this.bodyPayment.period = dataTemp.period || 'MES-AÑO';

    this.onGetPartner();

    this.loadingDebt = true;
    
    await this.onGetVerifyLastPay();
    this.onGetTotalDebt();
    await this.onGetDetailUtilitie();
  }

  onGetDetailUtilitie(): Promise<boolean> {
    return new Promise( (resolve) => {
      this.paymentUtilitieSvc.onGetDetailPayment( this.bodyPayment.idUtilitie ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }
  
        this.dataDetail = res.data;
        resolve( true );
      });
    });
  }

  onGetTotalDebt() {
    
    this.paymentUtilitieSvc.onGetTotalDebt( this.bodyPayment.idPaymentUtilitie , this.bodyPayment.idUtilitie, this.bodyPayment.paymentyType ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      
      console.log( 'deuda', res);
      this.bodyPayment.debt = res.data.totalDeuda;
      this.bodyPayment.totalUtilitie = res.data.totalUtilitie || 0;
      this.bodyPayment.totalPayed = res.data.totalPayed;
      this.bodyPayment.isPayed = res.data.estaPagado;

      if (res.data.estaPagado) {
        this.onShowAlert( '¡La utilidad de esta sucursal ya fue pagada!', 'warning', 'alertModalPayment' );
      } else {
        $(`#alertModalPayment`).html('');
      }

      this.loadingDebt = false;
    });

  }

  onGetVerifyLastPay(): Promise<boolean> {
    return new Promise( (resolve) => {

      this.paymentUtilitieSvc.onLastPayUtilitie( this.bodyPayment.idUtilitie ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }
  
        if (res.data.exitsPayment) {
          this.bloquedPaymentType = false;
          this.bodyPayment.paymentyType = res.data.tipoPago || 'UE';
          this.bloquedPaymentType = true;
        } else {
          this.bloquedPaymentType = false;
        }

        resolve( true );
      });

    });
  }

  onChangeFilePayment( file: FileList ) {

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
    // this.nameFileExpense = file[0].name;
    this.srcFile = './assets/images/001-accepted.png';
    this.filePayment = file.item(0);

  }

  async onResetForm() {
    this.bodyPayment = new PaymentUtilitieModel();
    $('#frmPayment').trigger('reset');
    $('#frmPayment').trigger('refresh');
    $('#alertModalPayment').html('');

    this.operationDate = this.calendar.getToday();

    // console.log(this.bodyPayment.dateOperation);

    this.titleModal = 'Nuevo pago de utilidad';
    this.textButton = 'Guardar';
    this.loadData = false;
    this.bloquedPaymentType = false;
    this.filePayment = null;
    this.validFile = false;
    this.dataDetail = [];

    this.bodyPayment.idResponsable = null;
    this.bodyPayment.idPartner = 0;

    await this.onGetResponsable();
    await this.onGetPartner();
    await this.onGetBranch();

  }

  onSubmitPayment( frmPayment: any ) {
    if (frmPayment.valid) {

      if ( !this.loadData ) {

        const tempMonth = Number( this.operationDate.month ) < 9 ? '0' + this.operationDate.month : this.operationDate.month ;
        const tempDay = Number( this.operationDate.day ) < 9 ? '0' + ( Number( this.operationDate.day ) + 1 ) : ( Number( this.operationDate.day )  + 1 );
  
        this.bodyPayment.dateOperation = `${ this.operationDate.year }-${ tempMonth }-${ tempDay }`;

        this.loading = true;

        this.paymentUtilitieSvc.onAddPayment( this.bodyPayment ).subscribe( async (res: any) => {

          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( Number( res.data.showError ) );
          this.onShowAlert( message, css, idComponent );

          if ( res.data.showError === 0) {

            if (this.filePayment) {
              await this.onUploadVoucher( res.data.idPayment );
            }

            $('#btnCloseModalUtilitiePayment').trigger('click');
            this.onResetForm();
            this.onGetListPayment(1);


          }
          this.loading = false;

        });

      } else {
        this.loading = true;
        this.paymentUtilitieSvc.onUpdatePayment( this.bodyPayment ).subscribe( async(res: any) => {

          if (!res.ok) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( Number( res.data.showError ) );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {

            if (this.filePayment) {
              console.log('subiendo voucher');
              await this.onUploadVoucher( this.bodyPayment.idPaymentUtilitie );
            }

            $('#btnCloseModalUtilitiePayment').trigger('click');
            this.onResetForm();
            this.onGetListPayment(1);

          }
          this.loading = false;

        });
      }

    }
  }

  onUploadVoucher( idPayment: number ): Promise<any> {
    return new Promise( (resolve) => {
      this.uploadSvc.onUploadDocument( 'payment', idPayment, this.filePayment  ).subscribe( (resUpload: any) => {
        if (!resUpload.ok) {
          throw new Error( resUpload.error );
        }
        
        resolve( {ok: true, info: resUpload} );
        console.log('info upload', resUpload);
      });
    });
  }

  async onEditPayment( id: number ) {
    this.bodyPayment = new PaymentUtilitieModel();
    $('#btnShowModalUtilitiesPayment').trigger('click');
    
    this.loading = true;
    const dataTemp = this.dataPayment.find( element => Number( element.idPagoUtilidad ) === id );
    if (!dataTemp) {
      throw new Error( 'No se encontró registro, pago de utilidad' );
    }

    this.bodyPayment.idResponsable = null;
    this.bodyPayment.idPartner = 0;

    await this.onGetResponsable();
    await this.onGetPartner();
    await this.onGetBranch();

    // console.log(dataTemp);

    this.bodyPayment.idPaymentUtilitie = dataTemp.idPagoUtilidad;
    this.bodyPayment.idResponsable = dataTemp.idResponsable;
    this.bodyPayment.idPartner = dataTemp.idSocio;
    this.bodyPayment.idOfficeBranch = dataTemp.idSucursal;
    this.bodyPayment.idUtilitie = dataTemp.idUtilidad;
    this.bodyPayment.paymentyType = dataTemp.tipoPago;
    this.bodyPayment.debt = dataTemp.deuda;
    this.bodyPayment.idBank = dataTemp.idBanco;
    this.bodyPayment.amountPayable = dataTemp.montoPagar;
    this.bodyPayment.numerationUtilitie = dataTemp.correlativoUtilidad;
    this.bodyPayment.totalUtilitie = dataTemp.totalUtilidad || 0;
    this.bodyPayment.totalPayed = dataTemp.totalPagado || 0;
    this.bodyPayment.period = dataTemp.period;

    if (! this.dataSucursal.find( element => Number(element.idUtilidad) === dataTemp.idUtilidad ) ) {
      
      this.dataSucursal.push({ idUtilidad: dataTemp.idUtilidad, nombreSucursal: dataTemp.nombreSucursalEdit });
    }


    const tempOperationDate = new Date( dataTemp.fechaOperacion );
    this.operationDate = {
      year : tempOperationDate.getFullYear(),
      month : tempOperationDate.getMonth() + 1,
      day : tempOperationDate.getDate()
    };

    this.bodyPayment.numberOperation = dataTemp.operacion;
    this.bodyPayment.observation = dataTemp.observacion;

    // console.log(this.bodyPayment.dateOperation);

    this.titleModal = 'Editar pago de utilidad';
    this.textButton = 'Guardar cambios';
    this.loadData = true;
    
    this.bloquedPaymentType = true;
    await this.onGetDetailUtilitie();
    // $('#frmPayment').trigger('refresh');
    this.loading = false;

  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertPaymentTable' ) {

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

    const action = this.loadData ? 'actualizó' : 'agregó';
    let arrErrors = showError === 0 ? [`Se ${ action } un pago de utilidad con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertPaymentTable' : 'alertModalPayment';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('con este número de operación');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['No se encontró la utilidad asociada a la sucursal'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['La utilidad de la sucursal ya fue pagada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No existe la sucursal especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró registro de la empresa'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['No se encontró registro pago de utilidad'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

  onShowConfirmDelete( id: number ) {
    const dataTemp = this.dataPayment.find( element => Number( element.idPagoUtilidad ) === id );
    if (!dataTemp) {
      throw new Error( 'No se encontró registro, pago de utilidad' );
    }

    this.bodyPayment.idPaymentUtilitie = dataTemp.idPagoUtilidad;
  }

  onUpdateStatus() {
    this.paymentUtilitieSvc.onDeletePayment( this.bodyPayment.idPaymentUtilitie ).subscribe( (res: any) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertPaymentTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se eliminó un pago de utilidad con éxito`, css, 'alertPaymentTable');
        this.onResetForm();
        this.onGetListPayment(1);
      }
      $('#btnCloseConfirmPayUtilitie').trigger('click');
      this.loading = false;

    });
  }

  onLoadVoucher( id: number ) {
    const dataTemp = this.dataPayment.find( element => Number( element.idPagoUtilidad ) === id );
    if (!dataTemp) {
      throw new Error( 'No se encontró registro, pago de utilidad' );
    }
    this.srcVoucher = environment.URI_API + `/Image/payment/${ dataTemp.comprobante }?token=${ localStorage.getItem('token') }`;
    this.infoPayment = {
      datePay: new Date( dataTemp.fechaOperacion ),
      operation: dataTemp.operacion,
      amount: dataTemp.montoPagar
    };
  }
}
