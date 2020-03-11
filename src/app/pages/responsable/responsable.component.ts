import { Component, OnInit } from '@angular/core';
import { ResponsableModel, ComisionResponsableModel } from 'src/app/models/responsable.model';
import { PagerService } from '../../services/pager.service';
import { ResponsableService } from '../../services/responsable.service';
import * as $ from 'jquery';
import { EmployeeService } from '../../services/employee.service';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})

export class ResponsableComponent implements OnInit {
  today = this.calendar.getToday();
  maxDate = this.calendar.getToday();

  filesValid = ['JPG', 'JPEG', 'PNG'];

  isDisabled: any;
  isWeekend: any;
  brithDate = {
    year: this.calendar.getToday().year - 18,
    month: this.calendar.getToday().month,
    day: this.calendar.getToday().day
  };
  
  loadImg = false;
  validFile = false;
  validSizeFile = false;
  srcImage = './assets/vuexy/images/logo/no-image.jpg';
  fileResponsable: File;
  
  dataResponsable: any[] = [];
  dataCompany: any[] = [];
  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  dataProduct: any[] = [];
  bodyResponsable: ResponsableModel;
  qName = '';
  qDocument = '';
  qUsuario = '';
  qTypeSeller = '';
  showInactive = false;
  loading = false;
  loadingTable = false;
  loadData = false;
  titleModal = 'Nuevo responsable';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  lenghtDocument = 8;

  constructor( private pagerSvc: PagerService, private respSvc: ResponsableService, private employeeSvc: EmployeeService, private calendar: NgbCalendar, private uploadSvc: UploadService ) { }

  ngOnInit() {

    this.isDisabled = (date: NgbDate, current: {month: number}) => date.month !== current.month;
    this.isWeekend = (date: NgbDate) =>  this.calendar.getWeekday(date) >= 6;

    this.bodyResponsable = new ResponsableModel();

    this.employeeSvc.onGetTypeDocument().subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataTypeDocument = res.data;
    });

    this.employeeSvc.onGetNationaltity('').subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;
    });

    this.respSvc.onGetListProduct( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataProduct = res.data;
    });

    this.onGetListResponsable(1);
  }

  onGetListResponsable( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.loadingTable = true;

    this.respSvc.onGetListresponsable( page, this.rowsForPage, this.qName, this.qDocument, this.qUsuario, this.qTypeSeller, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataResponsable = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataResponsable.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }
      
      this.loadingTable = false;

    });
  }

  onEditResponsable( idResponsable: number ) {
    const dataTemp = this.dataResponsable.find( element => element.idResponsable ===  idResponsable);
    if (!dataTemp) {
      throw Error('No se encontró empleado');
    }

    this.loadData = true;

    this.titleModal = 'Editar responsable';
    this.textButton = 'Guardar cambios';

    this.bodyResponsable.idResponsable = dataTemp.idResponsable;
    this.bodyResponsable.idTypeDocument = dataTemp.idTipoDocumento;
    this.bodyResponsable.idNationality = dataTemp.idNacionalidad;
    this.bodyResponsable.typeSeller = dataTemp.tipoVendedor;
    this.bodyResponsable.document = dataTemp.documento;
    this.bodyResponsable.name = dataTemp.nombre;
    this.bodyResponsable.surname = dataTemp.apellido;
    this.bodyResponsable.email = dataTemp.email;
    this.bodyResponsable.phone = dataTemp.telefono;
    this.bodyResponsable.address = dataTemp.direccion;
    const birthDate = new Date( dataTemp.fechaNacimiento );
    this.brithDate = {
      year : birthDate.getFullYear(),
      month : birthDate.getMonth() + 1,
      day : birthDate.getDate()
    };
    this.bodyResponsable.sex = dataTemp.sexo;
    this.bodyResponsable.nameUser = dataTemp.nombreUsuario;

    this.srcImage = environment.URI_API + `/Image/user/${dataTemp.imagen || ':D'}?token=${ localStorage.getItem('token') }`;

    $('#btnShowModalResponsable').trigger('click');

    // this.loading = true;

    // this.respSvc.onGetComisionResponsable( dataTemp.idResponsable ).subscribe( (res: any) => {
    //   if ( !res.ok ) {
    //     throw new Error( res.error );
    //   }


    //   this.bodyResponsable.comision = res.data;
    //   this.loading = false;
    // });

    // console.log('click');
  }

  onShowConfirm( idResponsable: number ) {
    const dataTemp = this.dataResponsable.find( element => element.idResponsable ===  idResponsable);
    if (!dataTemp) {
      throw Error('No se encontró empleado');
    }

    this.bodyResponsable.idResponsable = dataTemp.idResponsable;
    this.bodyResponsable.statusRegister = !dataTemp.estadoRegistro;
  }

  onSubmitResponsable( $event ) {

    // validaciones en comision por producto

    // if (this.bodyResponsable.comision.length === 0) {
    //   // throw new Error( 'Debe especificar la comisión por producto' );
    //   this.onShowAlert( 'Debe especificar la comisión por producto', 'warning', 'alertResponsableModal' );
    //   return;
    // }

    // let verifyProduct = true;
    // let verifyPercent = true;

    // for (const comision of this.bodyResponsable.comision) {
    //   if (!comision.idProduct || comision.idProduct === 0 || comision.idProduct > 20) {
    //     verifyProduct = false;
    //   }

    //   if (!comision.percentComision || comision.percentComision <= 0 || comision.percentComision > 20 ) {
    //     verifyPercent = false;
    //   }
    // }

    // if ( ! verifyProduct || !verifyPercent ) {
    //   // throw new Error( 'Verifique la información de comisión, especificar el producto y el porcentaje de comisión debe ser mayor a cero.' );
    //   this.onShowAlert( 'Verifique la información de comisión, especificar el producto y el porcentaje de comisión debe ser mayor a cero y menor o igual a 20.'
    //   , 'warning'
    //   , 'alertResponsableModal' );

    //   return;
    // }
    // $('#alertResponsableModal').html('');

    this.loading = true;
    if ($event.valid) {

      const tempMonth = Number( this.brithDate.month ) < 9 ? '0' + this.brithDate.month : this.brithDate.month ;
      const tempDay = Number( this.brithDate.day ) < 9 ? '0' + ( Number( this.brithDate.day ) + 1 ) : ( Number( this.brithDate.day )  + 1 );

      this.bodyResponsable.dateBorn = `${ this.brithDate.year }-${ tempMonth }-${ tempDay }`;

      if (!this.loadData) {
        this.respSvc.onAddResponsable( this.bodyResponsable ).subscribe( async (res: any) => {

          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          // const { messageComission, cssComission, successComission } = this.onGetErrorsComission( res.errorsComission || [] );
          this.onShowAlert(message, css, idComponent);

          if ( Number(res.data.showError) === 0 ) {

            if (this.fileResponsable != null) {
              await this.onUploadPhoto(res.data.idPersona);
            }

            $('#btnCloseModalResponsable').trigger('click');
            // this.onResetForm();
            this.onGetListResponsable(1);

          } // } else {
          //   if (Number(res.data.showError) !== 0) {
          //     this.onShowAlert(message, css);
          //   }
          //   if (!successComission) {
          //     this.onShowAlertComission(messageComission, cssComission);
          //   }
          // }

          this.loading = false;

        });
      } else {

        this.respSvc.onUpdateResponsable( this.bodyResponsable ).subscribe( async (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);
          // const { messageComission, cssComission, successComission } = this.onGetErrorsComission( res.errorsComission || [] );

          if ( res.data.showError === 0 ) {

            if (this.fileResponsable != null) {
              await this.onUploadPhoto(res.data.idPersona);
            }

            $('#btnCloseModalResponsable').trigger('click');
            // this.onResetForm();
            this.onGetListResponsable(1);
          }
          // else {
          //   if (res.data.showError !== 0) {
          //     this.onShowAlert(message, css);
          //   }
          //   if (!successComission) {
          //     this.onShowAlertComission(messageComission, cssComission);
          //   }
          // }

          this.loading = false;

        });

      }
    }
  }

  onUploadPhoto( idPerson: number ): Promise<boolean> {
    return new Promise( (resolve) => {
      this.uploadSvc.onUploadImg( 'user', idPerson, this.fileResponsable ).subscribe( (res: any) => {
          if (!res.ok) {
            console.warn(res.error);
            resolve( false );
          }

          console.log(res);
          resolve( true );
      });
    });
  }

  onChangeImg( file: FileList ) {

    const auxtype = file[0].name;
    const typeFile = auxtype.split('.');
    const extension = typeFile[typeFile.length - 1];
    const size = parseFloat( (file[0].size / 1000).toFixed(2) );

    if (this.filesValid.indexOf( extension.toUpperCase() ) < 0) {
      this.validFile = false;
      this.loadImg = false;
      // this.srcImage = './assets/images/005-declined.png';
      return;
    }

    if (size > 250) {
      this.validSizeFile = false;
      this.loadImg = false;
      return;
    }
    this.fileResponsable = file.item(0);

    this.validFile = true;
    this.validSizeFile = true;

    this.loadImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.srcImage = event.target.result;
      this.loadImg = false;
    };
    reader.readAsDataURL(this.fileResponsable);
  }

  onResetForm() {
    $('#frmResponsable').trigger('reset');
    this.bodyResponsable = new ResponsableModel();
    $('#frmResponsable').trigger('refresh');
    this.loadData = false;
    this.titleModal = 'Nuevo responsable';
    this.textButton = 'Guardar';
    $('#alertResponsableModal').html('');
    this.fileResponsable = null;
    this.brithDate = {
      year: this.calendar.getToday().year - 18,
      month: this.calendar.getToday().month,
      day: this.calendar.getToday().day
    };
    this.srcImage = './assets/vuexy/images/logo/no-image.jpg';
  }

  onUpdateStatus() {
    this.loading = true;

    this.respSvc.onDeleteResponsable( this.bodyResponsable ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertResponsableTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } un responsable con éxito`, css, 'alertResponsableTable');
        this.onResetForm();
        this.onGetListResponsable(1);
      }
      $('#btnCloseConfirmResponsable').trigger('click');
      this.loading = false;
    });
  }

  onChangeTypeDocument() {
    const dataTemp = this.dataTypeDocument.find( element => Number(element.idTipoDocumento) === Number(this.bodyResponsable.idTypeDocument ) );

    if (dataTemp) {
      this.lenghtDocument = dataTemp.longitud;
    }
  }

  onAddComision() {
    this.bodyResponsable.comision.push( new ComisionResponsableModel() );
  }

  onChangeProductResp( indexComision: number ) {
    const comisionCurrent = this.bodyResponsable.comision[indexComision];
    // console.log('current', comisionCurrent);
    const countRepeat = this.bodyResponsable.comision.filter( element => element.idProduct === comisionCurrent.idProduct ).length;
    if (countRepeat > 1) {
      $('#frmComission').trigger('reset');
      this.bodyResponsable.comision[indexComision].idProduct = null;
      // console.log(countRepeat);
    }
  }

  onDeleteComission(index: number) {
    this.bodyResponsable.comision[index] = null;
    this.bodyResponsable.comision = this.bodyResponsable.comision.filter( element => element !== null );
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertResponsableModal' ) {

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

  onShowAlertComission( msg = '', css = 'success', idComponent = 'alertResponsableComission' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;
    
    $(`#${idComponent}`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    const action = this.loadData ? 'actualizó' : 'agregó';
    let arrErrors = showError === 0 ? [`Se ${ action } un responsable con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertResponsableTable' : 'alertResponsableModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este documento');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('con este usuario');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors.push('con este email');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de nacionalidad'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No se encontró registro de empresa'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró registro del responsable'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['Existen socios relacionados con este responsable, elimine socio'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

  onGetErrorsComission( arrError: any[] ) {
    console.log(arrError.length);
    let successComission = true;
    const arrMessages = [];
    const cssComission = arrError.length > 0 ? 'danger' : 'success';

    for (const error of arrError) {

      // tslint:disable-next-line: no-bitwise
      if (Number(error.showError) & 64) {
        successComission = false;
        arrMessages.push('No se encontró registro de producto');
      }

      // tslint:disable-next-line: no-bitwise
      if (Number(error.showError) & 128) {
        successComission = false;
        arrMessages.push('No se encontró registro de producto');
      }

      // tslint:disable-next-line: no-bitwise
      if (Number(error.showError) & 256) {
        successComission = false;
        const dataProductTemp = this.dataProduct.find( element => element.idProducto === Number(error.idProduct) );
        let nameProduct = '';
        if (dataProductTemp) {
          nameProduct = dataProductTemp.nombreProducto;
        }
        arrMessages.push('Ya existe una comisión con el producto: ' + nameProduct);
      }

    }

    return { messageComission: arrMessages.join(', '), cssComission, successComission };
  }
}
